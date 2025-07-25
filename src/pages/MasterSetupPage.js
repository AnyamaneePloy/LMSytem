import React, { useState } from 'react';
import EmailTemplateManager from '../components/EmailTemplateManager';
import NotificationMasterManager from '../components/NotificationMasterManager';
import CalendarSchedule from '../components/CalendarSchedule';

function MasterSetupPage() {
  const [activeTab, setActiveTab] = useState('email');

  const tabStyle = {
    padding: '0.5rem 1rem',
    marginRight: '0.5rem',
    cursor: 'pointer',
    border: '1px solid #ccc',
    borderBottom: 'none',
    backgroundColor: '#f1f1f1',
  };

  const activeTabStyle = {
    ...tabStyle,
    backgroundColor: '#fff',
    fontWeight: 'bold',
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h1>🔧 Master Notification Setup</h1>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #ccc', marginBottom: '1rem' }}>
        <div
          style={activeTab === 'email' ? activeTabStyle : tabStyle}
          onClick={() => setActiveTab('email')}
        >
          📧 Email Templates
        </div>
        <div
          style={activeTab === 'master' ? activeTabStyle : tabStyle}
          onClick={() => setActiveTab('master')}
        >
          ⚙️ Notification Mapping
        </div>
        <div
          style={activeTab === 'calendar' ? activeTabStyle : tabStyle}
          onClick={() => setActiveTab('calendar')}
        >
          🗓️ Calendar Schedule
        </div>
      </div>

      {/* Tab Content */}
      <div style={{ border: '1px solid #ccc', padding: '1rem' }}>
        {activeTab === 'email' && <EmailTemplateManager />}
        {activeTab === 'master' && <NotificationMasterManager />}
        {activeTab === 'calendar' && <CalendarSchedule />}
      </div>
    </div>
  );
}

export default MasterSetupPage;
