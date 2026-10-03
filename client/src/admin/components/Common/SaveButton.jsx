import React, { useCallback, useRef, useState } from "react";

/**
 * Save state with real upload progress, shared by every admin form.
 *   const save = useSaveProgress();
 *   const res = await save.run((onProgress) => saveSomething(body, onProgress));
 * Progress follows the upload; it holds at 99% while the server finishes, then shows "Done".
 */
export const useSaveProgress = () => {
  const [status, setStatus] = useState("idle"); // idle | saving | done
  const [progress, setProgress] = useState(0);
  const resetTimer = useRef(null);

  const run = useCallback(async (task) => {
    clearTimeout(resetTimer.current);
    setStatus("saving");
    setProgress(0);
    try {
      const result = await task((percent) => setProgress(Math.min(percent, 99)));
      setProgress(100);
      setStatus("done");
      resetTimer.current = setTimeout(() => {
        setStatus("idle");
        setProgress(0);
      }, 1500);
      return result;
    } catch (err) {
      setStatus("idle");
      setProgress(0);
      throw err;
    }
  }, []);

  return { status, progress, run, saving: status === "saving" };
};

/**
 * Save button that fills from left to right as the upload progresses;
 * the text turns from dark to light where the fill passes over it.
 *   <SaveButton state={save} />   (type="submit" by default)
 */
const SaveButton = ({ state, label = "Save changes", type = "submit", className = "" }) => {
  const { status, progress } = state;
  const text = status === "saving" ? "Saving" : status === "done" ? "Done" : label;
  const percent = status === "saving" ? `${progress}%` : "";
  const fill = status === "idle" ? 0 : progress;

  const content = (
    <>
      <span>{text}</span>
      {percent && <span className="min-w-[32px] text-left tabular-nums">{percent}</span>}
    </>
  );

  return (
    <button
      type={type}
      disabled={status !== "idle"}
      className={`relative overflow-hidden min-w-[150px] h-[38px] px-4 rounded-xl border border-black dark:border-white bg-white dark:bg-transparent text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 disabled:cursor-default ${className}`}
    >
      {/* Fill */}
      <span
        className="absolute inset-y-0 left-0 bg-black dark:bg-white transition-[width] duration-100 ease-linear"
        style={{ width: `${fill}%` }}
      />
      {/* Dark text over the unfilled part */}
      <span className="absolute inset-0 flex items-center justify-center gap-2 text-black dark:text-white pointer-events-none">
        {content}
      </span>
      {/* Light text, shown only over the filled part */}
      <span
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center gap-2 text-white dark:text-black pointer-events-none"
        style={{ clipPath: `inset(0 ${100 - fill}% 0 0)` }}
      >
        {content}
      </span>
      {/* Keeps the button's width from the label */}
      <span className="invisible">{label}</span>
    </button>
  );
};

export default SaveButton;