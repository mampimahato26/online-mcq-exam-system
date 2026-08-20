const db = require('./config/db');

async function check() {
  try {
    const [users] = await db.execute('SELECT id, name, email, password, role FROM users');
    console.log('--- Current Users in Database ---');
    console.log(JSON.stringify(users, null, 2));
    process.exit(0);
  } catch (err) {
    console.error('Error querying users:', err);
    process.exit(1);
  }
}

check();
