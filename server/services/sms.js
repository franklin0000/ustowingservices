import twilio from 'twilio';

let client;

// Initialize Twilio client using Account SID + Auth Token
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  console.log('[SMS] Twilio Verify API initialized');
} else {
  console.warn('[SMS] Twilio credentials missing. SMS verification will fall back to local mock.');
}

export const sendVerificationSMS = async (phone) => {
  try {
    if (client && process.env.TWILIO_VERIFY_SERVICE_SID) {
      // Use official Twilio Verify API
      const verification = await client.verify.v2
        .services(process.env.TWILIO_VERIFY_SERVICE_SID)
        .verifications.create({ to: phone, channel: 'sms' });
      
      console.log(`[SMS] Verification sent to ${phone}. Status: ${verification.status}`);
      return true;
    } else {
      // Local Development Fallback
      console.log('\n📱 ========================================================');
      console.log('💬 [MOCK SMS] TEXT MESSAGE INTERCEPTED (Local Development)');
      console.log(`To: ${phone}`);
      console.log(`Message: Your US Towing Services verification code is: 123456`);
      console.log('======================================================== 📱\n');
      return true;
    }
  } catch (error) {
    console.error('[SMS] Error sending verification SMS:', error);
    return false;
  }
};

export const checkVerificationSMS = async (phone, code) => {
  try {
    if (client && process.env.TWILIO_VERIFY_SERVICE_SID) {
      
      let formattedPhone = phone.replace(/\D/g, '');
      if (formattedPhone.length === 10) {
        formattedPhone = '+1' + formattedPhone;
      } else if (!formattedPhone.startsWith('+')) {
        formattedPhone = '+' + formattedPhone;
      }

      // Use official Twilio Verify API
      const verificationCheck = await client.verify.v2
        .services(process.env.TWILIO_VERIFY_SERVICE_SID)
        .verificationChecks.create({ to: formattedPhone, code: code });
        
      console.log(`[SMS] Verification check for ${formattedPhone}. Status: ${verificationCheck.status}`);
      return verificationCheck.status === 'approved';
    } else {
      // Local Development Fallback
      return code === '123456';
    }
  } catch (error) {
    console.error('[SMS] Error checking verification SMS:', error);
    return false;
  }
};
