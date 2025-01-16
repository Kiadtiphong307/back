const express = require('express');
const cors = require('cors');
const prisma = require('./database/db');
const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));

app.use(express.json());

// Routes
app.get('/machines', async (req, res) => {
  try {
    const machines = await prisma.machine.findMany();
    res.json(machines);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT update machine status
app.put('/machines/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  try {
    const machine = await prisma.machine.update({
      where: { id: parseInt(id) },
      data: { status }
    });
    res.json(machine);
  } catch (error) {
    console.error('Error updating machine:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST start machine
app.post('/machines/:id/start', async (req, res) => {
  const { id } = req.params;
  
  try {
    // เริ่มการทำงานของเครื่อง
    await pool.query(
      'UPDATE machines SET status = TRUE WHERE id = ? AND status = FALSE',
      [id]
    );
    
    // บันทึกประวัติการใช้งาน
    await pool.query(
      'INSERT INTO usage_history (machine_id, start_time) VALUES (?, NOW())',
      [id]
    );
    
    const [machine] = await pool.query(
      'SELECT * FROM machines WHERE id = ?',
      [id]
    );
    
    res.json(machine[0]);
  } catch (error) {
    console.error('Error starting machine:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST complete machine cycle
app.post('/machines/:id/complete', async (req, res) => {
  const { id } = req.params;
  
  try {
    // อัพเดทสถานะเครื่อง
    await pool.query(
      'UPDATE machines SET status = FALSE, time = 10 WHERE id = ?',
      [id]
    );
    
    // อัพเดทประวัติการใช้งาน
    await pool.query(
      `UPDATE usage_history 
       SET end_time = NOW(), status = 'completed'
       WHERE machine_id = ? AND end_time IS NULL`,
      [id]
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error completing machine cycle:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET machines names and IDs
app.get('/machines/list', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name FROM machines');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching machines list:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET specific machine by ID
app.get('/machines/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name FROM machines WHERE id = ?', [req.params.id]);
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ error: 'Machine not found' });
    }
  } catch (error) {
    console.error('Error fetching machine:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});