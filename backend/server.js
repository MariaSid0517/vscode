// backend/server.js
const express = require('express');
const cors = require('cors');
const { z } = require('zod');

const app = express();
app.use(cors());
app.use(express.json());

// ---- simple request logger (helpful during manual testing)
app.use((req, _res, next) => {
  console.log(`[API] ${req.method} ${req.url}`);
  next();
});

// In-memory stores
const users = [];
const profiles = new Map();
const events = [];
const notifications = [];
const history = new Map();

// Schemas
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(100),
});

const profileSchema = z.object({
  name: z.string().min(1),
  address1: z.string().min(1),
  address2: z.string().optional().default(''),
  city: z.string().min(1),
  state: z.string().length(2),
  zip: z.string().min(5).max(10),
  preferences: z.string().optional().default(''),
  skills: z.array(z.string()).default([]),
  availability: z.string().optional(),
});

const eventSchema = z.object({
  title: z.string().min(1),
  location: z.string().min(1),
  requiredSkills: z.array(z.string()).default([]),
  urgency: z.enum(['low','medium','high']),
  details: z.string().optional().default(''),
});

// Auth
app.post('/auth/register', (req,res)=>{
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ errors: parsed.error.issues });
  const { email, password } = parsed.data;
  if (users.find(u=>u.email===email)) return res.status(409).json({ message:'Exists' });
  const user = { id: String(users.length+1), email, password };
  users.push(user);
  res.json({ userId: user.id, token: `fake-${user.id}` });
});

app.post('/auth/login', (req,res)=>{
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ errors: parsed.error.issues });
  const user = users.find(u=>u.email===parsed.data.email && u.password===parsed.data.password);
  if (!user) return res.status(401).json({ message:'Invalid credentials' });
  res.json({ userId: user.id, token: `fake-${user.id}` });
});

// Profiles
app.get('/profiles/:userId', (req,res)=> res.json(profiles.get(req.params.userId) || null));
app.put('/profiles/:userId', (req,res)=>{
  const parsed = profileSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ errors: parsed.error.issues });
  profiles.set(req.params.userId, parsed.data);
  res.json(parsed.data);
});

// Events
app.post('/events', (req,res)=>{
  const parsed = eventSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ errors: parsed.error.issues });
  const evt = { id: String(events.length+1), ...parsed.data };
  events.push(evt);
  res.json(evt);
});
app.get('/events', (_req,res)=> res.json(events));

// Matching
app.post('/match', (req,res)=>{
  const { eventId } = req.body;
  const evt = events.find(e=>e.id===String(eventId));
  if (!evt) return res.status(404).json({ message:'Event not found' });
  const matches = [];
  for (const [userId, profile] of profiles.entries()) {
    const overlap = (profile.skills||[]).filter(s=>evt.requiredSkills.includes(s));
    if (overlap.length) matches.push({ userId, score: overlap.length, overlap });
  }
  matches.sort((a,b)=>b.score-a.score);
  res.json({ event: evt, matches });
});

// Notifications (simulate)
app.post('/notifications', (req,res)=>{
  const { userId, message, eventId } = req.body;
  if (!userId || !message) return res.status(400).json({ message:'userId & message required' });
  const note = { id:String(notifications.length+1), userId, message, eventId: eventId??null, sentAt:new Date().toISOString() };
  notifications.push(note);
  res.json(note);
});

// History
app.get('/history/:userId', (req,res)=> res.json(history.get(req.params.userId) || []));
app.post('/history/:userId', (req,res)=>{
  const entries = history.get(req.params.userId) || [];
  const { eventId } = req.body;
  entries.push({ eventId:String(eventId), date:new Date().toISOString() });
  history.set(req.params.userId, entries);
  res.json(entries);
});

const port = process.env.PORT || 3001;
if (require.main === module) app.listen(port, ()=>console.log(`API on :${port}`));
module.exports = app;
