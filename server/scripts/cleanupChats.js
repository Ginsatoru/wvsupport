// One-off cleanup for chat threads created by the old double-save bug.
// Run once from the server folder:  node scripts/cleanupChats.js
require("dotenv").config({ path: __dirname + "/../.env" });
const mongoose = require("mongoose");
const Message = require("../models/Message");

const SAME_LINE_WINDOW_MS = 10000; // same sender + content within 10s = duplicate

const dedupeLines = (lines) => {
  const sorted = [...lines].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  return sorted.filter(
    (line, i) =>
      !sorted
        .slice(0, i)
        .some(
          (prev) =>
            prev.sender === line.sender &&
            prev.content === line.content &&
            Math.abs(new Date(line.timestamp) - new Date(prev.timestamp)) < SAME_LINE_WINDOW_MS
        )
  );
};

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/wv-support");

  // 1. "replied" status was removed — move those threads back to "open"
  const replied = await Message.updateMany(
    { status: "replied" },
    { $set: { status: "open" } },
    { timestamps: false }
  );

  // 2. Merge duplicate threads per sessionId and drop duplicate lines
  const threads = await Message.find({ sessionId: { $type: "string" } }).sort({ createdAt: 1 }).lean();
  const bySession = new Map();
  threads.forEach((t) => bySession.set(t.sessionId, [...(bySession.get(t.sessionId) || []), t]));

  let threadsRemoved = 0;
  let linesRemoved = 0;

  for (const group of bySession.values()) {
    const [keep, ...extra] = group;
    const allLines = group.flatMap((t) => t.messages || []);
    const lines = dedupeLines(allLines);
    if (!extra.length && lines.length === allLines.length) continue;

    const update = {
      messages: lines,
      status: group.some((t) => t.status !== "closed") ? "open" : "closed",
    };
    const user = keep.user || extra.find((t) => t.user)?.user;
    if (user) update.user = user;

    await Message.updateOne({ _id: keep._id }, { $set: update }, { timestamps: false });
    if (extra.length) await Message.deleteMany({ _id: { $in: extra.map((t) => t._id) } });

    threadsRemoved += extra.length;
    linesRemoved += allLines.length - lines.length;
  }

  // 3. Replace the old sessionId index with a unique one so duplicates can't come back
  await Message.collection.dropIndex("sessionId_1").catch(() => {});
  await Message.syncIndexes();

  console.log(`✅ Replied → open: ${replied.modifiedCount}`);
  console.log(`✅ Duplicate threads merged: ${threadsRemoved}`);
  console.log(`✅ Duplicate lines removed: ${linesRemoved}`);
  await mongoose.disconnect();
};

run().catch(async (err) => {
  console.error("❌ Cleanup failed:", err);
  await mongoose.disconnect();
  process.exit(1);
});