// src/components/Messages/MessagesContainer.js
import React from 'react';
import { FiInbox, FiArchive, FiRefreshCw } from 'react-icons/fi';
import MessageCard from './MessageCard';

const statusConfig = {
  open: {
    icon: <FiInbox size={20} />,
    emptyTitle: "No open messages",
    actionText: "Close",
    nextStatus: "closed",
    buttonClass: "bg-blue-500 hover:bg-blue-600"
  },
  closed: {
    icon: <FiArchive size={20} />,
    emptyTitle: "No closed messages",
    actionText: "Reopen",
    nextStatus: "open",
    buttonClass: "bg-green-500 hover:bg-green-600"
  }
};

const MessagesContainer = ({
  status = 'open', // Default to open
  messages = [],
  searchQuery = '',
  updateMessageStatus,
  handleDeleteMessageClick,
  setSearchQuery
}) => {
  const config = statusConfig[status];

  return (
    <div className="messages-container">
      {/* Empty State */}
      {messages.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">{config.icon}</div>
          <h3>{config.emptyTitle}</h3>
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className={`clear-search ${config.buttonClass}`}
            >
              <FiRefreshCw /> Clear Search
            </button>
          )}
        </div>
      )}

      {/* Messages List */}
      {messages.length > 0 && (
        <div className="messages-list">
          {messages.map(message => (
            <MessageCard
              key={message._id}
              message={message}
              actionText={config.actionText}
              onAction={() => updateMessageStatus(message._id, config.nextStatus)}
              onDelete={() => handleDeleteMessageClick(message)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MessagesContainer;