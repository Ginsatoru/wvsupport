import React from "react";
import MessagesLayout from "./MessageLayout";
import OpenMessages from "./OpenMessage";

const OpenMessagesPage = () => {
  return (
    <MessagesLayout status="open">
      <OpenMessages />
    </MessagesLayout>
  );
};

export default OpenMessagesPage;