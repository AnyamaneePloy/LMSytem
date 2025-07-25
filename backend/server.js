const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = 4000;
const DB_PATH = './db_reopen.json';

app.use(cors());
app.use(express.json());

function loadDB() {
  if (!fs.existsSync(DB_PATH)) {
    const initData = { tasks: [] };
    saveDB(initData);
    return initData;
  }
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}

function saveDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// GET /tasks
app.get('/tasks', (req, res) => {
  try {
    const db = loadDB();
    res.json(db.tasks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load tasks' });
  }
});

// GET /tasks/closed
app.get('/tasks/closed', (req, res) => {
  const db = loadDB();
  const closed = db.tasks.filter(t => t.status === 'closed');
  res.json(closed); // ✅ should return an array
});



// POST /tasks/:id/reopen
app.post('/tasks/:id/reopen', (req, res) => {
  const { id } = req.params;
  const { reopenReason, comment, assignedTo } = req.body;

  const db = loadDB();
  const index = db.tasks.findIndex(t => t.caseId === Number(id)); // NOT t.id

  if (index === -1) {
    return res.status(404).json({ error: 'Case not found' });
  }

  db.tasks[index].status = 'reopen';
  db.tasks[index].reopenReason = reopenReason;
  db.tasks[index].comment = comment;
  db.tasks[index].assignedTo = assignedTo;
  db.tasks[index].reopenedAt = new Date().toISOString();

  saveDB(db);
  res.json({ success: true });
});


app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
