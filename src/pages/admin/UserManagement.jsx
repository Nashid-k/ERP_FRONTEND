import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { StatusBadge } from '../../components/StatusBadge';
import { RoleBadge } from '../../components/RoleBadge';
import { Modal } from '../../components/Modal';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import {
  Users,
  Search,
  Plus,
  Filter,
  MoreVertical,
  CheckCircle2,
  Ban,
  Trash2,
  RotateCcw,
  Mail,
  Edit,
  Eye,
  Copy,
  Check,
  Building,
  Phone,
  Shield,
  Clock,
  Send,
  ExternalLink
} from 'lucide-react';

export const UserManagement = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialStatus = searchParams.get('status') || 'ALL';
  const actionParam = searchParams.get('action');

  const { user: currentUser } = useAuth();
  const toast = useToast();

  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [roleFilter, setRoleFilter] = useState('ALL');

  // Debounce search term to prevent rapid request firing while typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPagination((prev) => ({ ...prev, page: 1 }));
    }, 350);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(actionParam === 'create');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({});
  const [actionLoading, setActionLoading] = useState(false);

  // Invitation Success Modal
  const [createdInviteData, setCreatedInviteData] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Active target user
  const [selectedUser, setSelectedUser] = useState(null);

  // Form states
  const [addForm, setAddForm] = useState({
    name: '',
    email: '',
    role: 'USER',
    department: 'General',
    phone: '',
    bio: ''
  });

  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    role: 'USER',
    department: '',
    phone: '',
    bio: ''
  });

  // Fetch users
  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getUsers({
        search: debouncedSearch,
        status: statusFilter,
        role: roleFilter,
        page: pagination.page,
        limit: pagination.limit
      });

      if (data.success) {
        setUsers(data.users);
        setPagination(data.pagination);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, statusFilter, roleFilter, pagination.page, pagination.limit, toast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Handle Create User
  const handleCreateUser = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const data = await adminService.createUser(addForm);
      toast.success(data.message);
      setIsAddModalOpen(false);
      setAddForm({
        name: '',
        email: '',
        role: 'USER',
        department: 'General',
        phone: '',
        bio: ''
      });

      // Display the invitation link modal
      if (data.invitationLink) {
        setCreatedInviteData({
          email: data.user.email,
          name: data.user.name,
          link: data.invitationLink
        });
      }

      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create user');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Edit User
  const handleOpenEdit = (user) => {
    setSelectedUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department || '',
      phone: user.phone || '',
      bio: user.bio || ''
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;
    setActionLoading(true);

    try {
      const data = await adminService.updateUser(selectedUser._id, editForm);
      toast.success(data.message);
      setIsEditModalOpen(false);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update user');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Status Toggle (Activate / Deactivate)
  const handleToggleStatus = (user) => {
    const newStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    setConfirmConfig({
      title: `${newStatus === 'ACTIVE' ? 'Activate' : 'Deactivate'} User Account`,
      message: `Are you sure you want to change ${user.name}'s account status to ${newStatus}? ${
        newStatus === 'INACTIVE'
          ? 'They will be immediately blocked from logging in.'
          : 'They will be permitted to authenticate.'
      }`,
      type: newStatus === 'ACTIVE' ? 'restore' : 'warning',
      confirmText: `${newStatus === 'ACTIVE' ? 'Activate' : 'Deactivate'} Account`,
      onConfirm: async () => {
        setActionLoading(true);
        try {
          const res = await adminService.updateUserStatus(user._id, newStatus);
          toast.success(res.message);
          setIsConfirmOpen(false);
          fetchUsers();
        } catch (err) {
          toast.error(err.response?.data?.message || 'Failed to change status');
        } finally {
          setActionLoading(false);
        }
      }
    });
    setIsConfirmOpen(true);
  };

  // Handle Block User
  const handlePromptBlock = (user) => {
    setConfirmConfig({
      title: 'Block User Account',
      message: `Are you sure you want to block "${user.name}" (${user.email})? The user will be instantly barred from authenticating and accessing any Talkism ERP systems until unblocked.`,
      type: 'danger',
      confirmText: 'Block User',
      onConfirm: async () => {
        setActionLoading(true);
        try {
          const res = await adminService.blockUser(user._id);
          toast.success(res.message);
          setIsConfirmOpen(false);
          fetchUsers();
        } catch (err) {
          toast.error(err.response?.data?.message || 'Failed to block user');
        } finally {
          setActionLoading(false);
        }
      }
    });
    setIsConfirmOpen(true);
  };

  // Handle Unblock User
  const handlePromptUnblock = (user) => {
    setConfirmConfig({
      title: 'Unblock User Account',
      message: `Do you want to unblock "${user.name}" (${user.email})? Their account status will be restored and they will regain ERP access.`,
      type: 'restore',
      confirmText: 'Unblock Account',
      onConfirm: async () => {
        setActionLoading(true);
        try {
          const res = await adminService.unblockUser(user._id);
          toast.success(res.message);
          setIsConfirmOpen(false);
          fetchUsers();
        } catch (err) {
          toast.error(err.response?.data?.message || 'Failed to unblock user');
        } finally {
          setActionLoading(false);
        }
      }
    });
    setIsConfirmOpen(true);
  };

  // Handle Resend Invitation
  const handleResendInvitation = async (user) => {
    try {
      const res = await adminService.resendInvitation(user._id);
      toast.success(res.message);
      if (res.invitationLink) {
        setCreatedInviteData({
          email: user.email,
          name: user.name,
          link: res.invitationLink
        });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend invitation');
    }
  };

  const handleCopyLink = () => {
    if (createdInviteData?.link) {
      navigator.clipboard.writeText(createdInviteData.link);
      setCopiedLink(true);
      toast.success('Invitation link copied to clipboard!');
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const statusTabs = [
    { key: 'ALL', label: 'All Users' },
    { key: 'ACTIVE', label: 'Active' },
    { key: 'INVITED', label: 'Pending Invitations' },
    { key: 'INACTIVE', label: 'Inactive' },
    { key: 'BLOCKED', label: 'Blocked Accounts' }
  ];

  return (
    <div className="space-y-6">
      {/* Header and Add User Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Talkism Staff Directory</h1>
          <p className="text-sm text-slate-500 mt-1">
            Talkism Private Limited • Personnel lifecycle management, role allocations & access control.
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Talkism Staff
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-2 sm:space-x-4 overflow-x-auto pb-px">
          {statusTabs.map((tab) => {
            const isActive = statusFilter === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => {
                  setStatusFilter(tab.key);
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
                className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search users by name, email, or department..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 text-slate-700 w-full sm:w-auto"
            >
              <option value="ALL">All Roles</option>
              <option value="SUPER_ADMIN">Super Admins</option>
              <option value="USER">Regular Users</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4 sm:px-6">User & Identity</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Account Status</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4 hidden md:table-cell">Created</th>
                {(statusFilter === 'BLOCKED' || statusFilter === 'DELETED') && (
                  <th className="py-3.5 px-4 hidden lg:table-cell">Blocked Date</th>
                )}
                <th className="py-3.5 px-4 text-right pr-6">Lifecycle Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400 font-medium">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent mb-2" />
                    <p className="text-xs">Loading accounts...</p>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-500">
                    <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold text-sm">No accounts found</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {statusFilter === 'BLOCKED' || statusFilter === 'DELETED'
                        ? 'There are currently no blocked staff accounts.'
                        : 'Try adjusting your search filters or add a new user.'}
                    </p>
                  </td>
                </tr>
              ) : (
                users.map((item) => {
                  const isSelf = currentUser?._id === item._id;
                  const isItemBlocked = item.isBlocked || item.isDeleted || item.status === 'BLOCKED' || item.status === 'DELETED';
                  return (
                    <tr key={item._id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0 border border-slate-200">
                            {item.name?.[0]?.toUpperCase() || 'U'}
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-slate-900 truncate flex items-center gap-1.5">
                              {item.name}
                              {isSelf && (
                                <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-1.5 py-0.2 rounded">
                                  You
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-slate-500 truncate">{item.email}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <RoleBadge role={item.role} />
                      </td>

                      <td className="py-3.5 px-4">
                        <StatusBadge status={isItemBlocked ? 'BLOCKED' : item.status} />
                      </td>

                      <td className="py-3.5 px-4 font-medium text-slate-700">
                        {item.department || 'General'}
                      </td>

                      <td className="py-3.5 px-4 hidden md:table-cell text-xs text-slate-500">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>

                      {(statusFilter === 'BLOCKED' || statusFilter === 'DELETED') && (
                        <td className="py-3.5 px-4 hidden lg:table-cell text-xs text-rose-600 font-mono">
                          {item.blockedAt || item.deletedAt ? new Date(item.blockedAt || item.deletedAt).toLocaleString() : 'N/A'}
                        </td>
                      )}

                      <td className="py-3.5 px-4 text-right pr-6">
                        <div className="flex items-center justify-end gap-1 sm:gap-2">
                          <button
                            onClick={() => {
                              setSelectedUser(item);
                              setIsViewModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 cursor-pointer"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {!isItemBlocked && (
                            <>
                              <button
                                onClick={() => handleOpenEdit(item)}
                                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-blue-600 cursor-pointer"
                                title="Edit User"
                              >
                                <Edit className="w-4 h-4" />
                              </button>

                              {item.status === 'INVITED' && (
                                <button
                                  onClick={() => handleResendInvitation(item)}
                                  className="p-1.5 rounded-lg text-sky-600 hover:bg-sky-50 cursor-pointer"
                                  title="Resend Invitation Email"
                                >
                                  <Send className="w-4 h-4" />
                                </button>
                              )}

                              {!isSelf && item.status !== 'INVITED' && (
                                <button
                                  onClick={() => handleToggleStatus(item)}
                                  className={`p-1.5 rounded-lg cursor-pointer ${
                                    item.status === 'ACTIVE'
                                      ? 'text-amber-600 hover:bg-amber-50'
                                      : 'text-emerald-600 hover:bg-emerald-50'
                                  }`}
                                  title={item.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                                >
                                  {item.status === 'ACTIVE' ? (
                                    <Ban className="w-4 h-4" />
                                  ) : (
                                    <CheckCircle2 className="w-4 h-4" />
                                  )}
                                </button>
                              )}

                              {!isSelf && (
                                <button
                                  onClick={() => handlePromptBlock(item)}
                                  className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-700 cursor-pointer"
                                  title="Block User"
                                >
                                  <Ban className="w-4 h-4" />
                                </button>
                              )}
                            </>
                          )}

                          {isItemBlocked && (
                            <button
                              onClick={() => handlePromptUnblock(item)}
                              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 flex items-center gap-1 cursor-pointer"
                              title="Unblock User Account"
                            >
                              <RotateCcw className="w-3.5 h-3.5" /> Unblock
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <div>
              Showing Page {pagination.page} of {pagination.totalPages} ({pagination.total} Total)
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

      {/* Modal 1: Add User Form */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New User Account"
      >
        <form onSubmit={handleCreateUser} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={addForm.name}
                onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                placeholder="e.g. John Doe"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Authorized Email *
              </label>
              <input
                type="email"
                required
                value={addForm.email}
                onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                placeholder="user@erp-company.com"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Role Authority *
              </label>
              <select
                value={addForm.role}
                onChange={(e) => setAddForm({ ...addForm, role: e.target.value })}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="USER">Regular User</option>
                <option value="SUPER_ADMIN">Super Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Department
              </label>
              <select
                value={addForm.department}
                onChange={(e) => setAddForm({ ...addForm, department: e.target.value })}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="Software Engineering">Software Engineering</option>
                <option value="Product & Design">Product & Design</option>
                <option value="Operations & Listener Support">Operations & Listener Support</option>
                <option value="Quality Assurance (QA)">Quality Assurance (QA)</option>
                <option value="HR & Administration">HR & Administration</option>
                <option value="Executive Management">Executive Management</option>
                <option value="General">General</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={addForm.phone}
                onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })}
                placeholder="+1 555-0199"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Short Notes / Bio
              </label>
              <input
                type="text"
                value={addForm.bio}
                onChange={(e) => setAddForm({ ...addForm, bio: e.target.value })}
                placeholder="Title or role description"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-800 leading-relaxed">
            <strong>Talkism Onboarding:</strong> Provisioning this staff user automatically dispatches an official Talkism Private Limited activation email containing a secure 48-hour onboarding token.
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="px-4 py-2 text-sm font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {actionLoading ? 'Creating User...' : 'Send Invitation & Create'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal 2: Edit User Form */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit User Details"
      >
        <form onSubmit={handleUpdateUser} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Role Authority
              </label>
              <select
                value={editForm.role}
                onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="USER">Regular User</option>
                <option value="SUPER_ADMIN">Super Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Department
              </label>
              <input
                type="text"
                value={editForm.department}
                onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Phone Number
            </label>
            <input
              type="text"
              value={editForm.phone}
              onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="px-4 py-2 text-sm font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {actionLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal 3: View Full User Details */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="User Account Details"
        maxWidth="max-w-2xl"
      >
        {selectedUser && (
          <div className="space-y-6">
            <div className="flex items-start justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                  {selectedUser.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">{selectedUser.name}</h4>
                  <p className="text-xs text-slate-500 font-mono">{selectedUser.email}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <StatusBadge status={selectedUser.status} />
                <RoleBadge role={selectedUser.role} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100 space-y-1">
                <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
                  Department
                </span>
                <p className="text-slate-800 font-medium">{selectedUser.department || 'Not Assigned'}</p>
              </div>

              <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100 space-y-1">
                <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
                  Phone Number
                </span>
                <p className="text-slate-800 font-medium">{selectedUser.phone || 'Not Provided'}</p>
              </div>

              <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100 space-y-1">
                <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
                  Email Verification Status
                </span>
                <p className="text-slate-800 font-medium">
                  {selectedUser.isEmailVerified ? 'Verified' : 'Pending Verification'}
                </p>
              </div>

              <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100 space-y-1">
                <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
                  Last Login Timestamp
                </span>
                <p className="text-slate-800 font-medium">
                  {selectedUser.lastLoginAt ? new Date(selectedUser.lastLoginAt).toLocaleString() : 'Never logged in'}
                </p>
              </div>

              <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100 space-y-1">
                <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
                  Created Date
                </span>
                <p className="text-slate-800 font-medium">
                  {new Date(selectedUser.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100 space-y-1">
                <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
                  Account Creator
                </span>
                <p className="text-slate-800 font-medium">
                  {selectedUser.createdBy?.name ? `${selectedUser.createdBy.name} (${selectedUser.createdBy.email})` : 'System Provisioning'}
                </p>
              </div>

              {(selectedUser.isBlocked || selectedUser.isDeleted || selectedUser.status === 'BLOCKED') && (
                <>
                  <div className="p-3 bg-rose-50 rounded-xl border border-rose-100 space-y-1">
                    <span className="font-semibold text-rose-500 uppercase tracking-wider text-[10px]">
                      Blocked Timestamp
                    </span>
                    <p className="text-rose-900 font-medium">
                      {selectedUser.blockedAt || selectedUser.deletedAt ? new Date(selectedUser.blockedAt || selectedUser.deletedAt).toLocaleString() : 'N/A'}
                    </p>
                  </div>

                  <div className="p-3 bg-rose-50 rounded-xl border border-rose-100 space-y-1">
                    <span className="font-semibold text-rose-500 uppercase tracking-wider text-[10px]">
                      Blocked By Admin
                    </span>
                    <p className="text-rose-900 font-medium">
                      {selectedUser.blockedBy?.name || selectedUser.deletedBy?.name || 'Administrator'}
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsViewModalOpen(false)}
                className="px-4 py-2 text-sm font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal 4: Invitation Generated Success Modal (Dev / Demo Convenience) */}
      <Modal
        isOpen={!!createdInviteData}
        onClose={() => setCreatedInviteData(null)}
        title="User Created & Invitation Dispatched"
        maxWidth="max-w-lg"
      >
        {createdInviteData && (
          <div className="space-y-4">
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs text-emerald-900 leading-relaxed">
                An invitation email has been dispatched to <strong>{createdInviteData.email}</strong>.
                For immediate local testing, you can also copy the activation link below:
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Direct Activation URL
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={createdInviteData.link}
                  className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-300 bg-slate-50 text-slate-700"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-3 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 flex items-center gap-1.5 shrink-0"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedLink ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <a
                href={createdInviteData.link}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded-lg flex items-center gap-1 border border-blue-200"
              >
                Open Activation Page <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                type="button"
                onClick={() => setCreatedInviteData(null)}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        isLoading={actionLoading}
        {...confirmConfig}
      />
    </div>
  );
};
