import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, Search, Filter, Bell, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { noticeAPI } from '../../api/noticeApi';

const Notice = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await noticeAPI.getAllNotices();
        const fetchedNotices = response.data.notices.map(notice => ({
          id: notice._id,
          title: notice.title,
          content: notice.content,
          category: notice.type, // Map type to category
          priority: notice.priority,
          date: new Date(notice.publishedAt).toISOString().split('T')[0], // YYYY-MM-DD
          time: new Date(notice.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          author: notice.publishedBy?.name || 'Unknown',
          attachments: 0 // Assuming no attachments for now
        }));
        setNotices(fetchedNotices);
      } catch (err) {
        setError('Failed to load notices');
        console.error('Error fetching notices:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  const categories = [
    { value: 'all', label: 'All Notices', color: 'bg-gray-100 text-gray-800' },
    { value: 'announcement', label: 'Announcement', color: 'bg-blue-100 text-blue-800' },
    { value: 'maintenance', label: 'Maintenance', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'event', label: 'Events', color: 'bg-purple-100 text-purple-800' },
    { value: 'emergency', label: 'Emergency', color: 'bg-red-100 text-red-800' },
    { value: 'general', label: 'General', color: 'bg-green-100 text-green-800' }
  ];

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
        return <AlertTriangle size={16} className="text-red-500" />;
      case 'medium':
        return <Info size={16} className="text-yellow-500" />;
      case 'low':
        return <CheckCircle size={16} className="text-green-500" />;
      default:
        return <Info size={16} className="text-gray-500" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500';
      case 'medium':
        return 'border-l-yellow-500';
      case 'low':
        return 'border-l-green-500';
      default:
        return 'border-l-gray-500';
    }
  };

  const filteredNotices = notices.filter(notice => {
    const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notice.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || notice.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-[#19aaba] via-[#158c99] to-[#116d77] text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Bell size={48} className="mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold">Hall Notices</h1>
            </div>
            <p className="text-xl md:text-2xl text-cyan-100 max-w-3xl mx-auto">
              Stay updated with the latest announcements, important dates, and hall-related information
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#19aaba] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading notices...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <AlertTriangle size={64} className="mx-auto text-red-300 mb-4" />
            <h3 className="text-xl font-semibold text-red-600 mb-2">Error loading notices</h3>
            <p className="text-gray-500">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search Bar */}
            <div className="relative flex-1 w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search notices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent outline-none"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Filter size={20} className="text-gray-600" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent outline-none"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Notices Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotices.map((notice) => (
            <div
              key={notice.id}
              className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 ${getPriorityColor(notice.priority)} overflow-hidden`}
            >
              {/* Notice Header */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getPriorityIcon(notice.priority)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      categories.find(cat => cat.value === notice.category)?.color || 'bg-gray-100 text-gray-800'
                    }`}>
                      {categories.find(cat => cat.value === notice.category)?.label || notice.category}
                    </span>
                  </div>
                  {notice.attachments > 0 && (
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      📎 {notice.attachments}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-gray-800 mb-3 line-clamp-2">
                  {notice.title}
                </h3>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {notice.content}
                </p>

                {/* Notice Meta */}
                <div className="flex items-center justify-between text-xs text-gray-500 border-t pt-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} />
                      <span>{new Date(notice.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={12} />
                      <span>{notice.time}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <User size={12} />
                    <span>{notice.author}</span>
                  </div>
                </div>
              </div>

              {/* Notice Footer */}
              <div className="px-6 pb-4">
                <button 
                  onClick={() => navigate(`/notice/${notice.id}`)}
                  className="w-full bg-gradient-to-r from-[#19aaba] to-[#158c99] text-white py-2 px-4 rounded-lg hover:from-[#158c99] hover:to-[#116d77] transition-all duration-300 text-sm font-medium"
                >
                  Read More
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredNotices.length === 0 && (
          <div className="text-center py-12">
            <Bell size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No notices found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}

        </>
        )}
      </div>
    </div>
  );
};

export default Notice;
