const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    },
  },
});

const app = express();

app.use(cors({
  origin: ['https://beebox-washing.vercel.app', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

app.use(express.json());

// Test database connection
prisma.$connect()
  .then(() => {
    console.log('Database connected successfully');
  })
  .catch((error) => {
    console.error('Database connection error:', error);
  });

// Routes
app.get('/machines', async (req, res) => {
  try {
    const machines = await prisma.machines.findMany();
    console.log('Machines:', machines);
    res.json(machines);
  } catch (error) {
    console.error('Error fetching machines:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

// Start machine
app.post('/machines/:id/start', async (req, res) => {
  try {
    const { id } = req.params;
    
    // อัพเดทสถานะเครื่อง
    const machine = await prisma.machines.update({
      where: { id: parseInt(id) },
      data: { 
        status: true,
      }
    });

    // สร้างประวัติการใช้งาน
    await prisma.usageHistory.create({
      data: {
        machineId: parseInt(id),
        start_time: new Date(),
        status: 'running'
      }
    });

    res.json(machine);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Stop machine
app.post('/machines/:id/stop', async (req, res) => {
  try {
    const { id } = req.params;
    
    // อัพเดทสถานะเครื่อง
    const machine = await prisma.machines.update({
      where: { id: parseInt(id) },
      data: { 
        status: false,
      }
    });

    // อัพเดทประวัติการใช้งาน
    await prisma.usageHistory.updateMany({
      where: { 
        machineId: parseInt(id),
        end_time: null
      },
      data: {
        end_time: new Date(),
        status: 'completed'
      }
    });

    res.json(machine);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit();
});