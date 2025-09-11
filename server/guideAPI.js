// Guide Registration API for TomoTrip
// Integrates SMS verification, file upload, and database storage
const { smsService } = require('./smsService');
const { ObjectStorageService } = require('./objectStorage');
const { adminAuthService } = require('./adminAuth');
const multer = require('multer');
const { randomUUID } = require('crypto');

// Multer configuration for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 5 // Max 5 files per request
  },
  fileFilter: (req, file, cb) => {
    // Allow images only
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('画像ファイルのみアップロード可能です'), false);
    }
  }
});

class GuideAPIService {
  constructor() {
    this.objectStorage = new ObjectStorageService();
    this.guides = new Map(); // In-memory storage (use database in production)
    this.pendingRegistrations = new Map(); // Temporary storage for incomplete registrations
  }

  // Initialize API routes
  setupRoutes(app) {
    // SMS verification endpoints
    app.post('/api/guides/send-verification', this.sendPhoneVerification.bind(this));
    app.post('/api/guides/verify-phone', this.verifyPhone.bind(this));
    
    // File upload endpoints
    app.post('/api/guides/upload-document', upload.array('documents', 3), this.uploadDocuments.bind(this));
    app.post('/api/guides/upload-profile-photo', upload.single('profilePhoto'), this.uploadProfilePhoto.bind(this));
    
    // Guide registration endpoints
    app.post('/api/guides/register', this.registerGuide.bind(this));
    app.get('/api/guides', this.getGuides.bind(this));
    
    // Guide editing endpoints
    app.get('/api/guides/:id', this.getGuideById.bind(this));
    app.put('/api/guides/:id/edit', this.updateGuide.bind(this));
    
    // Admin endpoints
    app.get('/api/admin/guides', adminAuthService.requireAuth('support'), this.getGuidesAdmin.bind(this));
    app.put('/api/admin/guides/:id/approve', adminAuthService.requireAuth('operator'), this.approveGuide.bind(this));
    app.put('/api/admin/guides/:id/reject', adminAuthService.requireAuth('operator'), this.rejectGuide.bind(this));
    
    console.log('✅ Guide API routes initialized');
  }

