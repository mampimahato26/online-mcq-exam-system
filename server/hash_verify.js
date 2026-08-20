const bcrypt = require('bcryptjs');

const db_hashes = [
  { role: 'admin', hash: '$2b$10$wKz0b9lDqVnO5D1lqK12I.p3PZgD5qZgB8o5c1Hw3.D2kR9uW3Oxe', pw: 'admin123' },
  { role: 'examiner', hash: '$2b$10$uA3fG.c7iX7/3Fz6oU3jCeW8f2H3Gj1M7.Tj/PZl4pC2W7L3eWzN6', pw: 'examiner123' },
  { role: 'student', hash: '$2b$10$8VbTqN7u1dK3o5C8kH9jGeT7Rz6e1M5Xj/F6pW3kG3d2D7L8eT2W6', pw: 'student123' }
];

async function check() {
  for (const item of db_hashes) {
    try {
      const match = await bcrypt.compare(item.pw, item.hash);
      console.log(`${item.role}: password="${item.pw}" hash="${item.hash}" match=${match}`);
    } catch (err) {
      console.error(`Error comparing for ${item.role}:`, err.message);
    }
  }
}

check();
