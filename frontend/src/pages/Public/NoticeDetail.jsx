import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, ArrowLeft, Bell, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { noticeAPI } from '../../api/noticeApi';

const NoticeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const response = await noticeAPI.getNoticeById(id);
        setNotice(response.data);
      } catch (err) {
        setError('Failed to load notice details');
        console.error('Error fetching notice:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotice();
  }, [id]);

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
        return <AlertTriangle size={20} className="text-red-500" />;
      case 'medium':
        return <Info size={20} className="text-yellow-500" />;
      case 'low':
        return <CheckCircle size={20} className="text-green-500" />;
      default:
        return <Info size={20} className="text-gray-500" />;
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

  const categories = [
    { value: 'announcement', label: 'Announcement', color: 'bg-blue-100 text-blue-800' },
    { value: 'maintenance', label: 'Maintenance', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'event', label: 'Events', color: 'bg-purple-100 text-purple-800' },
    { value: 'emergency', label: 'Emergency', color: 'bg-red-100 text-red-800' },
    { value: 'general', label: 'General', color: 'bg-green-100 text-green-800' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#19aaba] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading notice...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle size={64} className="mx-auto text-red-300 mb-4" />
          <h3 className="text-xl font-semibold text-red-600 mb-2">Error loading notice</h3>
          <p className="text-gray-500">{error}</p>
          <button
            onClick={() => navigate('/notice')}
            className="mt-4 bg-[#19aaba] text-white px-4 py-2 rounded-lg hover:bg-[#158c99] transition-colors"
          >
            Back to Notices
          </button>
        </div>
      </div>
    );
  }

  if (!notice) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Bell size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Notice not found</h3>
          <button
            onClick={() => navigate('/notice')}
            className="mt-4 bg-[#19aaba] text-white px-4 py-2 rounded-lg hover:bg-[#158c99] transition-colors"
          >
            Back to Notices
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-[#19aaba] via-[#158c99] to-[#116d77] text-white py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/notice')}
            className="flex items-center gap-2 text-cyan-100 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            Back to Notices
          </button>
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Bell size={32} className="mr-3" />
              <h1 className="text-2xl md:text-3xl font-bold">Notice Details</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Notice Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`bg-white rounded-xl shadow-lg border-l-4 ${getPriorityColor(notice.priority)} overflow-hidden`}>
          {/* Notice Header */}
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                {getPriorityIcon(notice.priority)}
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  categories.find(cat => cat.value === notice.type)?.color || 'bg-gray-100 text-gray-800'
                }`}>
                  {categories.find(cat => cat.value === notice.type)?.label || notice.type}
                </span>
              </div>
              <div className="text-right text-sm text-gray-500">
                <div className="flex items-center gap-1 mb-1">
                  <Calendar size={14} />
                  <span>{new Date(notice.publishedAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>{new Date(notice.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {notice.title}
            </h2>

            <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
              <User size={16} />
              <span>Published by: {notice.publishedBy?.name || 'Unknown'}</span>
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {notice.content}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoticeDetail;