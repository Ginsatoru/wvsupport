import React, { useState } from "react";
import {
  Trash2,
  Reply,
  CheckCircle,
  X,
  RotateCcw,
  User,
  Paperclip,
  Clock,
  Archive,
} from "lucide-react";
import ConfirmationModal from "../../Modals/ConfirmationModal";

const MessageItem = ({
  message,
  isSelected,
  onSelect,
  onMarkAsRead,
  onClose,
  onReopen,
  onReply,
  onDelete,
  formatDate,
  getMessageId,
}) => {
  const messageId = getMessageId(message);

  // modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleConfirmDelete = () => {
    onDelete(messageId);
    setIsDeleteModalOpen(false);
  };

  const handleConfirmClose = () => {
    onClose(messageId);
    setIsCloseModalOpen(false);
  };

  const truncateMessage = (text, limit = 100) => {
    if (text.length <= limit) return text;
    return text.substring(0, limit) + "...";
  };

  return (
    <div
      className={`group relative transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 mb-2 ${
        !message.read 
          ? "bg-sky-50/40 dark:bg-sky-900/10 border-l-4 border-l-sky-500" 
          : "bg-white dark:bg-gray-800"
      } ${isSelected ? 'ring-2 ring-sky-500 ring-inset shadow-sm' : ''}`}
    >
      <div className="px-3 py-2">
        <div className="flex items-start gap-2">
          {/* Checkbox */}
          <div className="flex items-center pt-1">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => onSelect(messageId, e.target.checked)}
              className="w-3 h-4 rounded border-gray-300 dark:border-gray-600 text-sky-600 focus:ring-sky-500  transition-colors cursor-pointer"
            />
          </div>

          {/* Avatar with Person Icon */}
          <div className="flex-shrink-0 pt-0.5">
            <div className="w-8 h-8 dark:bg-gray-700 bg-gray-100 rounded-xl flex items-center justify-center">
              <User className="w-4 h-4 text-sky-400" />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-1.5">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <h3
                  className={`text-sm font-medium truncate ${
                    !message.read
                      ? "text-gray-900 dark:text-white font-semibold"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {message.name}
                </h3>
                <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {message.email}
                </span>
                {!message.read && (
                  <div className="w-1.5 h-1.5 bg-sky-500 rounded-full flex-shrink-0"></div>
                )}
              </div>
              
              <div className="flex items-center gap-1 flex-shrink-0">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDate(message.createdAt)}
                </span>
              </div>
            </div>

            {/* Subject and Preview */}
            <div className="mb-2">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-sm mb-1 font-medium truncate ${
                      !message.read
                        ? "text-gray-900 dark:text-white"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {message.subject}
                  </p>
                  <p className={`text-xs leading-relaxed ${!message.read ? 'text-gray-600 dark:text-gray-300' : 'text-gray-500 dark:text-gray-400'}`}>
                    {isExpanded ? message.message : truncateMessage(message.message)}
                    {message.message.length > 100 && (
                      <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="ml-1 text-sky-600 hover:text-sky-700 dark:text-sky-400 text-xs font-medium"
                      >
                        {isExpanded ? "Less" : "More"}
                      </button>
                    )}
                  </p>
                </div>

                {/* Action Buttons - Hidden until hover */}
                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {!message.read && (
                    <button
                      onClick={() => onMarkAsRead(messageId)}
                      className="p-1 text-gray-400 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-900/20 rounded-xl transition-all duration-200"
                      title="Mark as read"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    onClick={() => onReply(message)}
                    className="p-1 text-gray-400 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-900/20 rounded-xl transition-all duration-200"
                    title="Reply"
                    >
                    <Reply className="w-3.5 h-3.5" />
                  </button>

                  {message.status === "open" ? (
                    <button
                      onClick={() => setIsCloseModalOpen(true)}
                      className="p-1 text-gray-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-xl transition-all duration-200"
                      title="Close message"
                    >
                      <Archive className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => onReopen(messageId)}
                      className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-xl transition-all duration-200"
                      title="Reopen message"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="p-1 text-gray-400 hover:text-red-600 dark:hover:bg-red-900/20xl transition-all duration-200"
                    title="Delete message"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Status Tags and Reply Preview */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span
                  className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-xl ${
                    message.status === "open"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                      : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                  }`}
                >
                  {message.status === "open" ? "Open" : "Closed"}
                </span>
                
                {message.replied && (
                  <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-sky-100 text-sky-700 dark:bg-sky-900/20 dark:text-sky-400 rounded-xl">
                    <Reply className="w-2.5 h-2.5 mr-1" />
                    Replied
                  </span>
                )}

                {message.replyAttachments && message.replyAttachments.length > 0 && (
                  <span className="inline-flex items-center text-gray-500 dark:text-gray-400" title="Has attachments">
                    <Paperclip className="w-3 h-3" />
                  </span>
                )}

                {message.lastReplyAt && (
                  <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    Last reply: {formatDate(message.lastReplyAt)}
                  </span>
                )}
              </div>
            </div>

            {/* Reply Preview */}
            {message.replied && message.replyMessage && isExpanded && (
              <div className="mt-2 p-2.5 bg-sky-50 dark:bg-sky-900/20 rounded-xl border-l-2 border-sky-500">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Reply className="w-3 h-3 text-sky-600" />
                  <p className="text-xs text-sky-600 dark:text-sky-400 font-medium">
                    Your reply:
                  </p>
                </div>
                <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                  {message.replyMessage}
                </p>
                
                {message.replyAttachments && message.replyAttachments.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-sky-200 dark:border-sky-800">
                    <div className="flex items-center gap-1 text-xs text-sky-600 dark:text-sky-400">
                      <Paperclip className="w-3 h-3" />
                      <span>{message.replyAttachments.length} attachment{message.replyAttachments.length !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Delete Message"
        message="Are you sure you want to delete this message? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />

      <ConfirmationModal
        isOpen={isCloseModalOpen}
        title="Close Message"
        message="Are you sure you want to close this message?"
        confirmText="Close"
        cancelText="Cancel"
        onConfirm={handleConfirmClose}
        onCancel={() => setIsCloseModalOpen(false)}
      />
    </div>
  );
};

export default MessageItem;