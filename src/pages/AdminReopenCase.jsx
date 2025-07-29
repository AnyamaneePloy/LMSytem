import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { getClosedCases, submitReopenCase } from '../api/admin';

const users = [
  'john.doe@company.com',
  'jane.smith@company.com',
  'mike.johnson@company.com',
  'sarah.wilson@company.com',
  'david.brown@company.com',
];

export default function AdminReopenCase() {
  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedTask, setSelectedTask] = useState(null);
  const [setAssignee] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [toRecipients, setToRecipients] = useState([]);
  const [message, setMessage] = useState(null);
  const [ccRecipients, setCcRecipients] = useState([]);
  const [assignedUsers, setAssignedUsers] = useState([]);

  const loadTasks = async () => {
    try {
      const data = await getClosedCases();
      setTasks(data);
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: '❌ Failed to load closed cases.' });
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const filteredTasks =
    activeTab === 'all' ? tasks : tasks.filter((t) => t.status === activeTab);

  const handleReopen = async () => {
    if (assignedUsers.length === 0 || !notificationMessage.trim()) {
      setMessage({ type: 'error', text: 'Please assign at least one user and enter a message.' });
      return;
    }

    try {
      await submitReopenCase({
        caseId: selectedTask.caseId,
        reopenReason: 'Reopened via admin panel',
        comment: notificationMessage,
        assignedTo: assignedUsers,
        to: toRecipients,
        cc: ccRecipients,
        notifyStakeholders: true,
        attachments: [],
      });

      setMessage({ type: 'success', text: '✅ Task has been reopened and assigned.' });
      setSelectedTask(null);
      setNotificationMessage('');
      setToRecipients([]);
      setCcRecipients([]);
      setAssignedUsers([]);
      loadTasks();
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Reopen failed.' });
    }
  };

  return (
    <div className="container py-5 bg-light min-vh-100">
      <h1 className="mb-4 text-primary fw-bold">🧑‍⚖️ Admin Panel</h1>

      {message && (
        <div
          className={`alert ${
            message.type === 'success' ? 'alert-success' : 'alert-danger'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="row g-4 mb-4">
        <StatCard label="Total Tasks" value={tasks.length} variant="primary" icon="bi-list-task" />
        <StatCard
          label="Closed Tasks"
          value={tasks.filter((t) => t.status === 'closed').length}
          variant="success"
          icon="bi-check-circle-fill"
        />
        <StatCard
          label="Reopened Tasks"
          value={tasks.filter((t) => t.status === 'reopen').length}
          variant="warning"
          icon="bi-arrow-repeat"
        />
      </div>

      <ul className="nav nav-pills bg-white rounded shadow-sm mb-4 px-2 py-2 gap-2">
        <TabButton label="All Cases" tab="all" activeTab={activeTab} setActiveTab={setActiveTab} />
        <TabButton label="Closed Cases" tab="closed" activeTab={activeTab} setActiveTab={setActiveTab} />
        <TabButton label="Reopened Cases" tab="reopen" activeTab={activeTab} setActiveTab={setActiveTab} />
      </ul>

      <div className="row g-3">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <div className="col-12" key={task.caseId}>
              <div className="card shadow-sm">
                <div className="card-body d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="card-title mb-1">
                      {task.caseNumber}: {task.clientName}
                    </h5>
                    <p className="text-muted small mb-2">
                      Type: {task.caseType} | Closed: {task.closedDate}
                    </p>
                    <span className={`badge ${task.status === 'closed' ? 'bg-success' : 'bg-warning text-dark'}`}>
                      {task.status.toUpperCase()}
                    </span>
                  </div>
                  {task.status === 'closed' && (
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        setSelectedTask(task);
                        setNotificationMessage(`The case ${task.caseNumber} has been reopened. Please continue handling.`);
                        setAssignee('');
                        setToRecipients([]);
                        setCcRecipients([]);
                        setAssignedUsers([]);
                        setMessage(null);
                      }}
                    >
                      Reopen Case
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-muted">No cases found for this tab.</p>
        )}
      </div>

      {/* Modal */}
      {selectedTask && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Reopen Case: {selectedTask.caseNumber}</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedTask(null)}></button>
              </div>

              <div className="modal-body">
                {/* Assign To */}
                <div className="mb-3">
                  <label className="form-label">Assign To (Main & Spare)</label>
                  <Select
                    isMulti
                    placeholder="Search and assign users..."
                    options={users.map(email => ({ value: email, label: email }))}
                    value={assignedUsers.map(email => ({ value: email, label: email }))}
                    onChange={(selectedOptions) => {
                      const updated = selectedOptions ? selectedOptions.map(opt => opt.value) : [];
                      setAssignedUsers(updated);
                    }}
                    isClearable
                  />
                  <ul className="mt-3 list-unstyled">
                    {assignedUsers.map((email, index) => (
                      <li key={email} className="d-flex justify-content-between align-items-center border p-2 rounded mb-1">
                        <div>
                          <span className="fw-bold me-2">
                            #{index + 1} {index === 0 ? '(Main)' : `(Spare ${index})`}
                          </span>
                          {email}
                        </div>
                        <div className="btn-group">
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            disabled={index === 0}
                            onClick={() => {
                              const updated = [...assignedUsers];
                              [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
                              setAssignedUsers(updated);
                            }}
                          >
                            <i className="bi bi-arrow-up"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            disabled={index === assignedUsers.length - 1}
                            onClick={() => {
                              const updated = [...assignedUsers];
                              [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
                              setAssignedUsers(updated);
                            }}
                          >
                            <i className="bi bi-arrow-down"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => setAssignedUsers(assignedUsers.filter(e => e !== email))}
                          >
                            <i className="bi bi-x-circle"></i>
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CC Recipients */}
                <div className="mb-3">
                  <label className="form-label">CC Recipients</label>
                  <Select
                    isMulti
                    placeholder="Search and add CC recipient..."
                    options={users.map(email => ({ value: email, label: email }))}
                    value={ccRecipients.map(email => ({ value: email, label: email }))}
                    onChange={(selectedOptions) => {
                      const updated = selectedOptions ? selectedOptions.map(opt => opt.value) : [];
                      setCcRecipients(updated);
                    }}
                    isClearable
                  />
                  <ul className="mt-3 list-unstyled">
                    {ccRecipients.map(email => (
                      <li key={email} className="d-flex justify-content-between align-items-center border p-2 rounded mb-1">
                        {email}
                        <i
                          className="bi bi-x-circle text-danger"
                          role="button"
                          title="Remove"
                          onClick={() => setCcRecipients(ccRecipients.filter(e => e !== email))}
                        ></i>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Message */}
                <div className="mb-3">
                  <label className="form-label">Notification Message</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={notificationMessage}
                    onChange={(e) => setNotificationMessage(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setSelectedTask(null)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleReopen}>Reopen & Notify</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, variant, icon = 'bi-graph-up' }) {
  return (
    <div className="col-md-4">
      <div className={`card border-start border-4 border-${variant} shadow-sm h-100`}>
        <div className="card-body d-flex justify-content-between align-items-center">
          <div>
            <p className="text-muted mb-1">{label}</p>
            <h4 className={`text-${variant} fw-bold mb-0`}>{value}</h4>
          </div>
          <i className={`bi ${icon} fs-1 text-${variant}`}></i>
        </div>
      </div>
    </div>
  );
}

function TabButton({ label, tab, activeTab, setActiveTab }) {
  return (
    <li className="nav-item">
      <button
        className={`nav-link ${activeTab === tab ? 'active' : ''}`}
        style={{ borderRadius: '20px' }}
        onClick={() => setActiveTab(tab)}
      >
        {label}
      </button>
    </li>
  );
}