  // Send SMS verification code
  async sendPhoneVerification(req, res) {
    try {
      const { phoneNumber } = req.body;
      
      if (!phoneNumber) {
        return res.status(400).json({
          success: false,
          error: 'MISSING_PHONE',
          message: '電話番号が必要です'
        });
      }

      // Validate phone number format (basic validation)
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(phoneNumber.replace(/[-\s]/g, ''))) {
        return res.status(400).json({
          success: false,
          error: 'INVALID_PHONE',
          message: '有効な電話番号を入力してください'
        });
      }

      const result = await smsService.sendVerificationCode(phoneNumber);
      
      if (result.success) {
        res.json({
          success: true,
          message: result.message,
          sid: result.sid,
          ...(result.code && { simulationCode: result.code }) // Only in simulation mode
        });
      } else {
        res.status(500).json({
          success: false,
          error: result.error,
          message: result.message
        });
      }
    } catch (error) {
      console.error('❌ Phone verification error:', error);
      res.status(500).json({
        success: false,
        error: 'INTERNAL_ERROR',
        message: 'SMS送信中にエラーが発生しました'
      });
    }
  }

  // Verify submitted phone code
  async verifyPhone(req, res) {
    try {
      const { phoneNumber, code } = req.body;
      
      if (!phoneNumber || !code) {
        return res.status(400).json({
          success: false,
          error: 'MISSING_DATA',
          message: '電話番号と認証コードが必要です'
        });
      }

      const result = smsService.verifyCode(phoneNumber, code);
      
      if (result.success) {
        // Create or update pending registration
        const sessionId = randomUUID();
        this.pendingRegistrations.set(sessionId, {
          phoneNumber,
          phoneVerified: true,
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 minutes
        });

        res.json({
          success: true,
          message: result.message,
          sessionId
        });
      } else {
        res.status(400).json({
          success: false,
          error: result.error,
          message: result.message
        });
      }
    } catch (error) {
      console.error('❌ Phone code verification error:', error);
      res.status(500).json({
        success: false,
        error: 'INTERNAL_ERROR',
        message: '認証コード確認中にエラーが発生しました'
      });
    }
  }

  // Upload document images (ID, license, etc.)
  async uploadDocuments(req, res) {
    try {
      const { sessionId, documentType } = req.body;
      
      if (!sessionId) {
        return res.status(400).json({
          success: false,
          error: 'MISSING_SESSION',
          message: 'セッションIDが必要です'
        });
      }

      const session = this.pendingRegistrations.get(sessionId);
      if (!session) {
        return res.status(400).json({
          success: false,
          error: 'INVALID_SESSION',
          message: '無効なセッションです'
        });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'NO_FILES',
          message: 'ファイルがアップロードされていません'
        });
      }

      const uploadedFiles = [];
      
      for (const file of req.files) {
        const uploadUrl = await this.objectStorage.getObjectEntityUploadURL();
        
        // In a real implementation, you would upload the file to the signed URL
        // For now, we'll simulate the upload
        const fileId = randomUUID();
        const fileName = `${documentType}_${fileId}_${file.originalname}`;
        
        uploadedFiles.push({
          fileId,
          fileName,
          originalName: file.originalname,
          mimeType: file.mimetype,
          size: file.size,
          uploadUrl // Frontend will use this to upload the file
        });
      }

      // Update session with document info
      session.documents = session.documents || [];
      session.documents.push(...uploadedFiles);
      this.pendingRegistrations.set(sessionId, session);

      res.json({
        success: true,
        message: 'ドキュメントのアップロード準備が完了しました',
        files: uploadedFiles
      });

    } catch (error) {
      console.error('❌ Document upload error:', error);
      res.status(500).json({
        success: false,
        error: 'UPLOAD_ERROR',
        message: 'ファイルアップロード中にエラーが発生しました'
      });
    }
  }

  // Upload profile photo
  async uploadProfilePhoto(req, res) {
    try {
      const { sessionId } = req.body;
      
      if (!sessionId) {
        return res.status(400).json({
          success: false,
          error: 'MISSING_SESSION',
          message: 'セッションIDが必要です'
        });
      }

      const session = this.pendingRegistrations.get(sessionId);
      if (!session) {
        return res.status(400).json({
          success: false,
          error: 'INVALID_SESSION',
          message: '無効なセッションです'
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'NO_FILE',
          message: 'プロフィール写真がアップロードされていません'
        });
      }

      const uploadUrl = await this.objectStorage.getObjectEntityUploadURL();
      const fileId = randomUUID();
      const fileName = `profile_${fileId}_${req.file.originalname}`;

      // Update session with profile photo info
      session.profilePhoto = {
        fileId,
        fileName,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        uploadUrl
      };
      this.pendingRegistrations.set(sessionId, session);

      res.json({
        success: true,
        message: 'プロフィール写真のアップロード準備が完了しました',
        file: session.profilePhoto
      });

    } catch (error) {
      console.error('❌ Profile photo upload error:', error);
      res.status(500).json({
        success: false,
        error: 'UPLOAD_ERROR',
        message: 'プロフィール写真アップロード中にエラーが発生しました'
      });
    }
  }

  // Complete guide registration
  async registerGuide(req, res) {
    try {
      const { sessionId, guideData } = req.body;
      
      if (!sessionId) {
        return res.status(400).json({
          success: false,
          error: 'MISSING_SESSION',
          message: 'セッションIDが必要です'
        });
      }

      const session = this.pendingRegistrations.get(sessionId);
      if (!session || !session.phoneVerified) {
        return res.status(400).json({
          success: false,
          error: 'INVALID_SESSION',
          message: '電話認証が完了していません'
        });
      }

      // Validate required fields
      const requiredFields = ['guideName', 'guideEmail', 'guideGender', 'guideAge', 'guideExperience', 'guideLanguages', 'guideIntroduction', 'guideSpecialties', 'guideSessionRate', 'guideAvailability'];
      
      for (const field of requiredFields) {
        if (!guideData[field]) {
          return res.status(400).json({
            success: false,
            error: 'MISSING_REQUIRED_FIELD',
            message: `必須フィールドが不足しています: ${field}`
          });
        }
      }

      // Create guide record
      const guideId = randomUUID();
      const guide = {
        id: guideId,
        ...guideData,
        phoneNumber: session.phoneNumber,
        phoneVerified: true,
        documents: session.documents || [],
        profilePhoto: session.profilePhoto,
        status: 'pending', // pending, approved, rejected
        registeredAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Store guide (in production, save to database)
      this.guides.set(guideId, guide);

      // Clean up session
      this.pendingRegistrations.delete(sessionId);

      console.log(`✅ New guide registered: ${guide.guideName} (${guideId})`);

      res.json({
        success: true,
        message: 'ガイド登録が完了しました。審査後にメールでご連絡いたします。',
        guideId,
        guide: {
          id: guide.id,
          name: guide.guideName,
          email: guide.guideEmail,
          status: guide.status,
          registeredAt: guide.registeredAt
        }
      });

    } catch (error) {
      console.error('❌ Guide registration error:', error);
      res.status(500).json({
        success: false,
        error: 'REGISTRATION_ERROR',
        message: 'ガイド登録中にエラーが発生しました'
      });
    }
  }

  // Get public guide list (approved guides only)
  async getGuides(req, res) {
    try {
      const approvedGuides = Array.from(this.guides.values())
        .filter(guide => guide.status === 'approved')
        .map(guide => ({
          id: guide.id,
          name: guide.guideName,
          languages: guide.guideLanguages,
          specialties: guide.guideSpecialties,
          experience: guide.guideExperience,
          sessionRate: guide.guideSessionRate,
          availability: guide.guideAvailability,
          profilePhoto: guide.profilePhoto?.fileName
        }));

      res.json({
        success: true,
        guides: approvedGuides,
        total: approvedGuides.length
      });
    } catch (error) {
      console.error('❌ Get guides error:', error);
      res.status(500).json({
        success: false,
        error: 'FETCH_ERROR',
        message: 'ガイド情報の取得中にエラーが発生しました'
      });
    }
  }

  // Get specific guide details
  async getGuide(req, res) {
    try {
      const { id } = req.params;
      const guide = this.guides.get(id);

      if (!guide || guide.status !== 'approved') {
        return res.status(404).json({
          success: false,
          error: 'GUIDE_NOT_FOUND',
          message: 'ガイドが見つかりません'
        });
      }

      res.json({
        success: true,
        guide: {
          id: guide.id,
          name: guide.guideName,
          email: guide.guideEmail,
          languages: guide.guideLanguages,
          introduction: guide.guideIntroduction,
          specialties: guide.guideSpecialties,
          experience: guide.guideExperience,
          sessionRate: guide.guideSessionRate,
          availability: guide.guideAvailability,
          profilePhoto: guide.profilePhoto?.fileName
        }
      });
    } catch (error) {
      console.error('❌ Get guide error:', error);
      res.status(500).json({
        success: false,
        error: 'FETCH_ERROR',
        message: 'ガイド情報の取得中にエラーが発生しました'
      });
    }
  }

  // Admin: Get all guides
  async getGuidesAdmin(req, res) {
    try {
      const allGuides = Array.from(this.guides.values()).map(guide => ({
        id: guide.id,
        name: guide.guideName,
        email: guide.guideEmail,
        phoneNumber: guide.phoneNumber,
        status: guide.status,
        registeredAt: guide.registeredAt,
        updatedAt: guide.updatedAt,
        sessionRate: guide.guideSessionRate,
        experience: guide.guideExperience
      }));

      res.json({
        success: true,
        guides: allGuides,
        total: allGuides.length
      });
    } catch (error) {
      console.error('❌ Admin get guides error:', error);
      res.status(500).json({
        success: false,
        error: 'FETCH_ERROR',
        message: 'ガイド情報の取得中にエラーが発生しました'
      });
    }
  }

  // Admin: Approve guide
  async approveGuide(req, res) {
    try {
      const { id } = req.params;
      const guide = this.guides.get(id);

      if (!guide) {
        return res.status(404).json({
          success: false,
          error: 'GUIDE_NOT_FOUND',
          message: 'ガイドが見つかりません'
        });
      }

      guide.status = 'approved';
      guide.updatedAt = new Date().toISOString();
      guide.approvedBy = req.adminUser.username;
      
      this.guides.set(id, guide);

      console.log(`✅ Guide approved: ${guide.guideName} (${id}) by ${req.adminUser.username}`);

      res.json({
        success: true,
        message: 'ガイドを承認しました',
        guide: {
          id: guide.id,
          name: guide.guideName,
          status: guide.status
        }
      });
    } catch (error) {
      console.error('❌ Guide approval error:', error);
      res.status(500).json({
        success: false,
        error: 'APPROVAL_ERROR',
        message: 'ガイド承認中にエラーが発生しました'
      });
    }
  }

  // Admin: Reject guide
  async rejectGuide(req, res) {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      const guide = this.guides.get(id);

      if (!guide) {
        return res.status(404).json({
          success: false,
          error: 'GUIDE_NOT_FOUND',
          message: 'ガイドが見つかりません'
        });
      }

      guide.status = 'rejected';
      guide.rejectionReason = reason || '承認基準を満たしていません';
      guide.updatedAt = new Date().toISOString();
      guide.rejectedBy = req.adminUser.username;
      
      this.guides.set(id, guide);

      console.log(`❌ Guide rejected: ${guide.guideName} (${id}) by ${req.adminUser.username}`);

      res.json({
        success: true,
        message: 'ガイドを拒否しました',
        guide: {
          id: guide.id,
          name: guide.guideName,
          status: guide.status,
          rejectionReason: guide.rejectionReason
        }
      });
    } catch (error) {
      console.error('❌ Guide rejection error:', error);
      res.status(500).json({
        success: false,
        error: 'REJECTION_ERROR',
        message: 'ガイド拒否中にエラーが発生しました'
      });
    }
  }

  // Get guide by ID for editing
  async getGuideById(req, res) {
    try {
      const { id } = req.params;
      const guide = this.guides.get(id);
      
      if (!guide) {
        return res.status(404).json({
          success: false,
          message: 'ガイドが見つかりません'
        });
      }

      res.json({
        success: true,
        guide: guide
      });

    } catch (error) {
      console.error('❌ Error getting guide:', error);
      res.status(500).json({
        success: false,
        message: 'ガイド情報の取得中にエラーが発生しました'
      });
    }
  }

  // Update guide information
  async updateGuide(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const existingGuide = this.guides.get(id);
      if (!existingGuide) {
        return res.status(404).json({
          success: false,
          message: 'ガイドが見つかりません'
        });
      }

      // Update guide data while preserving critical fields
      const updatedGuide = {
        ...existingGuide,
        ...updates,
        id: existingGuide.id, // Preserve ID
        phoneNumber: existingGuide.phoneNumber, // Preserve phone
        guideEmail: existingGuide.guideEmail, // Preserve email
        phoneVerified: existingGuide.phoneVerified, // Preserve verification status
        documents: existingGuide.documents, // Preserve documents
        registeredAt: existingGuide.registeredAt, // Preserve registration date
        updatedAt: new Date().toISOString() // Update timestamp
      };

      // Save updated guide
      this.guides.set(id, updatedGuide);

      console.log(`✅ Guide updated: ${updatedGuide.guideName} (${id})`);

      res.json({
        success: true,
        message: 'ガイド情報が正常に更新されました',
        guide: {
          id: updatedGuide.id,
          name: updatedGuide.guideName,
          email: updatedGuide.guideEmail,
          status: updatedGuide.status,
          updatedAt: updatedGuide.updatedAt
        }
      });

    } catch (error) {
      console.error('❌ Error updating guide:', error);
      res.status(500).json({
        success: false,
        message: 'ガイド情報の更新中にエラーが発生しました'
      });
    }
  }

  // Cleanup expired sessions
  cleanupExpiredSessions() {
    const now = new Date();
    for (const [sessionId, session] of this.pendingRegistrations.entries()) {
      if (new Date(session.expiresAt) < now) {
        this.pendingRegistrations.delete(sessionId);
      }
    }
  }
}

// Create singleton instance
const guideAPIService = new GuideAPIService();

// Cleanup expired sessions every 10 minutes
setInterval(() => {
  guideAPIService.cleanupExpiredSessions();
}, 10 * 60 * 1000);

module.exports = { GuideAPIService, guideAPIService };