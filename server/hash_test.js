const bcrypt = require('bcryptjs');

const passwords = ['admin123', 'examiner123', 'student123'];

async function run() {
  for (const pw of passwords) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(pw, salt);
    console.log(`${pw} -> ${hash}`);
    const verified = await bcrypt.compare(pw, hash);
    console.log(`Verified ${pw}: ${verified}`);
  }
}

run();
