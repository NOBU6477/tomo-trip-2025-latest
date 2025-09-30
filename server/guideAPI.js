// Guide Registration API for TomoTrip
// Integrates SMS verification, file upload, and database storage
const { smsService } = require('./smsService');
const { ObjectStorageService } = require('./objectStorage');
const { adminAuthService } = require('./adminAuth');
// Database storage - use simple file storage for now
const fs = require('fs');
const path = require('path');
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
    // Allow images and PDFs
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('画像ファイル（JPG, PNG）またはPDFファイルのみアップロード可能です'), false);
    }
  }
});

class GuideAPIService {
  constructor() {
    this.objectStorage = new ObjectStorageService();
    this.guidesFilePath = path.join(__dirname, '../data/guides.json');
    this.touristsFilePath = path.join(__dirname, '../data/tourists.json');
    this.pendingRegistrations = new Map(); // Temporary storage for incomplete registrations
    this.ensureDataDirectory();
    this.ensureTouristsFile();
  }

  // Ensure data directory exists
  ensureDataDirectory() {
    const dataDir = path.join(__dirname, '../data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    if (!fs.existsSync(this.guidesFilePath)) {
      fs.writeFileSync(this.guidesFilePath, JSON.stringify([], null, 2));
    }
  }

  // Ensure tourists file exists
  ensureTouristsFile() {
    if (!fs.existsSync(this.touristsFilePath)) {
      fs.writeFileSync(this.touristsFilePath, JSON.stringify([], null, 2));
    }
  }

