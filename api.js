const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const auth = require('../middleware/auth'); // import
const { requireAuthor } = auth; // فقط requireAuthor

const loadData = (file) => {
  try {
    return JSON.parse(fs.readFileSync(path.join(__dirname, '../data', file)));
  } catch (err) {
    return [];
  }
};

// GET /api/articles - عمومی
router.get('/articles', (req, res) => {
  const articles = loadData('articles.json');
  res.json(articles);
});

// POST /api/articles - فقط author
router.post('/articles', auth, requireAuthor, (req, res) => {
  const articles = loadData('articles.json');
  const newArticle = { id: Date.now(), ...req.body };
  articles.push(newArticle);
  fs.writeFileSync(path.join(__dirname, '../data/articles.json'), JSON.stringify(articles, null, 2));
  res.json(newArticle);
});

// مشابه برای tutorials و projects
router.get('/tutorials', (req, res) => {
  const tutorials = loadData('tutorials.json');
  res.json(tutorials);
});

router.post('/tutorials', auth, requireAuthor, (req, res) => {
  const tutorials = loadData('tutorials.json');
  const newTutorial = { id: Date.now(), ...req.body };
  tutorials.push(newTutorial);
  fs.writeFileSync(path.join(__dirname, '../data/tutorials.json'), JSON.stringify(tutorials, null, 2));
  res.json(newTutorial);
});

router.get('/projects', (req, res) => {
  const projects = loadData('projects.json');
  res.json(projects);
});

router.post('/projects', auth, requireAuthor, (req, res) => {
  const projects = loadData('projects.json');
  const newProject = { id: Date.now(), ...req.body };
  projects.push(newProject);
  fs.writeFileSync(path.join(__dirname, '../data/projects.json'), JSON.stringify(projects, null, 2));
  res.json(newProject);
});

// GET /api/users - فقط author (برای مدیریت خودت)
router.get('/users', auth, requireAuthor, (req, res) => {
  const usersData = require('../routes/auth').users; // از auth import
  res.json(usersData.map(u => ({ id: u.id, email: u.email, name: u.name, role: u.role })));
});
// GET /api/stats - آمار داشبورد
router.get('/stats', (req, res) => {
  const articles = loadData('articles.json').length;
  const tutorials = loadData('tutorials.json').length;
  const projects = loadData('projects.json').length;
  const visits = 1500; // فرضی – بعداً می‌تونی از دیتابیس بگیری
  res.json({ articles, tutorials, projects, visits });
});

// GET /api/settings - تنظیمات سایت
// POST /api/settings - بروزرسانی تنظیمات
const settingsFile = 'settings.json';
let settings = { siteTitle: 'آرچی‌رهنما', contactEmail: 'info@archirahnam.ir', logoUrl: '/images/logo.png' };
if (fs.existsSync(path.join(__dirname, '../data', settingsFile))) {
  settings = JSON.parse(fs.readFileSync(path.join(__dirname, '../data', settingsFile)));
}

router.get('/settings', (req, res) => {
  res.json(settings);
});

router.post('/settings', (req, res) => {
  const newSettings = { ...settings, ...req.body };
  fs.writeFileSync(path.join(__dirname, '../data', settingsFile), JSON.stringify(newSettings, null, 2));
  res.json(newSettings);
});
module.exports = router;