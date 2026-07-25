import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { dbRun, dbGet, dbAll, initDb } from './db';
import { authMiddleware } from './authMiddleware';

const app = express();
app.use(cors());
app.use(express.json());

// Helper to convert SQLite DATETIME strings (e.g. '2026-07-25 09:17:54') to standard ISO 8601 UTC ('2026-07-25T09:17:54.000Z')
const formatToISO = (date: any) => {
  if (!date) return date;
  if (date instanceof Date) return date.toISOString();
  if (typeof date === 'string') {
    if (date.includes('T')) return date;
    return date.replace(' ', 'T') + '.000Z';
  }
  return date;
};

const mapTimestamps = (obj: any) => {
  if (!obj) return obj;
  const newObj = { ...obj };
  if (newObj.createdAt) newObj.createdAt = formatToISO(newObj.createdAt);
  if (newObj.updatedAt) newObj.updatedAt = formatToISO(newObj.updatedAt);
  return newObj;
};

const SECRET_KEY = process.env.JWT_SECRET || 'supersecretkey123';

// Init DB and seed admin
initDb().then(async () => {
  const admin: any = await dbGet('SELECT * FROM admins WHERE username = ?', ['admin']);
  if (!admin) {
    const hash = await bcrypt.hash('password123', 10);
    await dbRun('INSERT INTO admins (username, password) VALUES (?, ?) RETURNING id', ['admin', hash]);
    console.log('Default admin created: admin / password123');
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  const admin: any = await dbGet('SELECT * FROM admins WHERE username = ?', [username]);
  
  if (!admin || !(await bcrypt.compare(password, admin.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: admin.id, username: admin.username }, SECRET_KEY, { expiresIn: '1d' });
  res.json({ token });
});

app.post('/api/auth/logout', (req, res) => {
  // Clear any potential HttpOnly cookies if they were ever set by backend
  res.clearCookie('token');
  res.clearCookie('admin_token');
  res.json({ success: true });
});

app.post('/api/leads', async (req, res) => {
  const { name, email, budget, message } = req.body;
  
  if (!name || !email || !budget) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const result: any = await dbRun(
      'INSERT INTO leads (name, email, budget, message, status) VALUES (?, ?, ?, ?, ?) RETURNING id',
      [name, email, budget, message, 'new']
    );
    await dbRun(
      'INSERT INTO notifications (title, description, type, "leadId") VALUES (?, ?, ?, ?)',
      ['New Lead', `${name} submitted a new inquiry.`, 'lead_created', result.lastID]
    );
    res.status(201).json({ success: true, message: 'Lead created' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create lead' });
  }
});

app.get('/api/leads', authMiddleware, async (req, res) => {
  try {
    const leads = await dbAll('SELECT * FROM leads ORDER BY "createdAt" DESC');
    res.json({ success: true, data: leads.map(mapTimestamps) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
});

app.get('/api/leads/:id', authMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const lead = await dbGet('SELECT * FROM leads WHERE id = ?', [id]);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    res.json({ success: true, data: mapTimestamps(lead) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch lead details' });
  }
});

app.delete('/api/leads/:id', authMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const lead: any = await dbGet('SELECT name FROM leads WHERE id = ?', [id]);
    const result: any = await dbRun('DELETE FROM leads WHERE id = ?', [id]);
    if (result.changes === 0) return res.status(404).json({ error: 'Lead not found' });
    if (lead) {
      await dbRun(
        'INSERT INTO notifications (title, description, type, "leadId") VALUES (?, ?, ?, ?) RETURNING id',
        ['Lead Deleted', `${lead.name} was removed from the database.`, 'lead_deleted', null]
      );
    }
    res.json({ success: true, message: 'Lead deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete lead' });
  }
});

app.get('/api/dashboard/stats', authMiddleware, async (req, res) => {
  try {
    const leads: any[] = await dbAll('SELECT * FROM leads');
    const stats = {
      totalLeads: leads.length,
      newLeads: leads.filter(l => l.status === 'new').length,
      contactedLeads: leads.filter(l => l.status === 'contacted').length,
      closedLeads: leads.filter(l => l.status === 'closed').length,
      conversionRate: leads.length ? Math.round((leads.filter(l => l.status === 'closed').length / leads.length) * 100) : 0,
      avgBudget: leads.reduce((acc, l) => acc + l.budget, 0) / (leads.length || 1),
    };
    // Add artificial delay? No, user explicitly wants fast loading.
    res.json({ success: true, data: stats });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

app.get('/api/dashboard/recent-activity', authMiddleware, async (req, res) => {
  try {
    const leads: any[] = await dbAll('SELECT * FROM leads ORDER BY "createdAt" DESC LIMIT 5');
    const activities = leads.map(l => ({
      id: l.id,
      type: 'lead_created',
      leadName: l.name,
      description: 'submitted a new lead form',
      timestamp: l.createdAt
    }));
    res.json({ success: true, data: activities });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
});

app.patch('/api/leads/:id/status', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  if (!['new', 'contacted', 'closed'].includes(status.toLowerCase())) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  try {
    const leadId = parseInt(id as string, 10);
    const lead: any = await dbGet('SELECT name FROM leads WHERE id = ?', [leadId]);
    await dbRun('UPDATE leads SET status = ? WHERE id = ?', [status.toLowerCase(), leadId]);
    if (lead) {
      const statusTitle = status.charAt(0).toUpperCase() + status.slice(1);
      await dbRun(
        'INSERT INTO notifications (title, description, type, "leadId") VALUES (?, ?, ?, ?) RETURNING id',
        ['Lead Updated', `${lead.name}'s status changed to ${statusTitle}.`, 'status_changed', leadId]
      );
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update status' });
  }
});

app.get('/api/notifications', authMiddleware, async (req, res) => {
  try {
    const notifications = await dbAll('SELECT * FROM notifications ORDER BY "createdAt" DESC LIMIT 100');
    // Convert boolean 0/1 back to boolean for frontend and map timestamps
    const mapped = notifications.map((n: any) => mapTimestamps({
      ...n,
      read: !!n.read
    }));
    res.json({ success: true, data: mapped });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

app.patch('/api/notifications/read-all', authMiddleware, async (req, res) => {
  try {
    await dbRun('UPDATE notifications SET read = 1 WHERE read = 0');
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to mark all as read' });
  }
});

app.patch('/api/notifications/:id/read', authMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const { read } = req.body;
    await dbRun('UPDATE notifications SET read = ? WHERE id = ?', [read ? 1 : 0, id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update notification' });
  }
});

app.delete('/api/notifications/:id', authMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    await dbRun('DELETE FROM notifications WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete notification' });
  }
});

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Backend running on port ${PORT}`));
