// Twilio SMS Service for TomoTrip Guide Registration
// Referenced from: blueprint:twilio_send_message integration
const twilio = require('twilio');

class SMSService {
  constructor() {
    this.accountSid = process.env.TWILIO_ACCOUNT_SID;
    this.authToken = process.env.TWILIO_AUTH_TOKEN;
    this.phoneNumber = process.env.TWILIO_PHONE_NUMBER;
    
    if (!this.accountSid || !this.authToken || !this.phoneNumber) {
      console.warn('⚠️ Twilio credentials not found. SMS service will use simulation mode.');
      this.simulationMode = true;
    } else {
      this.client = twilio(this.accountSid, this.authToken);
      this.simulationMode = false;
      console.log('✅ Twilio SMS service initialized');
    }
    
    // In-memory verification code storage (for production, use Redis or database)
    this.verificationCodes = new Map();
  }

  // Generate 6-digit verification code
  generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Send verification code via SMS
  async sendVerificationCode(phoneNumber) {
    try {
      const code = this.generateVerificationCode();
      const message = `TomoTrip 認証コード: ${code}\n\nこのコードは5分間有効です。第三者には絶対に教えないでください。`;
      
      if (this.simulationMode) {
        console.log(`📱 SMS Simulation Mode - Code for ${phoneNumber}: ${code}`);
        
        // Store code with expiration (5 minutes)
        this.verificationCodes.set(phoneNumber, {
          code,
          expires: Date.now() + 5 * 60 * 1000,
          attempts: 0
        });
        
        return {
          success: true,
          sid: 'SIM' + Date.now(),
          code: code, // Only for simulation
          message: 'Simulation mode - code generated'
        };
      }

      // Real Twilio SMS sending
      const result = await this.client.messages.create({
        body: message,
        from: this.phoneNumber,
        to: phoneNumber
      });

      // Store code with expiration (5 minutes)
      this.verificationCodes.set(phoneNumber, {
        code,
        expires: Date.now() + 5 * 60 * 1000,
        attempts: 0
      });

      console.log(`✅ SMS sent to ${phoneNumber}, SID: ${result.sid}`);
      
      return {
        success: true,
        sid: result.sid,
        message: 'Verification code sent successfully'
      };

    } catch (error) {
      console.error('❌ SMS sending failed:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to send verification code'
      };
    }
  }

  // Verify submitted code
  verifyCode(phoneNumber, submittedCode) {
    const stored = this.verificationCodes.get(phoneNumber);
    
    if (!stored) {
      return {
        success: false,
        error: 'NO_CODE_FOUND',
        message: '認証コードが見つかりません。再度送信してください。'
      };
    }

    // Check expiration
    if (Date.now() > stored.expires) {
      this.verificationCodes.delete(phoneNumber);
      return {
        success: false,
        error: 'CODE_EXPIRED',
        message: '認証コードの有効期限が切れました。新しいコードを送信してください。'
      };
    }

    // Check attempts limit
    if (stored.attempts >= 3) {
      this.verificationCodes.delete(phoneNumber);
      return {
        success: false,
        error: 'TOO_MANY_ATTEMPTS',
        message: '試行回数が上限に達しました。新しいコードを送信してください。'
      };
    }

    // Increment attempts
    stored.attempts += 1;

    // Verify code
    if (stored.code === submittedCode) {
      this.verificationCodes.delete(phoneNumber);
      console.log(`✅ Phone verification successful for ${phoneNumber}`);
      return {
        success: true,
        message: '電話認証が完了しました！'
      };
    } else {
      return {
        success: false,
        error: 'INVALID_CODE',
        message: `認証コードが正しくありません。残り試行回数: ${3 - stored.attempts}`
      };
    }
  }

  // Clean up expired codes (call periodically)
  cleanupExpiredCodes() {
    const now = Date.now();
    for (const [phoneNumber, data] of this.verificationCodes.entries()) {
      if (now > data.expires) {
        this.verificationCodes.delete(phoneNumber);
      }
    }
  }

  // Get verification status
  getVerificationStatus(phoneNumber) {
    const stored = this.verificationCodes.get(phoneNumber);
    if (!stored) {
      return { exists: false };
    }

    return {
      exists: true,
      isExpired: Date.now() > stored.expires,
      remainingAttempts: 3 - stored.attempts,
      expiresAt: new Date(stored.expires).toISOString()
    };
  }
}

// Create singleton instance
const smsService = new SMSService();

// Cleanup expired codes every 10 minutes
setInterval(() => {
  smsService.cleanupExpiredCodes();
}, 10 * 60 * 1000);

module.exports = { SMSService, smsService };