  // Load guides from file
  loadGuides() {
    try {
      const data = fs.readFileSync(this.guidesFilePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error loading guides:', error);
      return [];
    }
  }

  // Save guides to file
  saveGuides(guides) {
    try {
      fs.writeFileSync(this.guidesFilePath, JSON.stringify(guides, null, 2));
    } catch (error) {
      console.error('Error saving guides:', error);
    }
  }

  // Load tourists from file
  loadTourists() {
    try {
      const data = fs.readFileSync(this.touristsFilePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error loading tourists:', error);
      return [];
    }
  }

  // Save tourists to file
  saveTourists(tourists) {
    try {
      fs.writeFileSync(this.touristsFilePath, JSON.stringify(tourists, null, 2));
    } catch (error) {
      console.error('Error saving tourists:', error);
    }
  }

  // Add guide to storage
  addGuide(guide) {
    const guides = this.loadGuides();
    guides.push(guide);
    this.saveGuides(guides);
  }

  // Normalize phone number to international format
  normalizePhoneNumber(phoneNumber) {
    // Remove all non-digit characters except +
    let normalizedPhone = phoneNumber.replace(/[-\s]/g, '');
    
    // Handle Japanese domestic format (starting with 0)
    if (normalizedPhone.match(/^0[789]0\d{8}$/)) {
      // Convert 090xxxxxxxx to +8190xxxxxxxx
      normalizedPhone = '+81' + normalizedPhone.substring(1);
    }
    
    return normalizedPhone;
  }

  // Update guide in storage
  updateGuideInStorage(guideId, updates) {
    const guides = this.loadGuides();
    const index = guides.findIndex(g => g.id === guideId);
    if (index !== -1) {
      guides[index] = { ...guides[index], ...updates, updatedAt: new Date().toISOString() };
      this.saveGuides(guides);
      return guides[index];
    }
    return null;
  }

  // Get guide by ID from storage
  getGuideFromStorage(guideId) {
    const guides = this.loadGuides();
    return guides.find(g => g.id === guideId);
  }

  // Initialize API routes
  setupRoutes(app) {
    // SMS verification endpoints - shared for guides and tourists
    app.post('/api/guides/send-verification', this.sendPhoneVerification.bind(this));
    app.post('/api/guides/verify-phone', this.verifyPhone.bind(this));
    
    // Tourist SMS verification endpoints (same as guides but with different context)
    app.post('/api/tourists/send-verification', this.sendPhoneVerification.bind(this));
    app.post('/api/tourists/verify-phone', this.verifyTouristPhone.bind(this));
    app.post('/api/tourists/register', this.registerTourist.bind(this));
    
    // File upload endpoints for guides
    app.post('/api/guides/upload-document', upload.array('documents', 3), this.uploadDocuments.bind(this));
    app.post('/api/guides/upload-profile-photo', upload.single('profilePhoto'), this.uploadProfilePhoto.bind(this));
    
    // File upload endpoints for tourists
    app.post('/api/tourists/upload-document', upload.single('document'), this.uploadTouristDocument.bind(this));
    
    // Image serving endpoint
    app.get('/objects/*', this.serveUploadedImage.bind(this));
    
    // Guide registration and authentication endpoints
    app.post('/api/guides/register', this.registerGuide.bind(this));
    app.post('/api/guides/login', this.guideLogin.bind(this));
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

      // Normalize and validate phone number
      let normalizedPhone = phoneNumber.replace(/[-\s]/g, '');
      
      // Convert Japanese domestic format to international format
      if (normalizedPhone.match(/^0[789]0\d{8}$/)) {
        normalizedPhone = '+81' + normalizedPhone.substring(1);
      }
      
      // Validate normalized phone number format
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(normalizedPhone)) {
        return res.status(400).json({
          success: false,
          error: 'INVALID_PHONE',
          message: '有効な電話番号を入力してください（例: 090-1234-5678）'
        });
      }

      const result = await smsService.sendVerificationCode(normalizedPhone);
      
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

  // Guide login authentication
  async guideLogin(req, res) {
    try {
      const { identifier, phone } = req.body;
      
      if (!identifier || !phone) {
        return res.status(400).json({
          success: false,
          error: 'MISSING_CREDENTIALS',
          message: 'ガイドIDまたはメールアドレスと電話番号が必要です'
        });
      }
      
      // Load all guides from storage
      const guides = this.loadGuides();
      
      // Find guide by identifier (ID, email, or name) and phone
      const guide = guides.find(g => {
        const matchesIdentifier = (
          g.id === identifier || 
          g.email === identifier || 
          g.guideEmail === identifier ||
          g.name === identifier ||
          g.guideName === identifier
        );
        
        const matchesPhone = (
          g.phoneNumber === phone || 
          g.phone === phone
        );
        
        return matchesIdentifier && matchesPhone;
      });
      
      if (!guide) {
        return res.status(401).json({
          success: false,
          error: 'INVALID_CREDENTIALS',
          message: 'ガイドIDまたは電話番号が正しくありません'
        });
      }
      
      // Return sanitized guide data for login
      const loginGuideData = {
        id: guide.id,
        name: guide.name || guide.guideName,
        email: guide.email || guide.guideEmail,
        location: guide.location,
        introduction: guide.introduction || guide.guideIntroduction,
        experience: guide.experience || guide.guideExperience,
        sessionRate: guide.sessionRate || guide.guideSessionRate,
        status: guide.status,
        registeredAt: guide.registeredAt
      };
      
      console.log(`✅ Guide login successful: ${loginGuideData.name} (${guide.id})`);
      
      res.json({
        success: true,
        message: 'ログインに成功しました',
        guide: loginGuideData
      });
      
    } catch (error) {
      console.error('❌ Guide login error:', error);
      res.status(500).json({
        success: false,
        error: 'LOGIN_ERROR',
        message: 'ログイン中にエラーが発生しました'
      });
    }
  }

  // Serve uploaded images (profile photos, documents, etc.)
  async serveUploadedImage(req, res) {
    try {
      const objectPath = req.path;
      
      console.log(`🖼️ Image request for: ${objectPath}`);
      
      // Get the file from object storage
      const file = await this.objectStorage.getObjectEntityFile(objectPath);
      
      // Stream the file to response with proper headers
      await this.objectStorage.downloadObject(file, res);
      
    } catch (error) {
      console.error('❌ Error serving image:', error);
      
      if (error.name === 'ObjectNotFoundError') {
        return res.status(404).json({
          success: false,
          error: 'IMAGE_NOT_FOUND',
          message: '画像が見つかりません'
        });
      }
      
      res.status(500).json({
        success: false,
        error: 'IMAGE_SERVE_ERROR',
        message: '画像の読み込み中にエラーが発生しました'
      });
    }
  }

  // Generate profile photo URL from profilePhoto object
  generateProfilePhotoUrl(profilePhoto) {
    if (!profilePhoto || !profilePhoto.fileId) {
      return null;
    }
    
    // Construct the URL using the fileId
    return `/objects/uploads/${profilePhoto.fileId}`;
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
        status: 'approved', // Auto-approve for development/demo
        registeredAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Store guide in file storage for persistence
      this.addGuide(guide);

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

  // Tourist phone verification (simpler version)
  async verifyTouristPhone(req, res) {
    try {
      const { phoneNumber, code } = req.body;
      
      if (!phoneNumber || !code) {
        return res.status(400).json({
          success: false,
          error: 'MISSING_DATA',
          message: '電話番号と認証コードが必要です'
        });
      }

      // Normalize phone number (same as sendPhoneVerification)
      const normalizedPhone = this.normalizePhoneNumber(phoneNumber);
      
      const result = smsService.verifyCode(normalizedPhone, code);
      
      if (result.success) {
        // Store tourist verification session
        const sessionId = randomUUID();
        this.pendingRegistrations.set(sessionId, {
          phoneNumber: normalizedPhone, // Store normalized number
          phoneVerified: true,
          type: 'tourist',
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
      console.error('❌ Tourist phone verification error:', error);
      res.status(500).json({
        success: false,
        error: 'INTERNAL_ERROR',
        message: '認証コード確認中にエラーが発生しました'
      });
    }
  }

  // Tourist registration
  async registerTourist(req, res) {
    try {
      const { sessionId, touristData } = req.body;
      
      if (!sessionId) {
        return res.status(400).json({
          success: false,
          error: 'MISSING_SESSION',
          message: 'セッションIDが必要です'
        });
      }

      const session = this.pendingRegistrations.get(sessionId);
      if (!session || !session.phoneVerified || session.type !== 'tourist') {
        return res.status(400).json({
          success: false,
          error: 'INVALID_SESSION',
          message: '電話認証が完了していません'
        });
      }

      // Validate required fields for tourists
      const requiredFields = ['firstName', 'lastName', 'email', 'nationality'];
      
      for (const field of requiredFields) {
        if (!touristData[field]) {
          return res.status(400).json({
            success: false,
            error: 'MISSING_REQUIRED_FIELD',
            message: `必須フィールドが不足しています: ${field}`
          });
        }
      }

      // Create tourist record
      const touristId = randomUUID();
      const tourist = {
        id: touristId,
        ...touristData,
        phoneNumber: session.phoneNumber,
        phoneVerified: true,
        status: 'active',
        registeredAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Store tourist data in file storage for persistence
      const tourists = this.loadTourists();
      tourists.push(tourist);
      this.saveTourists(tourists);
      
      console.log(`✅ New tourist registered: ${tourist.firstName} ${tourist.lastName} (${touristId})`);

      // Clean up session
      this.pendingRegistrations.delete(sessionId);

      res.json({
        success: true,
        message: '観光客登録が完了しました。ようこそTomoTripへ！',
        touristId,
        tourist: {
          id: tourist.id,
          name: `${tourist.firstName} ${tourist.lastName}`,
          email: tourist.email,
          status: tourist.status,
          registeredAt: tourist.registeredAt
        }
      });

    } catch (error) {
      console.error('❌ Tourist registration error:', error);
      res.status(500).json({
        success: false,
        error: 'REGISTRATION_ERROR',
        message: '観光客登録中にエラーが発生しました'
      });
    }
  }

  // Upload tourist document
  async uploadTouristDocument(req, res) {
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
      if (!session || session.type !== 'tourist') {
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
          message: 'ファイルがアップロードされていません'
        });
      }

      const file = req.file;
      const fileData = {
        fileName: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        uploadedAt: new Date().toISOString(),
        documentType: documentType || 'identity'
      };

      // Add document to session
      if (!session.documents) {
        session.documents = [];
      }
      session.documents.push(fileData);
      
      console.log(`✅ Tourist document uploaded: ${file.originalname} for session ${sessionId}`);

      res.json({
        success: true,
        message: 'ドキュメントのアップロードが完了しました',
        document: fileData
      });

    } catch (error) {
      console.error('❌ Tourist document upload error:', error);
      res.status(500).json({
        success: false,
        error: 'UPLOAD_ERROR',
        message: 'ファイルアップロード中にエラーが発生しました'
      });
    }
  }

  // Get public guide list (approved guides only)
  async getGuides(req, res) {
    try {
      // Get language filter from query params (for language-specific page filtering)
      const { lang } = req.query;
      const requestedLang = (lang === 'en') ? 'en' : 'ja'; // Default to Japanese
      
      // Get all approved guides from file storage
      const allGuides = this.loadGuides();
      
      const approvedGuides = allGuides
        .filter(guide => guide.status === 'approved')
        .filter(guide => {
          // Filter by registration language if specified
          const guideRegLang = guide.registrationLanguage || 'ja'; // Default to 'ja' for old data
          return guideRegLang === requestedLang;
        })
        .map(guide => ({
          id: guide.id,
          name: guide.guideName,
          guideName: guide.guideName, // Keep for compatibility
          email: guide.guideEmail,
          location: guide.location || guide.prefecture || '東京都 東京',
          languages: Array.isArray(guide.guideLanguages) ? guide.guideLanguages : [guide.guideLanguages],
          specialties: guide.guideSpecialties,
          experience: guide.guideExperience,
          sessionRate: guide.guideSessionRate,
          availability: guide.guideAvailability,
          registrationLanguage: guide.registrationLanguage || 'ja', // Include in response
          // Generate proper profile photo URL
          profilePhoto: this.generateProfilePhotoUrl(guide.profilePhoto),
          introduction: guide.guideIntroduction,
          averageRating: 4.8,
          status: guide.status,
          registeredAt: guide.registeredAt
        }))
        .sort((a, b) => new Date(b.registeredAt) - new Date(a.registeredAt)); // Newest first

      console.log(`📋 API returning ${approvedGuides.length} guides for language: ${requestedLang}`);

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
      const guide = this.getGuideFromStorage(id);
      
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
      
      const existingGuide = this.getGuideFromStorage(id);
      if (!existingGuide) {
        return res.status(404).json({
          success: false,
          message: 'ガイドが見つかりません'
        });
      }

      // Update guide data while preserving critical fields
      const updatedGuide = this.updateGuideInStorage(id, {
        ...updates,
        // Preserve critical fields
        id: existingGuide.id,
        phoneNumber: existingGuide.phoneNumber,
        guideEmail: existingGuide.guideEmail,
        phoneVerified: existingGuide.phoneVerified,
        documents: existingGuide.documents,
        registeredAt: existingGuide.registeredAt
      });

      if (updatedGuide) {
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
      } else {
        throw new Error('Guide update failed');
      }

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