import React, { useState, useEffect } from 'react';

function NotificationMasterManager() {
  const [mappings, setMappings] = useState([]);
  const [form, setForm] = useState({
    status_code: '',
    event_code: '',
    channel: 'EMAIL',
    to_role: '',
    cc_role: '',
    trigger: 'on_status_change'
  });

  const [processStatusList, setProcessStatusList] = useState([]);
  const [templateList, setTemplateList] = useState([]);

  // โหลด EM Template
  useEffect(() => {
    fetch('/public/em_templates.json')
      .then((res) => res.json())
      .then((data) => setTemplateList(data));
  }, []);

  // Mocked status (กรณีไม่มี backend)
  useEffect(() => {
    const mockStatuses = [
      { code: 'REQ_SUBMITTED', name: 'สร้างคำขอใหม่' },
      { code: 'APPROVED_BY_SBU', name: 'อนุมัติโดย SBU' },
      { code: 'LEGAL_ASSIGNED', name: 'มอบหมายให้ทนาย' },
    ];
    setProcessStatusList(mockStatuses);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMappings([...mappings, form]);
    setForm({
      status_code: '',
      event_code: '',
      channel: 'EMAIL',
      to_role: '',
      cc_role: '',
      trigger: 'on_status_change'
    });
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>⚙️ จัดการ Notification Mapping</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
        <label>📌 Process Status</label><br />
        <select name="status_code" value={form.status_code} onChange={handleChange} required>
          <option value="">-- เลือกสถานะ --</option>
          {processStatusList.map((s, idx) => (
            <option key={idx} value={s.code}>{s.code} - {s.name}</option>
          ))}
        </select><br /><br />

        <label>📧 EM Template</label><br />
        <select name="event_code" value={form.event_code} onChange={handleChange} required>
          <option value="">-- เลือก EM Code --</option>
          {templateList.map((tpl, idx) => (
            <option key={idx} value={tpl.template_code}>
              {tpl.template_code} - {tpl.template_name}
            </option>
          ))}
        </select><br /><br />

        <label>🔔 Channel</label><br />
        <select name="channel" value={form.channel} onChange={handleChange}>
          <option value="EMAIL">Email</option>
          <option value="INAPP">In-System Notification</option>
        </select><br /><br />

        <label>👤 ส่งถึง (To Role)</label><br />
        <input type="text" name="to_role" value={form.to_role} onChange={handleChange} /><br /><br />

        <label>📎 สำเนาถึง (CC Role)</label><br />
        <input type="text" name="cc_role" value={form.cc_role} onChange={handleChange} /><br /><br />

        <button type="submit">➕ เพิ่ม Mapping</button>
      </form>

      <hr />
      <h3>📋 รายการ Mapping</h3>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Status</th>
            <th>Template</th>
            <th>Channel</th>
            <th>To</th>
            <th>CC</th>
            <th>Trigger</th>
          </tr>
        </thead>
        <tbody>
          {mappings.map((m, idx) => (
            <tr key={idx}>
              <td>{m.status_code}</td>
              <td>{m.event_code}</td>
              <td>{m.channel}</td>
              <td>{m.to_role}</td>
              <td>{m.cc_role}</td>
              <td>{m.trigger}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default NotificationMasterManager;
