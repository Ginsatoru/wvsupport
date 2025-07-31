import React from "react";
import { FiMail, FiRefreshCw } from "react-icons/fi";
import MessageCard from "./MessageCard";

const ClosedMessages = ({
  threads = [],
  searchQuery = "",
  updateThreadStatus = () => {},
  handleDeleteThread = () => {},
  setSearchQuery = () => {}
}) => {
  // Filter threads to only show closed ones
  const closedThreads = threads.filter(thread => thread?.status === 'closed');

  // Apply search filter if searchQuery exists
  const filteredThreads = searchQuery 
    ? closedThreads.filter(thread => {
        const searchLower = searchQuery.toLowerCase();
        return (
          (thread.user?.name?.toLowerCase().includes(searchLower)) ||
          (thread.user?.email?.toLowerCase().includes(searchLower)) ||
          thread.messages.some(message => 
            message.content.toLowerCase().includes(searchLower)
          )
        );
      })
    : closedThreads;

  return (
    <div className="space-y-4">
      {filteredThreads.length === 0 ? (
        <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-3xl p-12 text-center shadow-xl shadow-blue-100/20">
          <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FiMail className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-700 mb-2">
            {searchQuery ? "No matching closed conversations" : "No closed conversations"}
          </h3>
          <p className="text-slate-500 mb-6">
            {searchQuery 
              ? "Try adjusting your search terms or clear the search filter." 
              : "There are no closed conversations at the moment."
            }
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <FiRefreshCw className="h-4 w-4" />
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredThreads.map((thread) => (
            <div 
              key={thread.sessionId}
              className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg shadow-blue-100/10 hover:shadow-xl hover:shadow-blue-100/20 transition-all duration-300 transform hover:scale-[1.02]"
            >
              <MessageCard
                thread={thread}
                onStatusChange={(sessionId) => updateThreadStatus(sessionId, "open")}
                onDelete={() => handleDeleteThread(thread)}
                isClosedView={true}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClosedMessages;