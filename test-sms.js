import fetch from 'node-fetch';

async function testTwilio() {
  console.log('Registering test user...');
  let res = await fetch('http://localhost:3001/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Test Twilio User',
      email: 'twilio@example.com',
      password: 'password123',
      phone: '+15872257342', // User's phone
      role: 'client'
    })
  });
  
  if (!res.ok) {
    const err = await res.json();
    if (err.error === 'Email already in use') {
      console.log('User already registered. Proceeding...');
    } else {
      console.error('Registration failed:', err);
      return;
    }
  } else {
    console.log('User registered.');
  }
  
  // Wait, wait... the register flow doesn't set phone? It might.
  // Actually, wait, let's login first to get the token, then update phone via /api/auth/profile, or just test /forgot-password since that triggers the SMS.
  // Wait, I need the phone number in the DB. Let's just update the DB directly!
  
  console.log('Updating DB directly...');
}

testTwilio();
