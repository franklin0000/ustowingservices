import { sendVerificationSMS } from './server/services/sms.js';

async function test() {
  console.log('Sending test SMS via Twilio to +15872257342...');
  const success = await sendVerificationSMS('+15872257342');
  console.log('Twilio response success:', success);
  process.exit(0);
}

test();
