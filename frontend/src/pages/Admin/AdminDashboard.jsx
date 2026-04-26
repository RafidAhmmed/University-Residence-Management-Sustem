import React, { useState, useEffect } from 'react';
import {
  Users, Shield, Loader, ArrowRight, MessageSquare, Bell, UserCog, CreditCard
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { userAPI } from '../../api/userApi';
import { complaintAPI } from '../../api/complaintApi';
import { noticeAPI } from '../../api/noticeApi';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0, admins: 0, students: 0, recentUsers: 0,
    totalComplaints: 0, pendingComplaints: 0, resolvedComplaints: 0,
    totalNotices: 0, activeNotices: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const [usersRes, complaintsRes, noticesRes] = await Promise.all([
        userAPI.getAllUsers(),
        complaintAPI.getAllComplaints(),
        noticeAPI.getAllNotices({ page: 1, limit: 100 }),
      ]);

      const users = Array.isArray(usersRes?.data) ? usersRes.data : [];
      const complaints = Array.isArray(complaintsRes?.data?.complaints) ? complaintsRes.data.complaints : [];
      const notices = Array.isArray(noticesRes?.data?.notices) ? noticesRes.data.notices : [];

      const now = new Date();
      const thirtyDaysAgo = new Date(now);
      thirtyDaysAgo.setDate(now.getDate() - 30);

      const admins = users.filter((u) => u.role === 'admin').length;
      const recentUsers = users.filter((u) => u.createdAt && new Date(u.createdAt) >= thirtyDaysAgo).length;
      const pendingComplaints = complaints.filter((c) => c.status === 'pending').length;
      const resolvedComplaints = complaints.filter((c) => c.status === 'resolved').length;
      const totalNotices = noticesRes?.data?.total ?? notices.length;

      setStats({
        totalUsers: users.length, admins, students: users.length - admins, recentUsers,
        totalComplaints: complaintsRes?.data?.total ?? complaints.length,
        pendingComplaints, resolvedComplaints, totalNotices, activeNotices: totalNotices,
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color }) => (
    <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 hover:shadow-md transition-all duration-300 border border-gray-100" style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
          <p className="text-2xl font-bold text-primary">{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>
        <div className="p-3 rounded-lg" style={{ backgroundColor: `${color}15` }}>
          <Icon size={24} color={color} />
        </div>
      </div>
    </div>
  );

  const ActionCard = ({ icon: Icon, title, description, color, onClick, badge }) => (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-all duration-300 cursor-pointer group border border-gray-100 hover:border-accent card-hover"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="p-3 rounded-lg" style={{ backgroundColor: `${color}15` }}>
          <Icon size={26} color={color} />
        </div>
        <ArrowRight className="text-gray-300 group-hover:text-secondary group-hover:translate-x-1 transition-all" size={20} />
      </div>
      <h3 className="text-lg font-bold text-primary mb-1.5 font-heading">{title}</h3>
      <p className="text-gray-500 text-sm">{description}</p>
      {badge && <p className="text-xs text-secondary mt-2 font-medium">{badge}</p>}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface">
        <div className="text-center">
          <Loader className="animate-spin mx-auto mb-4" size={40} color="#1d3557" />
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-primary rounded-xl p-6 text-white shadow-lg">
            <h1 className="text-2xl md:text-3xl font-bold mb-1 font-heading">Admin Dashboard</h1>
            <p className="text-white/60 text-sm">Live system overview and quick admin actions.</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <StatCard icon={Users} title="Total Users" value={stats.totalUsers} subtitle="All registered users" color="#1d3557" />
          <StatCard icon={Shield} title="Admins" value={stats.admins} subtitle="System administrators" color="#e63946" />
          <StatCard icon={Users} title="Students" value={stats.students} subtitle="Hall residents" color="#457b9d" />
          <StatCard icon={MessageSquare} title="Complaints" value={stats.totalComplaints} subtitle={`${stats.pendingComplaints} pending`} color="#e9c46a" />
          <StatCard icon={Bell} title="Published Notices" value={stats.totalNotices} subtitle={`${stats.activeNotices} active`} color="#2a9d8f" />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-primary mb-5 font-heading">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <ActionCard
              icon={UserCog} title="Manage Users"
              description="Edit user data, update roles, apply filters, and export user lists."
              color="#1d3557" onClick={() => navigate('/admin/manage-users')}
              badge={`${stats.totalUsers} total users`}
            />
            <ActionCard
              icon={MessageSquare} title="Manage Complaints"
              description="Review, respond to, and resolve student complaints."
              color="#e9c46a" onClick={() => navigate('/admin/complaints')}
              badge={`${stats.pendingComplaints} pending / ${stats.resolvedComplaints} resolved`}
            />
            <ActionCard
              icon={Bell} title="Publish Notice"
              description="Create new notices and review previous publications."
              color="#2a9d8f" onClick={() => navigate('/admin/publish-notice')}
              badge={`${stats.totalNotices} total published notices`}
            />
            <ActionCard
              icon={CreditCard} title="Manage Fees"
              description="Assign multi-part fees to filtered users and simulate online payments."
              color="#457b9d" onClick={() => navigate('/admin/fees')}
              badge="bKash, Nagad, SSLCommerz mock gateway"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;