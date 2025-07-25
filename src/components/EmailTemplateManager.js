import React, { useState, useEffect  } from 'react';

function EmailTemplateManager() {
  const [form, setForm] = useState({
    template_code: '',
    template_name: '',
    subject_template: '',
    body_template: '',
  });

  const [templates, setTemplates] = useState([]);

// โหลด EM Template จาก JSON
    useEffect(() => {
        fetch('/em_templates.json')
        .then((res) => res.json())
        .then((data) => {
            setTemplates(data);
        })
        .catch((err) => {
            console.error('โหลด EM Template ไม่สำเร็จ:', err);
        });
    }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.template_code || !form.template_name) {
      alert("กรุณากรอก Template Code และ Name");
      return;
    }

    setTemplates([...templates, form]);
    setForm({
      template_code: '',
      template_name: '',
      subject_template: '',
      body_template: '',
    });
  };

return (
    <div style={{ padding: '1rem' }}>
      <h2>📝 สร้าง Email Template</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Template Code</label><br />
          <input
            type="text"
            name="template_code"
            value={form.template_code}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Template Name</label><br />
          <input
            type="text"
            name="template_name"
            value={form.template_name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Subject Template</label><br />
          <input
            type="text"
            name="subject_template"
            value={form.subject_template}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Body Template</label><br />
          <textarea
            name="body_template"
            value={form.body_template}
            onChange={handleChange}
          />
        </div>
        <button type="submit">✅ บันทึก</button>
      </form>

      <hr />

      <h3>📋 รายการ Template ที่โหลดจาก JSON / สร้างเพิ่ม</h3>
      <ul>
        {templates.map((tpl, index) => (
          <li key={index}>
            <strong>{tpl.template_code}:</strong> {tpl.template_name}<br />
            <em>{tpl.subject_template}</em>
            <p>{tpl.body_template}</p>
            <hr />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EmailTemplateManager;
