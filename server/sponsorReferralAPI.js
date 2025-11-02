// Sponsor Referral API - ガイドによる協賛店紹介の追跡システム
const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');

class SponsorReferralAPIService {
  constructor() {
    this.referralsFilePath = path.join(__dirname, '../data/sponsor-referrals.json');
    this.ensureReferralsFile();
  }

  // Ensure referrals file exists
  ensureReferralsFile() {
    if (!fs.existsSync(this.referralsFilePath)) {
      fs.writeFileSync(this.referralsFilePath, JSON.stringify([], null, 2));
    }
  }

  // Load referrals from file
  loadReferrals() {
    try {
      const data = fs.readFileSync(this.referralsFilePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error loading referrals:', error);
      return [];
    }
  }

  // Save referrals to file
  saveReferrals(referrals) {
    try {
      fs.writeFileSync(this.referralsFilePath, JSON.stringify(referrals, null, 2));
    } catch (error) {
      console.error('Error saving referrals:', error);
    }
  }

  // Initialize API routes
  setupRoutes(app) {
    // Create referral - ガイドが協賛店を紹介
    app.post('/api/referrals', this.createReferral.bind(this));
    
    // Get referrals by guide ID - ガイドの紹介実績
    app.get('/api/referrals/guide/:guideId', this.getReferralsByGuide.bind(this));
    
    // Get referrals by sponsor store ID - 協賛店への紹介
    app.get('/api/referrals/store/:storeId', this.getReferralsByStore.bind(this));
    
    // Get all referrals with stats - 全紹介実績と統計
    app.get('/api/referrals', this.getAllReferrals.bind(this));
    
    // Update referral status - 配当ステータス更新
    app.put('/api/referrals/:id', this.updateReferral.bind(this));
    
    // Get commission dashboard - 配当ダッシュボード
    app.get('/api/referrals/dashboard/:guideId', this.getCommissionDashboard.bind(this));
    
    console.log('✅ Sponsor Referral API routes initialized');
  }

  // Create new referral
  async createReferral(req, res) {
    try {
      const { guideId, sponsorStoreId, commissionRate, referralSource, notes } = req.body;
      
      if (!guideId || !sponsorStoreId) {
        return res.status(400).json({
          success: false,
          error: 'MISSING_REQUIRED_FIELDS',
          message: 'ガイドIDと協賛店IDは必須です'
        });
      }

      const referralId = randomUUID();
      const now = new Date().toISOString();
      
      const referral = {
        id: referralId,
        guideId,
        sponsorStoreId,
        referralDate: now,
        commissionRate: commissionRate || '10.00', // Default 10%
        commissionAmount: null, // 計算後に設定
        commissionStatus: 'pending',
        paymentDate: null,
        referralSource: referralSource || 'web',
        notes: notes || '',
        createdAt: now,
        updatedAt: now
      };

      const referrals = this.loadReferrals();
      referrals.push(referral);
      this.saveReferrals(referrals);

      console.log(`✅ New referral created: Guide ${guideId} → Store ${sponsorStoreId}`);

      res.json({
        success: true,
        message: '紹介が正常に記録されました',
        referral
      });

    } catch (error) {
      console.error('❌ Error creating referral:', error);
      res.status(500).json({
        success: false,
        error: 'REFERRAL_CREATE_ERROR',
        message: '紹介の記録中にエラーが発生しました'
      });
    }
  }

  // Get referrals by guide ID
  async getReferralsByGuide(req, res) {
    try {
      const { guideId } = req.params;
      const referrals = this.loadReferrals();
      
      const guideReferrals = referrals.filter(ref => ref.guideId === guideId);
      
      res.json({
        success: true,
        referrals: guideReferrals,
        total: guideReferrals.length
      });

    } catch (error) {
      console.error('❌ Error getting guide referrals:', error);
      res.status(500).json({
        success: false,
        message: '紹介実績の取得中にエラーが発生しました'
      });
    }
  }

  // Get referrals by sponsor store ID
  async getReferralsByStore(req, res) {
    try {
      const { storeId } = req.params;
      const referrals = this.loadReferrals();
      
      const storeReferrals = referrals.filter(ref => ref.sponsorStoreId === storeId);
      
      res.json({
        success: true,
        referrals: storeReferrals,
        total: storeReferrals.length
      });

    } catch (error) {
      console.error('❌ Error getting store referrals:', error);
      res.status(500).json({
        success: false,
        message: '協賛店紹介の取得中にエラーが発生しました'
      });
    }
  }

  // Get all referrals with stats
  async getAllReferrals(req, res) {
    try {
      const referrals = this.loadReferrals();
      
      // Calculate statistics
      const stats = {
        totalReferrals: referrals.length,
        pendingCommissions: referrals.filter(r => r.commissionStatus === 'pending').length,
        approvedCommissions: referrals.filter(r => r.commissionStatus === 'approved').length,
        paidCommissions: referrals.filter(r => r.commissionStatus === 'paid').length,
        totalCommissionAmount: referrals
          .filter(r => r.commissionAmount)
          .reduce((sum, r) => sum + parseFloat(r.commissionAmount || 0), 0)
      };
      
      res.json({
        success: true,
        referrals,
        stats
      });

    } catch (error) {
      console.error('❌ Error getting all referrals:', error);
      res.status(500).json({
        success: false,
        message: '紹介データの取得中にエラーが発生しました'
      });
    }
  }

  // Update referral (status, commission amount, etc.)
  async updateReferral(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const referrals = this.loadReferrals();
      const index = referrals.findIndex(r => r.id === id);
      
      if (index === -1) {
        return res.status(404).json({
          success: false,
          message: '紹介記録が見つかりません'
        });
      }

      // Update referral
      referrals[index] = {
        ...referrals[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      // If status changed to 'paid', set payment date
      if (updates.commissionStatus === 'paid' && !referrals[index].paymentDate) {
        referrals[index].paymentDate = new Date().toISOString();
      }

      this.saveReferrals(referrals);

      console.log(`✅ Referral updated: ${id}`);

      res.json({
        success: true,
        message: '紹介情報が更新されました',
        referral: referrals[index]
      });

    } catch (error) {
      console.error('❌ Error updating referral:', error);
      res.status(500).json({
        success: false,
        message: '紹介情報の更新中にエラーが発生しました'
      });
    }
  }

  // Get commission dashboard for a guide
  async getCommissionDashboard(req, res) {
    try {
      const { guideId } = req.params;
      const referrals = this.loadReferrals();
      
      const guideReferrals = referrals.filter(r => r.guideId === guideId);
      
      const dashboard = {
        guideId,
        totalReferrals: guideReferrals.length,
        referralsByStatus: {
          pending: guideReferrals.filter(r => r.commissionStatus === 'pending').length,
          approved: guideReferrals.filter(r => r.commissionStatus === 'approved').length,
          paid: guideReferrals.filter(r => r.commissionStatus === 'paid').length,
          cancelled: guideReferrals.filter(r => r.commissionStatus === 'cancelled').length
        },
        commissions: {
          pending: this.calculateTotalCommission(guideReferrals.filter(r => r.commissionStatus === 'pending')),
          approved: this.calculateTotalCommission(guideReferrals.filter(r => r.commissionStatus === 'approved')),
          paid: this.calculateTotalCommission(guideReferrals.filter(r => r.commissionStatus === 'paid')),
          total: this.calculateTotalCommission(guideReferrals)
        },
        recentReferrals: guideReferrals
          .sort((a, b) => new Date(b.referralDate) - new Date(a.referralDate))
          .slice(0, 10)
      };
      
      res.json({
        success: true,
        dashboard
      });

    } catch (error) {
      console.error('❌ Error getting commission dashboard:', error);
      res.status(500).json({
        success: false,
        message: 'ダッシュボードの取得中にエラーが発生しました'
      });
    }
  }

  // Helper: Calculate total commission from referrals
  calculateTotalCommission(referrals) {
    return referrals
      .filter(r => r.commissionAmount)
      .reduce((sum, r) => sum + parseFloat(r.commissionAmount || 0), 0)
      .toFixed(2);
  }
}

// Create singleton instance
const sponsorReferralAPIService = new SponsorReferralAPIService();

module.exports = { SponsorReferralAPIService, sponsorReferralAPIService };
