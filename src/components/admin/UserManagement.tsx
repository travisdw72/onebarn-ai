import React, { useState } from 'react';
import { Users, Eye, Settings, MessageCircle, Activity, Clock, Monitor } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  barn: string;
  role: string;
  status: 'online' | 'idle' | 'offline';
  lastActivity: string;
  currentPage: string;
  sessionDuration: string;
}

interface UserManagementProps {
  users: User[];
  onImpersonate: (userId: string) => void;
}

export const UserManagement: React.FC<UserManagementProps> = ({
  users,
  onImpersonate
}) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'sessions' | 'activity'>('list');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-600 bg-green-50 border-green-200';
      case 'idle': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'offline': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner': return 'text-stable-mahogany bg-arena-sand border-stable-mahogany';
      case 'trainer': return 'text-hunter-green bg-arena-sand border-hunter-green';
      case 'admin': return 'text-victory-rose bg-arena-sand border-victory-rose';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const handleViewUserSession = (user: User) => {
    setSelectedUser(user);
  };

  return (
    <div className="user-management">
      {/* View Mode Selector */}
      <div className="view-selector">
        <button
          onClick={() => setViewMode('list')}
          className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
        >
          <Users className="w-4 h-4" />
          User List
        </button>
        <button
          onClick={() => setViewMode('sessions')}
          className={`view-btn ${viewMode === 'sessions' ? 'active' : ''}`}
        >
          <Monitor className="w-4 h-4" />
          Active Sessions
        </button>
        <button
          onClick={() => setViewMode('activity')}
          className={`view-btn ${viewMode === 'activity' ? 'active' : ''}`}
        >
          <Activity className="w-4 h-4" />
          User Activity
        </button>
      </div>

      {viewMode === 'list' && (
        <div className="users-list">
          <h2 className="section-title font-raleway font-bold text-xl mb-4">
            All Users ({users.length})
          </h2>
          
          <div className="users-grid">
            {users.map(user => (
              <div key={user.id} className="user-card">
                <div className="user-header">
                  <div className="user-info">
                    <h3 className="font-raleway font-semibold text-lg">{user.name}</h3>
                    <p className="font-raleway text-sm text-gray-600">{user.email}</p>
                  </div>
                  <div className={`user-status ${getStatusColor(user.status)}`}>
                    <div className="status-dot"></div>
                    <span className="font-raleway text-sm font-medium">
                      {user.status}
                    </span>
                  </div>
                </div>
                
                <div className="user-details">
                  <div className="detail-row">
                    <span className="label">Barn:</span>
                    <span className="value">{user.barn}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Role:</span>
                    <span className={`role-badge ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Last Activity:</span>
                    <span className="value">{user.lastActivity}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Current Page:</span>
                    <span className="value font-mono text-sm">{user.currentPage}</span>
                  </div>
                </div>
                
                <div className="user-actions">
                  <button
                    onClick={() => handleViewUserSession(user)}
                    className="action-btn secondary"
                  >
                    <Eye className="w-4 h-4" />
                    View Session
                  </button>
                  <button
                    onClick={() => onImpersonate(user.id)}
                    className="action-btn primary"
                  >
                    <Monitor className="w-4 h-4" />
                    Impersonate
                  </button>
                  <button className="action-btn secondary">
                    <MessageCircle className="w-4 h-4" />
                    Message
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {viewMode === 'sessions' && (
        <div className="active-sessions">
          <h2 className="section-title font-raleway font-bold text-xl mb-4">
            Active User Sessions
          </h2>
          
          <div className="sessions-table">
            <div className="table-header">
              <div className="header-cell">User</div>
              <div className="header-cell">Status</div>
              <div className="header-cell">Duration</div>
              <div className="header-cell">Current Page</div>
              <div className="header-cell">Last Activity</div>
              <div className="header-cell">Actions</div>
            </div>
            
            {users.filter(u => u.status !== 'offline').map(user => (
              <div key={user.id} className="table-row">
                <div className="table-cell">
                  <div className="user-cell">
                    <div className="user-avatar">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-raleway font-medium">{user.name}</div>
                      <div className="font-raleway text-sm text-gray-600">{user.barn}</div>
                    </div>
                  </div>
                </div>
                <div className="table-cell">
                  <span className={`status-badge ${user.status}`}>
                    {user.status}
                  </span>
                </div>
                <div className="table-cell">{user.sessionDuration}</div>
                <div className="table-cell font-mono text-sm">{user.currentPage}</div>
                <div className="table-cell">{user.lastActivity}</div>
                <div className="table-cell">
                  <div className="table-actions">
                    <button
                      onClick={() => onImpersonate(user.id)}
                      className="action-btn-sm primary"
                    >
                      <Eye className="w-3 h-3" />
                      View
                    </button>
                    <button className="action-btn-sm secondary">
                      <Settings className="w-3 h-3" />
                      Manage
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {viewMode === 'activity' && (
        <div className="user-activity">
          <h2 className="section-title font-raleway font-bold text-xl mb-4">
            Recent User Activity
          </h2>
          
          <div className="activity-feed">
            <div className="activity-item">
              <div className="activity-timestamp">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="font-raleway text-sm text-gray-600">2 minutes ago</span>
              </div>
              <div className="activity-content">
                <h4 className="font-raleway font-semibold">User login</h4>
                <p className="font-raleway text-sm text-gray-700">Sarah Johnson logged in from mobile device</p>
                <span className="font-mono text-xs text-gray-500">/dashboard</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Session Modal */}
      {selectedUser && (
        <div className="session-modal-overlay" onClick={() => setSelectedUser(null)}>
          <div className="session-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="font-raleway font-bold text-lg">
                {selectedUser.name}'s Session
              </h3>
              <button
                onClick={() => setSelectedUser(null)}
                className="close-btn"
              >
                ×
              </button>
            </div>
            
            <div className="modal-content">
              <div className="session-info">
                <div className="info-item">
                  <span className="label">Current Page:</span>
                  <span className="value font-mono">{selectedUser.currentPage}</span>
                </div>
                <div className="info-item">
                  <span className="label">Session Duration:</span>
                  <span className="value">{selectedUser.sessionDuration}</span>
                </div>
                <div className="info-item">
                  <span className="label">Status:</span>
                  <span className={`status-badge ${selectedUser.status}`}>
                    {selectedUser.status}
                  </span>
                </div>
              </div>
              
              <div className="session-actions">
                <button
                  onClick={() => onImpersonate(selectedUser.id)}
                  className="action-btn primary"
                >
                  <Monitor className="w-4 h-4" />
                  View Their Dashboard
                </button>
                <button className="action-btn secondary">
                  <MessageCircle className="w-4 h-4" />
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 