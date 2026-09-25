import React, { useState, useEffect, useMemo } from "react";
import { Mail, Plus, Loader2, Search, Trash2, Send, Users, Calendar, Filter, Download } from "lucide-react";
import { ModernAlert } from "../Modals/Alert";
import { getAllNewsletterEmails } from '../../../services/newsletterApi';

const CMSNewsletter = () => {
  const [newsletters, setNewsletters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isComposeModalOpen, setIsComposeModalOpen] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", type: "success" });
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedEmails, setSelectedEmails] = useState(new Set());
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSendingBulk, setIsSendingBulk] = useState(false);

  // We need darkMode. Since it's not passed as prop, we detect via class on <html> or fallback.
  // Better: accept it as prop. But to keep component standalone, detect from document.
  const [darkMode, setDarkMode] = useState(() =>
    typeof document !== "undefined" && document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setDarkMode(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const textColor = darkMode ? '#ffffff' : '#000000';

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        setLoading(true);
        const response = await getAllNewsletterEmails();
        const transformedData = response.data.map((email, index) => ({
          id: email._id || index + 1,
          email: email.email,
          lastName: email.lastName || "",
          status: email.status || "subscribed",
          subscribedAt: email.createdAt,
          source: email.source || "unknown",
          lastEmailSent: email.lastEmailSent || null
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
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert(prev => ({ ...prev, show: false })), 3000);
  };

  const filteredNewsletters = useMemo(() => {
    let filtered = newsletters;
    if (statusFilter !== "all") filtered = filtered.filter(n => n.status === statusFilter);
    if (searchTerm.trim()) {
      filtered = filtered.filter(n =>
        n.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${n.firstName} ${n.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return filtered;
  }, [newsletters, searchTerm, statusFilter]);

  const handleSelectEmail = (emailId, checked) => {
    const newSelected = new Set(selectedEmails);
    checked ? newSelected.add(emailId) : newSelected.delete(emailId);
    setSelectedEmails(newSelected);
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      const subscribedEmails = filteredNewsletters
        .filter(n => n.status === "subscribed")
        .map(n => n.id);
      setSelectedEmails(new Set(subscribedEmails));
    } else {
      setSelectedEmails(new Set());
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedEmails.size === 0) return;
    try {
      setIsDeleting(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      setNewsletters(prev => prev.filter(n => !selectedEmails.has(n.id)));
      setSelectedEmails(new Set());
      showAlert(`${selectedEmails.size} subscriber${selectedEmails.size > 1 ? 's' : ''} deleted successfully!`);
    } catch (error) {
      showAlert("Error deleting subscribers", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSendBulkEmail = async () => {
    if (selectedEmails.size === 0) return;
    try {
      setIsSendingBulk(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      showAlert(`Email sent to ${selectedEmails.size} subscriber${selectedEmails.size > 1 ? 's' : ''} successfully!`);
      setSelectedEmails(new Set());
    } catch (error) {
      showAlert("Error sending emails", "error");
    } finally {
      setIsSendingBulk(false);
    }
  };

  const handleExportSubscribers = () => {
    try {
      const csvContent = [
        ['Email', 'First Name', 'Last Name', 'Status', 'Subscribed At', 'Source'],
        ...filteredNewsletters.map(n => [
          n.email, n.firstName, n.lastName, n.status,
          formatDate(n.subscribedAt), n.source.replace('_', ' ')
        ])
      ].map(row => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `newsletter_subscribers_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      window.URL.revokeObjectURL(url);
      showAlert("Subscriber list exported successfully!");
    } catch (error) {
      showAlert("Error exporting subscriber list", "error");
    }
  };

  const subscribedCount = newsletters.filter(n => n.status === "subscribed").length;
  const isAllSelected = filteredNewsletters.filter(n => n.status === "subscribed").length > 0 &&
    filteredNewsletters.filter(n => n.status === "subscribed").every(n => selectedEmails.has(n.id));
  const isIndeterminate = selectedEmails.size > 0 && !isAllSelected;

  const formatDate = (dateString) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => status === "subscribed" ? "bg-[#0f8abe] text-white" : "bg-gray-100 dark:bg-gray-700";

  const getSourceBadge = (source) => {
    const sourceMap = {
      landing_page: { label: "Landing Page" },
      footer_signup: { label: "Footer" },
      popup: { label: "Popup" },
      contact_form: { label: "Contact Form" },
      unknown: { label: "Unknown" }
    };
    const sourceInfo = sourceMap[source] || { label: source };
    return { label: sourceInfo.label, color: "bg-gray-100 dark:bg-gray-700" };
  };

  if (error && !loading) {
    return (
      <div className="px-9 py-7 bg-gray-200 dark:bg-gray-900 rounded-xl h-[850px]">
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md">
            <Mail className="w-12 h-12 mx-auto mb-4" style={{ color: textColor }} />
            <h3 className="text-lg font-semibold mb-2" style={{ color: textColor }}>Failed to Load Newsletter Data</h3>
            <p className="mb-6" style={{ color: textColor }}>{error}</p>
            <button onClick={() => window.location.reload()} className="px-4 py-2 bg-[#0f8abe] text-white rounded-lg hover:bg-[#0d7aaa] transition-colors">
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
        {alert.show && <div className="mb-4"><ModernAlert message={alert.message} type={alert.type} /></div>}

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: textColor }}>
                <Mail className="w-6 h-6" />
                Newsletter Management
              </h1>
              <p className="text-sm" style={{ color: textColor }}>
                {filteredNewsletters.length} of {newsletters.length} subscribers
                {selectedEmails.size > 0 && ` • ${selectedEmails.size} selected`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: textColor }} />
              <input
                type="text"
                placeholder="Search subscribers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#0f8abe] focus:border-transparent transition-colors w-64"
                style={{ color: textColor }}
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: textColor }} />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#0f8abe] focus:border-transparent transition-colors appearance-none"
                style={{ color: textColor }}
              >
                <option value="all">All Status</option>
                <option value="subscribed">Subscribed</option>
                <option value="unsubscribed">Unsubscribed</option>
              </select>
            </div>

            <button onClick={handleExportSubscribers} className="flex items-center gap-2 px-4 py-3 bg-[#0f8abe] text-white text-sm font-medium rounded-xl hover:bg-[#0d7aaa] transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: textColor }}>Total Subscribers</p>
                <p className="text-2xl font-bold" style={{ color: textColor }}>{newsletters.length}</p>
              </div>
              <Users className="w-8 h-8" style={{ color: textColor }} />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: textColor }}>Active Subscribers</p>
                <p className="text-2xl font-bold" style={{ color: textColor }}>{subscribedCount}</p>
              </div>
              <Mail className="w-8 h-8" style={{ color: textColor }} />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: textColor }}>Unsubscribed</p>
                <p className="text-2xl font-bold" style={{ color: textColor }}>{newsletters.length - subscribedCount}</p>
              </div>
              <Users className="w-8 h-8" style={{ color: textColor }} />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: textColor }}>This Month</p>
                <p className="text-2xl font-bold" style={{ color: textColor }}>
                  {newsletters.filter(n => {
                    const d = new Date(n.subscribedAt);
                    const now = new Date();
                    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
                  }).length}
                </p>
              </div>
              <Calendar className="w-8 h-8" style={{ color: textColor }} />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden bg-white dark:bg-gray-800 rounded-xl shadow">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center p-8">
              <Loader2 className="w-8 h-8 animate-spin mb-4 text-[#0f8abe]" />
              <p style={{ color: textColor }}>Loading newsletter subscribers...</p>
            </div>
          ) : filteredNewsletters.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 p-8 max-w-md mx-auto">
                <Mail className="w-12 h-12 mx-auto mb-4" style={{ color: textColor }} />
                <h3 className="text-lg font-semibold mb-2" style={{ color: textColor }}>
                  {searchTerm || statusFilter !== "all" ? "No matching subscribers" : "No subscribers found"}
                </h3>
                <p className="mb-6" style={{ color: textColor }}>
                  {searchTerm || statusFilter !== "all"
                    ? "Try adjusting your search or filter criteria."
                    : "Subscribers will appear here when they sign up for your newsletter"}
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
                        ref={(el) => { if (el) el.indeterminate = isIndeterminate; }}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="w-4 h-4 text-[#0f8abe] bg-gray-100 border-0 rounded focus:ring-[#0f8abe] focus:ring-2"
                      />
                    </th>
                    {['Subscriber', 'Status', 'Source', 'Subscribed', 'Last Email'].map(h => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: textColor }}>{h}</th>
                    ))}
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
                            className="w-4 h-4 text-[#0f8abe] bg-gray-100 border-0 rounded focus:ring-[#0f8abe] focus:ring-2 disabled:opacity-50"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium" style={{ color: textColor }}>
                              {newsletter.firstName} {newsletter.lastName}
                            </div>
                            <div className="text-sm" style={{ color: textColor }}>{newsletter.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(newsletter.status)}`}
                            style={{ color: newsletter.status === "subscribed" ? '#ffffff' : textColor }}>
                            {newsletter.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${sourceInfo.color}`} style={{ color: textColor }}>
                            {sourceInfo.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm" style={{ color: textColor }}>{formatDate(newsletter.subscribedAt)}</td>
                        <td className="px-6 py-4 text-sm" style={{ color: textColor }}>{formatDate(newsletter.lastEmailSent)}</td>
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