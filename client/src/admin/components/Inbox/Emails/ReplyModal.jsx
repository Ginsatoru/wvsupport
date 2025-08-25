import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Send,
  Loader2,
  Mail,
  User,
  Calendar,
  MessageSquare,
  Paperclip,
  File,
  Image,
  FileText,
  Download,
  AlertCircle,
  Minimize2,
  Maximize2,
  Reply,
  ChevronDown,
  AtSign,
} from "lucide-react";

const ReplyModal = ({ isOpen, message, onClose, onSend }) => {
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [errors, setErrors] = useState([]);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showOriginalMessage, setShowOriginalMessage] = useState(true);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setReplyText("");
      setAttachments([]);
      setErrors([]);
      setIsMinimized(false);
      setShowOriginalMessage(true);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && textareaRef.current && !isMinimized) {
      textareaRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  const validateFile = (file) => {
    const errors = [];
    
    // File size validation (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      errors.push(`${file.name}: File size exceeds 10MB limit`);
    }

    // File type validation
    const allowedTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
      'text/csv'
    ];

    if (!allowedTypes.includes(file.type)) {
      errors.push(`${file.name}: File type not supported`);
    }

    return errors;
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Clear previous errors
    setErrors([]);

    // Check total files limit (5 max)
    if (attachments.length + files.length > 5) {
      setErrors(['Maximum 5 files allowed']);
      e.target.value = '';
      return;
    }

    // Validate each file
    const allErrors = [];
    const validFiles = [];

    files.forEach(file => {
      const fileErrors = validateFile(file);
      if (fileErrors.length > 0) {
        allErrors.push(...fileErrors);
      } else {
        validFiles.push(file);
      }
    });

    if (allErrors.length > 0) {
      setErrors(allErrors);
    }

    // Add valid files to attachments
    if (validFiles.length > 0) {
      const newAttachments = validFiles.map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        file: file
      }));
      setAttachments(prev => [...prev, ...newAttachments]);
    }

    // Clear the input
    e.target.value = '';
  };

  const removeAttachment = (id) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
  };

  const handleSend = async () => {
    if (!replyText.trim() && attachments.length === 0) return;

    setSending(true);
    setErrors([]);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('replyMessage', replyText);
      
      // Add files to FormData
      attachments.forEach(attachment => {
        formData.append('attachments', attachment.file);
      });

      // Make API call with FormData
      const response = await fetch(`/api/contact/admin/messages/${message._id}/reply`, {
        method: 'PATCH',
        body: formData,
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to send reply');
      }

      // Call parent's onSend callback with the result
      await onSend(result.data);
      
    } catch (error) {
      console.error('Error sending reply:', error);
      setErrors([error.message || 'Failed to send reply. Please try again.']);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onClose();
    }
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      handleSend();
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return <Image className="w-4 h-4 text-sky-500" />;
    if (type.includes('pdf')) return <FileText className="w-4 h-4 text-red-500" />;
    if (type.includes('document') || type.includes('word')) return <FileText className="w-4 h-4 text-sky-600" />;
    if (type.includes('excel') || type.includes('sheet')) return <File className="w-4 h-4 text-green-600" />;
    return <File className="w-4 h-4 text-gray-500" />;
  };

  if (!isOpen || !message) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={onClose} />
      
      {/* Modal */}
      <div className={`fixed z-50 transition-all duration-300 ${
        isMinimized 
          ? 'bottom-4 right-4 w-80 h-12' 
          : 'inset-0 flex items-center justify-center p-4'
      }`}>
        <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-2xl flex flex-col border border-gray-300 dark:border-gray-600 overflow-hidden ${
          isMinimized ? 'h-12 w-80' : 'w-full max-w-2xl h-[85vh] max-h-[700px]'
        }`}>
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-sky-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 border-b border-gray-300 dark:border-gray-600">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-8 h-8 bg-sky-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Reply className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                {!isMinimized && (
                  <>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                      Reply to {message.name}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                      Re: {message.subject}
                    </p>
                  </>
                )}
                {isMinimized && (
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Reply to {message.name}
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-2 rounded-xl transition-all duration-200 group bg-white/50 hover:bg-white/80 dark:bg-gray-600/50 dark:hover:bg-gray-600"
                disabled={sending}
              >
                {isMinimized ? (
                  <Maximize2 className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                ) : (
                  <Minimize2 className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                )}
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-xl transition-all duration-200 group bg-white/50 hover:bg-white/80 dark:bg-gray-600/50 dark:hover:bg-gray-600"
                disabled={sending}
              >
                <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Recipient Info */}
              <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-300 dark:border-gray-600">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-4 text-sm flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 dark:text-gray-400 font-medium">To:</span>
                      <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-3 py-1 rounded-xl border border-gray-300 dark:border-gray-600">
                        <AtSign className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-700 dark:text-gray-300 font-medium">{message.name}</span>
                        <span className="text-gray-500 dark:text-gray-400">({message.email})</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {new Date(message.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                  
                  {message.replied && (
                    <div className="px-2 py-1 bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400 text-xs font-medium rounded-xl border border-sky-200 dark:border-sky-800">
                      Previously Replied
                    </div>
                  )}
                </div>
              </div>

              {/* Content Area */}
              <div className="flex-1 overflow-hidden flex flex-col">
                <div className="flex-1 overflow-y-auto">
                  
                  {/* Original Message */}
                  {showOriginalMessage && (
                    <div className="p-6 border-b border-gray-300 dark:border-gray-600">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-gray-400" />
                          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Original Message
                          </h3>
                        </div>
                        <button
                          onClick={() => setShowOriginalMessage(false)}
                          className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 flex items-center gap-1"
                        >
                          Hide <ChevronDown className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border border-gray-300 dark:border-gray-600">
                        <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                          {message.subject}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                          {message.message}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Previous Reply (if exists) */}
                  {message.replied && message.replyMessage && (
                    <div className="px-6 py-4 border-b border-gray-300 dark:border-gray-600">
                      <div className="flex items-center gap-2 mb-3">
                        <Send className="w-4 h-4 text-green-500" />
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Previous Reply
                        </h3>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {message.lastReplyAt && new Date(message.lastReplyAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-300 dark:border-green-800">
                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                          {message.replyMessage}
                        </p>
                        {message.replyAttachments && message.replyAttachments.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-green-300 dark:border-green-800">
                            <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                              <Paperclip className="w-3 h-3" />
                              Attachments:
                            </div>
                            <div className="space-y-1">
                              {message.replyAttachments.map((attachment, index) => (
                                <div key={index} className="flex items-center gap-2 text-xs">
                                  {getFileIcon(attachment.mimetype)}
                                  <span className="text-gray-600 dark:text-gray-300">
                                    {attachment.originalName}
                                  </span>
                                  <span className="text-gray-500 dark:text-gray-400">
                                    ({formatFileSize(attachment.size)})
                                  </span>
                                  <a
                                    href={attachment.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-green-600 hover:text-green-700 dark:text-green-400 p-0.5 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/30"
                                  >
                                    <Download className="w-3 h-3" />
                                  </a>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Reply Form */}
                  <div className="p-6 flex-1 flex flex-col">
                    {/* Error Messages */}
                    {errors.length > 0 && (
                      <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertCircle className="w-4 h-4 text-red-500" />
                          <span className="text-sm font-medium text-red-700 dark:text-red-400">
                            Error{errors.length > 1 ? 's' : ''}:
                          </span>
                        </div>
                        <ul className="text-sm text-red-600 dark:text-red-400 space-y-1">
                          {errors.map((error, index) => (
                            <li key={index}>• {error}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex-1 flex flex-col">
                      <textarea
                        ref={textareaRef}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type your reply here..."
                        className="flex-1 min-h-32 p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-transparent resize-none transition-all duration-200"
                        disabled={sending}
                      />
                    </div>

                    {/* Attachments Display */}
                    {attachments.length > 0 && (
                      <div className="mt-4">
                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                          <Paperclip className="w-4 h-4" />
                          Attachments ({attachments.length}/5)
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {attachments.map((attachment) => (
                            <div key={attachment.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-300 dark:border-gray-600">
                              <div className="flex-shrink-0">
                                {getFileIcon(attachment.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                  {attachment.name}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {formatFileSize(attachment.size)}
                                </div>
                              </div>
                              <button
                                onClick={() => removeAttachment(attachment.id)}
                                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                                disabled={sending}
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Toolbar */}
                <div className="border-t border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/30">
                  <div className="px-6 py-4">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center gap-4">
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileSelect}
                          className="hidden"
                          multiple
                          accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx,.txt,.csv"
                          disabled={sending || attachments.length >= 5}
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-sky-600 dark:hover:text-sky-400 border border-gray-300 dark:border-gray-600 rounded-xl hover:border-sky-300 dark:hover:border-sky-500 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={sending || attachments.length >= 5}
                        >
                          <Paperclip className="w-4 h-4" />
                          Attach Files
                        </button>
                        
                        {!showOriginalMessage && (
                          <button
                            onClick={() => setShowOriginalMessage(true)}
                            className="text-sm text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300"
                          >
                            Show original message
                          </button>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-3 flex-wrap">
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {attachments.length > 0 && (
                            <span className="mr-2">{attachments.length} file{attachments.length !== 1 ? 's' : ''} attached</span>
                          )}
                          <span>Ctrl+Enter to send</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button
                            onClick={onClose}
                            disabled={sending}
                            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSend}
                            disabled={(!replyText.trim() && attachments.length === 0) || sending}
                            className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                          >
                            {sending ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Sending...
                              </>
                            ) : (
                              <>
                                <Send className="w-4 h-4" />
                                Send
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ReplyModal;