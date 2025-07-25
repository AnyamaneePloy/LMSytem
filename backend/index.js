const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 4000;
const DATA_FILE = path.join(__dirname, 'appointments.json');

app.use(cors());
app.use(bodyParser.json());

// 🟡 อ่านข้อมูลจาก appointments.json
function readAppointments() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('อ่านไฟล์ appointments.json ไม่สำเร็จ:', err);
    return [];
  }
}

// 🟡 เขียนข้อมูลใหม่ลงไฟล์
function writeAppointments(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('บันทึกไฟล์ appointments.json ไม่สำเร็จ:', err);
  }
}

// 📥 GET ทั้งหมด
app.get('/appointments', (req, res) => {
  const appointments = readAppointments();
  res.json(appointments);
});

// 📤 POST เพิ่มใหม่
app.post('/appointments', (req, res) => {
  const { title, start, end, color, extendedProps } = req.body;
  if (!title || !start) {
    return res.status(400).json({ error: 'title and start are required' });
  }

  const appointments = readAppointments();

  const newEvent = {
    title,
    start,
    end: end || null,
    color: color || '#2563eb',
    extendedProps: extendedProps || {}
  };

  appointments.push(newEvent);
  writeAppointments(appointments);

  res.status(201).json(newEvent);
});

app.listen(PORT, () => {
  console.log(`📅 Legal Calendar API (with JSON) running on http://localhost:${PORT}`);
});
