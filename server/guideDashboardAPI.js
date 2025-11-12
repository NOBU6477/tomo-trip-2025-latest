const fs = require('fs');
const path = require('path');

const GUIDES_FILE = path.join(__dirname, '../data/guides.json');
const REFERRALS_FILE = path.join(__dirname, '../data/sponsor-referrals.json');

const BASE_PAYOUT_JPY = 5000;

class GuideDashboardService {
  async getGuideDashboard(guideId) {
    try {
      const period = new Date().toISOString().slice(0, 7);
      
      let guides = [];
      if (fs.existsSync(GUIDES_FILE)) {
        const data = fs.readFileSync(GUIDES_FILE, 'utf-8');
        guides = JSON.parse(data);
      }
      
      const guide = guides.find(g => g.id === guideId);
      if (!guide) {
        throw new Error('Guide not found');
      }
      
      let referrals = [];
      if (fs.existsSync(REFERRALS_FILE)) {
        const data = fs.readFileSync(REFERRALS_FILE, 'utf-8');
        referrals = JSON.parse(data);
      }
      
      const guideReferrals = referrals.filter(r => r.guideId === guideId);
      const currentMonthReferrals = guideReferrals.filter(r => {
        if (!r.referralDate) return false;
        return r.referralDate.startsWith(period);
      });
      
      const currentRank = guide.rankName || 'Bronze';
      const rankScore = guide.rankScore || 0;
      
      const rankThresholds = [
        { name: 'Bronze', minScore: 0, bonusRate: 0.00 },
        { name: 'Silver', minScore: 60, bonusRate: 0.05 },
        { name: 'Gold', minScore: 120, bonusRate: 0.10 },
        { name: 'Platinum', minScore: 200, bonusRate: 0.15 }
      ];
      
      const currentRankData = rankThresholds.find(r => r.name === currentRank) || rankThresholds[0];
      const currentRankIndex = rankThresholds.findIndex(r => r.name === currentRank);
      const nextRankData = currentRankIndex >= 0 && currentRankIndex < rankThresholds.length - 1 
        ? rankThresholds[currentRankIndex + 1] 
        : null;
      
      const points_to_next = nextRankData ? nextRankData.minScore - rankScore : 0;
      
      const paidReferrals = currentMonthReferrals.filter(r => r.commissionStatus === 'paid');
      const baseTotal = paidReferrals.length * BASE_PAYOUT_JPY;
      const bonusAmount = Math.round(baseTotal * currentRankData.bonusRate);
      const payout_month_total = baseTotal + bonusAmount;
      
      const payouts = paidReferrals.map(r => ({
        date: r.paymentDate ? r.paymentDate.split('T')[0] : period,
        store: r.sponsorStoreId || '協賛店',
        amount: Math.round(BASE_PAYOUT_JPY * (1 + currentRankData.bonusRate))
      }));
      
      const referred_stores = guideReferrals.map(r => ({
        store: r.sponsorStoreId,
        status: r.commissionStatus,
        months: r.referralDate ? Math.floor((Date.now() - new Date(r.referralDate).getTime()) / (30 * 24 * 60 * 60 * 1000)) : 0
      }));
      
      return {
        guideId,
        period,
        summary: {
          current_rank: currentRank,
          rank_score: rankScore,
          next_rank: nextRankData ? nextRankData.name : '--',
          points_to_next,
          payout_month_total
        },
        payouts,
        referred_stores,
        wallet: {
          connected: false,
          provider: 'stripe',
          onboarding_url: null
        }
      };
    } catch (error) {
      console.error('Error in getGuideDashboard:', error);
      throw error;
    }
  }
}

module.exports = { guideDashboardAPIService: new GuideDashboardService() };
