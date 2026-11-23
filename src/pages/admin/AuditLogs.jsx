import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import { History, Filter } from 'lucide-react';

export const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, totalPages: 1 });
  const [actionFilter, setActionFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);

  const toast = useToast();

  const fetchLogs = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getAuditLogs({
        action: actionFilter,
        page: pagination.page,
        limit: pagination.limit
      });

      if (data.success) {
        setLogs(data.logs);
        setPagination(data.pagination);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load audit logs');
    } finally {
      setIsLoading(false);
    }
  }, [actionFilter, pagination.page, pagination.limit, toast]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const actionsList = [
    'ALL',
    'USER_CREATED',
    'USER_UPDATED',
    'USER_STATUS_CHANGED',
    'USER_BLOCKED',
    'USER_UNBLOCKED',
    'USER_DELETED',
    'USER_RESTORED',
    'INVITATION_SENT',
    'INVITATION_RESENT',
    'INVITATION_ACCEPTED',
    'EMAIL_VERIFIED',
    'USER_LOGIN',
    'USER_LOGOUT',
    'PASSWORD_CHANGED',
    'PASSWORD_RESET_COMPLETED',
    'SECURITY_ALERT_EMAIL_MISMATCH'
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">System Audit Trail</h1>
          <p className="text-sm text-slate-500 mt-1">
            Immutable log of all administrative actions, account lifecycles, and security events.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={actionFilter}
            onChange={(e) => {
              setActionFilter(e.target.value);
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700"
          >
            {actionsList.map((act) => (
              <option key={act} value={act}>
                {act === 'ALL' ? 'All Event Types' : act}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4 sm:px-6">Timestamp</th>
                <th className="py-3.5 px-4">Action Event</th>
                <th className="py-3.5 px-4">Actor</th>
                <th className="py-3.5 px-4">Target User</th>
                <th className="py-3.5 px-4">IP Address</th>
                <th className="py-3.5 px-4 pr-6">Event Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent mb-2" />
                    <p className="text-xs">Fetching audit logs...</p>
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    <History className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold text-sm text-slate-600">No audit records found</p>
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 sm:px-6 font-mono text-slate-500 text-[11px]">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-md font-mono text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      {log.performedBy ? (
                        <div>
                          <div>{log.performedBy.name}</div>
                          <div className="text-[10px] text-slate-400 font-normal">{log.performedBy.email}</div>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">System</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {log.targetUserEmail || (log.targetUser ? log.targetUser.email : 'N/A')}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">
                      {log.ipAddress || '127.0.0.1'}
                    </td>
                    <td className="py-3 px-4 pr-6">
                      <span className="font-mono text-[11px] text-slate-600 truncate max-w-xs block">
                        {log.details ? JSON.stringify(log.details) : '-'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <div>
              Page {pagination.page} of {pagination.totalPages} ({pagination.total} entries)
            </div>
            <div className="flex gap-2">
              <button
                disabled={pagination.page <= 1}
                onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
              >
                Previous
              </button>
              <button
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
