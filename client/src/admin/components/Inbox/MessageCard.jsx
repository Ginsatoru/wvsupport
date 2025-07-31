// src/components/Messages/MessageCard.js
import React from 'react';
import { FiTrash2, FiMail, FiUser, FiAtSign } from 'react-icons/fi';

const MessageCard = ({
  message = {}, // fallback to empty object to avoid undefined errors
  actionText = '',
  onAction = () => {},
  onDelete = () => {}
}) => {
  const name = message.name || 'Anonymous';
  const email = message.email || 'No email provided';
  const createdAt = message.createdAt
    ? new Date(message.createdAt).toLocaleDateString()
    : 'Unknown date';
  const content = message.content || '';
  const displayContent = content.length > 100
    ? `${content.substring(0, 100)}...`
    : content;

  return (
    <div className="message-card p-4 rounded shadow bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 space-y-3">
      <div className="message-header flex justify-between items-center">
        <div>
          <h4 className="text-lg font-semibold flex items-center gap-2">
            <FiUser className="inline" />
            {name}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
            <FiAtSign className="inline" />
            {email}
          </p>
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">{createdAt}</span>
      </div>

      <p className="message-content text-sm text-gray-700 dark:text-gray-300">
        {displayContent}
      </p>

      <div className="message-actions flex justify-end gap-2">
        <button
          onClick={onAction}
          className={`status-button px-3 py-1 rounded text-sm font-medium border ${
            actionText?.toLowerCase() === 'reopen'
              ? 'text-sky-600 border-sky-300 hover:bg-sky-50 dark:hover:bg-sky-900/30'
              : 'text-green-600 border-green-300 hover:bg-green-50 dark:hover:bg-green-900/30'
          }`}
        >
          <FiMail className="inline mr-1" />
          {actionText || 'Action'}
        </button>

        <button
          onClick={onDelete}
          className="delete-button px-3 py-1 rounded text-sm font-medium text-red-600 border border-red-300 hover:bg-red-50 dark:hover:bg-red-900/30"
        >
          <FiTrash2 className="inline mr-1" />
          Delete
        </button>
      </div>
    </div>
  );
};

export default MessageCard;