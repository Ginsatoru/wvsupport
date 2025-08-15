import React, { useState, useEffect, useMemo } from "react";
import { Mail, Plus, Loader2, Search, Trash2, Send, Users, Calendar, Filter, Download } from "lucide-react";
import { ModernAlert } from "../Modals/Alert";
import { getAllNewsletterEmails } from '../../../services/newsletterApi';

const CMSNewsletter = () => {
  const [newsletters, setNewsletters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isComposeModalOpen, setIsComposeModalOpen] = useState(false);
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "success"
  });
  
  // Search and filtering state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all, subscribed, unsubscribed
  const [selectedEmails, setSelectedEmails] = useState(new Set());
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSendingBulk, setIsSendingBulk] = useState(false);

  // Fetch real data from API
  useEffect(() => {
    const fetchEmails = async () => {
      try {
        setLoading(true);
        const response = await getAllNewsletterEmails();
        
        // Transform API data to match component structure
        const transformedData = response.data.map((email, index) => ({
          id: email._id || index + 1,
          email: email.email,
          lastName: email.lastName || "", // Add fallback if not in API
          status: email.status || "subscribed", // Default to subscribed if not specified
          subscribedAt: email.createdAt,
          source: email.source || "unknown", // Add fallback if not in API
          lastEmailSent: email.lastEmailSent || null // Add fallback if not in API
        }));
        
        setNewsletters(transformedData);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to fetch emails');
        showAlert('Failed to fetch newsletter subscribers', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchEmails();
  }, []);

  const showAlert = (message, type = "success") => {
    setAlert({
      show: true,
      message,
      type
    });
    
    setTimeout(() => {
      setAlert(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  // Filter newsletters based on search term and status
  const filteredNewsletters = useMemo(() => {
    let filtered = newsletters;

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(newsletter => newsletter.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(newsletter => 
        newsletter.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        newsletter.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        newsletter.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${newsletter.firstName} ${newsletter.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [newsletters, searchTerm, statusFilter]);

  // Selection handlers
  const handleSelectEmail = (emailId, checked) => {
    const newSelected = new Set(selectedEmails);
    if (checked) {
      newSelected.add(emailId);
    } else {
      newSelected.delete(emailId);
    }
    setSelectedEmails(newSelected);
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      const subscribedEmails = filteredNewsletters
        .filter(newsletter => newsletter.status === "subscribed")
        .map(newsletter => newsletter.id);
      setSelectedEmails(new Set(subscribedEmails));
    } else {
      setSelectedEmails(new Set());
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedEmails.size === 0) return;
    
    try {
      setIsDeleting(true);
      
      // TODO: Implement actual delete API call here
      // Example: await deleteNewsletterEmails(Array.from(selectedEmails));
      
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Remove selected emails from state
      setNewsletters(prev => prev.filter(newsletter => !selectedEmails.has(newsletter.id)));
      setSelectedEmails(new Set());
      showAlert(`${selectedEmails.size} subscriber${selectedEmails.size > 1 ? 's' : ''} deleted successfully!`);
    } catch (error) {
      console.error("Error deleting selected newsletters:", error);
      showAlert("Error deleting subscribers", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSendBulkEmail = async () => {
    if (selectedEmails.size === 0) return;
    
    try {
      setIsSendingBulk(true);
      
      // TODO: Implement actual bulk email API call here
      // Example: await sendBulkEmail(Array.from(selectedEmails), emailContent);
      
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      showAlert(`Email sent to ${selectedEmails.size} subscriber${selectedEmails.size > 1 ? 's' : ''} successfully!`);
      setSelectedEmails(new Set());
    } catch (error) {
      console.error("Error sending bulk email:", error);
      showAlert("Error sending emails", "error");
    } finally {
      setIsSendingBulk(false);
    }
  };

  const handleExportSubscribers = () => {
    try {
      // Create CSV content
      const csvContent = [
        ['Email', 'First Name', 'Last Name', 'Status', 'Subscribed At', 'Source'],
        ...filteredNewsletters.map(newsletter => [
          newsletter.email,
          newsletter.firstName,
          newsletter.lastName,
          newsletter.status,
          formatDate(newsletter.subscribedAt),
          newsletter.source.replace('_', ' ')
        ])
      ].map(row => row.join(',')).join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `newsletter_subscribers_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      window.URL.revokeObjectURL(url);
      
      showAlert("Subscriber list exported successfully!");
    } catch (error) {
      console.error("Error exporting subscribers:", error);
      showAlert("Error exporting subscriber list", "error");
    }
  };

  const subscribedCount = newsletters.filter(n => n.status === "subscribed").length;
  const isAllSelected = filteredNewsletters.filter(n => n.status === "subscribed").length > 0 && 
    filteredNewsletters.filter(n => n.status === "subscribed").every(newsletter => selectedEmails.has(newsletter.id));
  const isIndeterminate = selectedEmails.size > 0 && !isAllSelected;

  const formatDate = (dateString) => {
    if (!dateString) return "Never";
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusBadge = (status) => {
    if (status === "subscribed") {
      return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
    }
    return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200";
  };

  const getSourceBadge = (source) => {
    const sourceMap = {
      landing_page: { label: "Landing Page", color: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200" },
      footer_signup: { label: "Footer", color: "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200" },
      popup: { label: "Popup", color: "bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200" },
      contact_form: { label: "Contact Form", color: "bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200" },
      unknown: { label: "Unknown", color: "bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200" }
    };
    
    const sourceInfo = sourceMap[source] || { label: source, color: "bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200" };
    return sourceInfo;
  };

  // Show error state
  if (error && !loading) {
    return (
      <div className="px-9 py-7 bg-gray-200 dark:bg-gray-900 rounded-xl h-[850px]">
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="bg-red-100 dark:bg-red-900 rounded-xl p-8 max-w-md">
            <Mail className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
              Failed to Load Newsletter Data
            </h3>
            <p className="text-red-600 dark:text-red-400 mb-6">
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-9 py-7 bg-gray-200 dark:bg-gray-900 rounded-xl h-[850px]">
      <div className="flex flex-col h-full">
        {/* Alert */}
        {alert.show && (
          <div className="mb-4">
            <ModernAlert message={alert.message} type={alert.type} />
          </div>
        )}

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Mail className="w-6 h-6 text-sky-400" />
                Newsletter Management
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {filteredNewsletters.length} of {newsletters.length} subscribers
                {selectedEmails.size > 0 && ` • ${selectedEmails.size} selected`}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search subscribers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-transparent transition-colors w-64"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-transparent transition-colors appearance-none"
              >
                <option value="all">All Status</option>
                <option value="subscribed">Subscribed</option>
                <option value="unsubscribed">Unsubscribed</option>
              </select>
            </div>

            {/* Export Button */}
            <button
              onClick={handleExportSubscribers}
              className="flex items-center gap-2 px-4 py-3 bg-sky-400 dark:bg-sky-400 text-white text-sm font-medium rounded-xl hover:bg-sky-500 dark:hover:bg-sky-500 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
            </button>

            {/* Bulk Actions */}
            {selectedEmails.size > 0 && (
              <>
                {/* <button
                  onClick={handleSendBulkEmail}
                  disabled={isSendingBulk}
                  className="flex items-center gap-2 px-4 py-3 bg-green-500 dark:bg-green-600 text-white text-sm font-medium rounded-xl hover:bg-green-600 dark:hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSendingBulk ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  Send Email ({selectedEmails.size})
                </button> */}

                {/* <button
                  onClick={handleDeleteSelected}
                  disabled={isDeleting}
                  className="flex items-center gap-2 px-4 py-3 bg-red-500 dark:bg-red-600 text-white text-sm font-medium rounded-xl hover:bg-red-600 dark:hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  Delete ({selectedEmails.size})
                </button> */}
              </>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Subscribers</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{newsletters.length}</p>
              </div>
              <Users className="w-8 h-8 text-sky-500" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Active Subscribers</p>
                <p className="text-2xl font-bold text-green-600">{subscribedCount}</p>
              </div>
              <Mail className="w-8 h-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Unsubscribed</p>
                <p className="text-2xl font-bold text-red-600">{newsletters.length - subscribedCount}</p>
              </div>
              <Users className="w-8 h-8 text-red-500" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">This Month</p>
                <p className="text-2xl font-bold text-blue-600">
                  {newsletters.filter(n => {
                    const subDate = new Date(n.subscribedAt);
                    const now = new Date();
                    return subDate.getMonth() === now.getMonth() && subDate.getFullYear() === now.getFullYear();
                  }).length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden bg-white dark:bg-gray-800 rounded-xl shadow">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center p-8 text-gray-500 dark:text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin mb-4 text-sky-500" />
              <p>Loading newsletter subscribers...</p>
            </div>
          ) : filteredNewsletters.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 p-8 max-w-md mx-auto">
                <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {searchTerm || statusFilter !== "all" ? "No matching subscribers" : "No subscribers found"}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  {searchTerm || statusFilter !== "all"
                    ? "Try adjusting your search or filter criteria."
                    : "Subscribers will appear here when they sign up for your newsletter"
                  }
                </p>
              </div>
            </div>
          ) : (
            <div className="h-full overflow-y-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0">
                  <tr>
                    <th className="w-12 px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={isAllSelected}
                        ref={(el) => {
                          if (el) el.indeterminate = isIndeterminate;
                        }}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="w-4 h-4 text-sky-600 bg-gray-100 border-gray-300 rounded focus:ring-sky-500 focus:ring-2"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Subscriber
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Source
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Subscribed
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Last Email
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredNewsletters.map((newsletter) => {
                    const sourceInfo = getSourceBadge(newsletter.source);
                    return (
                      <tr key={newsletter.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedEmails.has(newsletter.id)}
                            onChange={(e) => handleSelectEmail(newsletter.id, e.target.checked)}
                            disabled={newsletter.status !== "subscribed"}
                            className="w-4 h-4 text-sky-600 bg-gray-100 border-gray-300 rounded focus:ring-sky-500 focus:ring-2 disabled:opacity-50"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {newsletter.firstName} {newsletter.lastName}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {newsletter.email}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(newsletter.status)}`}>
                            {newsletter.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${sourceInfo.color}`}>
                            {sourceInfo.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(newsletter.subscribedAt)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(newsletter.lastEmailSent)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CMSNewsletter;