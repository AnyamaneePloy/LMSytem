import React, { useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import EmailTemplateManager from './components/EmailTemplateManager';
import NotificationMasterManager from './components/NotificationMasterManager';
import CalendarSchedule from './components/CalendarSchedule';
import AdminReopenCase from './pages/AdminReopenCase';

function App() {
  const [activeTab, setActiveTab] = useState('email');

  const renderTab = () => {
    switch (activeTab) {
      case 'email':
        return <EmailTemplateManager />;
      case 'master':
        return <NotificationMasterManager />;
      case 'calendar':
        return <CalendarSchedule />;
      case 'reopen':
        return <AdminReopenCase />;
      default:
        return <div>❓ Unknown tab selected</div>;
    }
  };

  return (
    <div className="App">
      <header className="tab-header">
        <button className={activeTab === 'email' ? 'active' : ''} onClick={() => setActiveTab('email')}>📨 Email Template</button>
        <button className={activeTab === 'master' ? 'active' : ''} onClick={() => setActiveTab('master')}>🗂️ Master Notification</button>
        <button className={activeTab === 'calendar' ? 'active' : ''} onClick={() => setActiveTab('calendar')}>📅 Calendar & Notification</button>
        <button className={activeTab === 'reopen' ? 'active' : ''} onClick={() => setActiveTab('reopen')}>🧑‍⚖️ Admin</button>
      </header>
      <div className="tab-content">
        {renderTab()}
      </div>
    </div>

  );
}

export default App;
