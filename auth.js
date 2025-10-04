const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

const SECRET_KEY = 'your-secret-key'; // عوض کن در تولید
let users = []; // نمونه – بعداً دیتابیس

// داده‌های نمونه: فقط author (تو!)
const hashedAuthorPass = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'; // هش 'author123' – می‌تونی تغییر بدی
users = [
  { id: 1, email: 'author@archirahnam.ir', password: hashedAuthorPass, name: 'نام تو (نویسنده)', role: 'author' }
];

// POST /auth/register (همیشه author)
router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;
  const role = 'author'; // همیشه author
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = { id: Date.now(), email, password: hashedPassword, name, role };
  users.push(user);
  res.json({ message: 'ثبت‌نام موفق', user: { id: user.id, email, name, role } });
});

// POST /auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user || !await bcrypt.compare(password, user.password)) {
    return res.status(401).json({ message: 'ایمیل یا رمز عبور اشتباه' });
  }
  const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
});

module.exports = router;