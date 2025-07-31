import React from "react";
import MessagesLayout from "./MessageLayout";
import ClosedMessages from "./ClosedMessage";

const ClosedMessagesPage = () => {
  return (
    <MessagesLayout status="closed">
      <ClosedMessages />
    </MessagesLayout>
  );
};

export default ClosedMessagesPage;