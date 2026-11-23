import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { useAuth } from '../../context/AuthContext';
import {
  Users,
  UserCheck,
  UserX,
  Mail,
  Ban,
  ShieldCheck,
  Activity,
  PlusCircle,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    invited: 0,
    deleted: 0,
    superAdmins: 0
  });
  const [recentLogs, setRecentLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const [statsRes, logsRes] = await Promise.all([
        adminService.getUserStats(),
        adminService.getAuditLogs({ limit: 6 })
      ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (logsRes.success) setRecentLogs(logsRes.logs);
    } catch (err) {
      console.error('Failed to load admin dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const statCards = [
    {
      title: 'Total Directory Users',
      value: stats.total,
      icon: Users,
      color: 'bg-blue-500/10 text-blue-600',
      badge: `${stats.superAdmins} Admins`
    },
    {
      title: 'Active Users',
      value: stats.active,
      icon: UserCheck,
      color: 'bg-emerald-500/10 text-emerald-600',
      badge: 'Active & Verified'
    },
    {
      title: 'Pending Invitations',
      value: stats.invited,
      icon: Mail,
      color: 'bg-sky-500/10 text-sky-600',
      badge: 'Awaiting Activation'
    },
    {
      title: 'Inactive Accounts',
      value: stats.inactive,
      icon: UserX,
      color: 'bg-amber-500/10 text-amber-600',
      badge: 'Access Suspended'
    },
    {
      title: 'Blocked Accounts',
      value: stats.blocked ?? stats.deleted,
      icon: Ban,
      color: 'bg-rose-500/10 text-rose-600',
      badge: 'Access Barred'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold backdrop-blur-md">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              Talkism Private Limited • Ernakulam Technology Centre
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Welcome back, {user?.name || 'Talkism Administrator'}
            </h1>
            <p className="text-slate-300 text-sm max-w-xl leading-relaxed">
              Centralized administrative governance over Talkism engineering, product, and listener operations personnel.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={fetchData}
              disabled={isLoading}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-md transition-colors flex items-center gap-2"
              title="Refresh Stats"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <Link
              to="/admin/users?action=create"
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              Add Talkism Employee
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className={`p-2.5 rounded-xl ${card.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {card.badge}
                </span>
              </div>
              <div className="mt-4">
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {card.value}
                </div>
                <div className="text-xs font-medium text-slate-500 mt-1">{card.title}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Link
          to="/admin/users"
          className="group p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div>
            <div className="p-3 w-fit rounded-xl bg-blue-50 text-blue-600 mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">User Management Table</h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Create, edit, toggle active status, soft-delete, or restore users. Search and filter by status and role.
            </p>
          </div>
          <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
            Open Directory <ArrowRight className="w-4 h-4" />
          </div>
        </Link>

        <Link
          to="/admin/users?status=BLOCKED"
          className="group p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-rose-300 hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div>
            <div className="p-3 w-fit rounded-xl bg-rose-50 text-rose-600 mb-4 group-hover:bg-rose-600 group-hover:text-white transition-colors">
              <Ban className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Blocked Accounts</h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Safely inspect and manage blocked staff accounts, and restore their active ERP login access with a single click.
            </p>
          </div>
          <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-rose-600 group-hover:translate-x-1 transition-transform">
            View Blocked Accounts <ArrowRight className="w-4 h-4" />
          </div>
        </Link>

        <Link
          to="/admin/audit-logs"
          className="group p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-purple-300 hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div>
            <div className="p-3 w-fit rounded-xl bg-purple-50 text-purple-600 mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">System Audit Trail</h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Immutable activity tracking of user creation, status changes, logins, password updates, and deletions.
            </p>
          </div>
          <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-purple-600 group-hover:translate-x-1 transition-transform">
            Review Audit Logs <ArrowRight className="w-4 h-4" />
          </div>
        </Link>
      </div>

      {/* Recent Audit Activities */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-slate-500" />
            <h3 className="text-sm font-bold text-slate-900">Recent Administrative Activities</h3>
          </div>
          <Link
            to="/admin/audit-logs"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700"
          >
            View all logs →
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          {recentLogs.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500">No activity logged yet.</div>
          ) : (
            recentLogs.map((log) => (
              <div key={log._id} className="p-4 sm:px-6 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 rounded-md font-mono text-[11px] font-semibold bg-slate-100 text-slate-700">
                    {log.action}
                  </span>
                  <div>
                    <span className="font-semibold text-slate-900">
                      {log.performedBy?.name || 'System'}
                    </span>
                    {log.targetUserEmail && (
                      <span className="text-slate-500 ml-1.5">
                        → target: <span className="font-mono text-slate-700">{log.targetUserEmail}</span>
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-slate-400 font-mono text-[11px]">
                  {new Date(log.createdAt).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
