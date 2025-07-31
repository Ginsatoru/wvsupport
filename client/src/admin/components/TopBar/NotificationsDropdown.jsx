import React from 'react';
import { FiCheck, FiMessageSquare, FiCheckCircle, FiMail, FiUpload } from 'react-icons/fi';

const NotificationsDropdown = ({ darkMode, notifications, showNotifications }) => {
  // Sample data structure that matches your image
  const sampleNotifications = [
    {
      id: 1,
      title: "John Doe",
      description: "It is a long established fact that a reader will be distracted.",
      time: "10 min ago",
      unread: true,
      category: "New",
      type: "message"
    },
    {
      id: 2,
      title: "Store Verification Done",
      description: "We have successfully received your request.",
      time: "1 hour ago",
      unread: true,
      type: "verification"
    },
    {
      id: 3,
      title: "Check Your Mail",
      description: "All done! Now check your inbox as you're in for a sweet treat!",
      time: "2 hours ago",
      unread: true,
      meta: "Mail",
      type: "email"
    },
    {
      id: 4,
      title: "John Doe",
      description: "Uploaded two file on 21 Jan 2020",
      time: "1 day ago",
      files: ["demo.jpg"],
      type: "upload"
    }
  ];

  const getIcon = (type) => {
    switch(type) {
      case 'message': return <FiMessageSquare className="text-blue-500" />;
      case 'verification': return <FiCheckCircle className="text-green-500" />;
      case 'email': return <FiMail className="text-purple-500" />;
      case 'upload': return <FiUpload className="text-orange-500" />;
      default: return <FiMessageSquare className="text-blue-500" />;
    }
  };

  const gradientStyle = {
    backgroundImage: "linear-gradient(to right, #0acffe 0%, #495aff 100%)"
  };

  const gradientTextStyle = {
    backgroundImage: "linear-gradient(to right, #0acffe 0%, #495aff 100%)",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent"
  };

  return (
    showNotifications && (
      <div
        className={`absolute right-0 mt-2 w-72 sm:w-80 rounded-xl shadow-2xl border ${
          darkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-100"
        } z-50 animate-in slide-in-from-top-2 duration-200`}
      >
        <div
          className={`p-4 border-b flex justify-between items-center ${
            darkMode ? "border-gray-700" : "border-gray-100"
          }`}
        >
          <h3
            className={`text-lg font-semibold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            All Notifications
          </h3>
          <button
            className={`text-xs px-3 py-1 rounded-full ${
              darkMode 
                ? "text-blue-400 hover:bg-gray-700" 
                : "text-blue-500 hover:bg-gray-100"
            } transition-colors`}
          >
            Mark all as read
          </button>
        </div>
        <div className={`max-h-96 overflow-y-auto ${
          darkMode 
            ? "scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800" 
            : "scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
        }`}>
          {sampleNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 border-b ${
                darkMode
                  ? "border-gray-700 hover:bg-gray-700"
                  : "border-gray-100 hover:bg-gray-50"
              } transition-colors duration-150 cursor-pointer`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <div className="flex flex-col space-y-2">
                    {notification.category && (
                      <span className={`text-xs font-medium ${
                        darkMode ? "text-blue-400" : "text-blue-500"
                      }`}>
                        {notification.category}
                      </span>
                    )}
                    
                    <h4 className={`text-sm font-semibold ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}>
                      {notification.title}
                    </h4>
                    
                    <p className={`text-sm ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    }`}>
                      {notification.description}
                    </p>
                    
                    {notification.files && (
                      <div className="flex items-center mt-1">
                        <span className={`text-xs ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}>
                          {notification.files.join(", ")}
                        </span>
                      </div>
                    )}
                    
                    {notification.meta && (
                      <div className="flex items-center mt-1">
                        <span className={`text-xs px-2 py-1 rounded ${
                          darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"
                        }`}>
                          {notification.meta}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center mt-2">
                      <span className={`text-xs ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}>
                        {notification.time}
                      </span>
                      {notification.unread && (
                        <div className="flex items-center gap-2">
                          <button className={`p-1 rounded-full ${
                            darkMode 
                              ? "hover:bg-gray-600 text-gray-300" 
                              : "hover:bg-gray-200 text-gray-600"
                          }`}>
                            <FiCheck size={14} />
                          </button>
                          <span className="h-2 w-2 rounded-full" style={gradientStyle}></span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div
          className={`p-3 ${
            darkMode ? "bg-gray-700" : "bg-gray-50"
          } rounded-b-xl`}
        >
          <button
            style={gradientTextStyle}
            className="w-full text-sm font-medium transition-colors duration-150 hover:opacity-80"
          >
            View all notifications
          </button>
        </div>
      </div>
    )
  );
};

export default NotificationsDropdown;