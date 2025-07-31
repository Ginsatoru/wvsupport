import React from "react";
import { FiMail, FiCheckCircle, FiInbox, FiRefreshCw } from "react-icons/fi";
import MessageCard from "./MessageCard";
import PropTypes from 'prop-types';

const OpenMessages = ({
  messages = [],  // Default empty array
  searchQuery = "",  // Default empty string
  updateMessageStatus = () => {},  // Default empty function
  handleDeleteMessageClick = () => {},  // Default empty function
  setSearchQuery = () => {}  // Default empty function
}) => {
  // Safely filter and map messages
  const renderMessages = () => {
    if (!Array.isArray(messages)) {
      console.error('Messages prop is not an array');
      return null;
    }

    const filteredMessages = messages.filter(msg => msg?.status === 'open');
    
    if (filteredMessages.length === 0) {
      return (
        <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-3xl p-12 text-center shadow-xl shadow-blue-100/20">
          <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FiInbox className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-700 mb-2">
            No open messages found
          </h3>
          <p className="text-slate-500 mb-6">
            {searchQuery 
              ? "Try adjusting your search terms or clear the search filter." 
              : "There are no open messages at the moment."
            }
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-semibold rounded-xl hover:from-sky-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <FiRefreshCw className="h-4 w-4" />
              Clear Search
            </button>
          )}
        </div>
      );
    }

    return (
      <div className="grid gap-4">
        {filteredMessages.map((message) => (
          message?._id ? (  // Only render if message has an _id
            <div 
              key={message._id}
              className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg shadow-blue-100/10 hover:shadow-xl hover:shadow-blue-100/20 transition-all duration-300 transform hover:scale-[1.02]"
            >
              <MessageCard
                message={message}
                onStatusChange={(id) => updateMessageStatus(id, "closed")}
                onDelete={handleDeleteMessageClick}
              />
            </div>
          ) : null
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {renderMessages()}
    </div>
  );
};

OpenMessages.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      status: PropTypes.string,
      // Add other expected message properties here
    })
  ),
  searchQuery: PropTypes.string,
  updateMessageStatus: PropTypes.func,
  handleDeleteMessageClick: PropTypes.func,
  setSearchQuery: PropTypes.func
};

export default OpenMessages;