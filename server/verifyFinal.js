const bcrypt = require('bcryptjs');

async function verify() {
  const match = await bcrypt.compare(
    '!@#aaapos', 
    '$2b$12$K4nDYi8YB/NolSCG1cW0h.YyFCUsb/8.BCT1KhMlL0wQb1eTS1vaC'
  );
  console.log('Password verification:', match ? '✅ SUCCESS' : '❌ FAILED');
}

verify();