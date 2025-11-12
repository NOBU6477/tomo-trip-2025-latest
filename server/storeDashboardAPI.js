const fs = require('fs');
const path = require('path');

const REFERRALS_FILE = path.join(__dirname, '../data/sponsor-referrals.json');

class StoreDashboardService {
  async getStoreDashboard(storeId) {
    try {
      const period = new Date().toISOString().slice(0, 7);
      
      let referrals = [];
      if (fs.existsSync(REFERRALS_FILE)) {
        const data = fs.readFileSync(REFERRALS_FILE, 'utf-8');
        referrals = JSON.parse(data);
      }
      
      const storeReferrals = referrals.filter(r => r.sponsorStoreId === storeId);
      
      const sent_customers = storeReferrals.filter(r => r.commissionStatus !== 'cancelled').length;
      const bookings = storeReferrals.filter(r => r.commissionStatus === 'paid').length;
      const visit_rate = sent_customers > 0 ? Math.round((bookings / sent_customers) * 100) : 0;
      const video_views = 0;
      
      const guidesMap = new Map();
      storeReferrals.forEach(r => {
        const guideId = r.guideId;
        if (!guidesMap.has(guideId)) {
          guidesMap.set(guideId, {
            guide_id: guideId,
            display_name: `ガイド ${guideId.substring(0, 8)}`,
            sent: 0,
            bookings: 0,
            visit_rate: 0,
            last_active: r.referralDate ? r.referralDate.split('T')[0] : 'N/A'
          });
        }
        
        const guide = guidesMap.get(guideId);
        guide.sent++;
        if (r.commissionStatus === 'paid') {
          guide.bookings++;
        }
        
        if (r.referralDate && (!guide.last_active || r.referralDate > guide.last_active)) {
          guide.last_active = r.referralDate.split('T')[0];
        }
      });
      
      guidesMap.forEach(guide => {
        guide.visit_rate = guide.sent > 0 ? Math.round((guide.bookings / guide.sent) * 100) : 0;
      });
      
      const top_contributors = Array.from(guidesMap.values())
        .sort((a, b) => b.sent - a.sent)
        .slice(0, 3);
      
      return {
        storeId,
        period,
        metrics: {
          sent_customers,
          bookings,
          visit_rate,
          video_views,
          avg_ticket_jpy: null,
          estimated_sales_jpy: null,
          retention: 0,
          estimated_roi: null
        },
        top_contributors,
        campaigns: []
      };
    } catch (error) {
      console.error('Error in getStoreDashboard:', error);
      throw error;
    }
  }
}

module.exports = { storeDashboardAPIService: new StoreDashboardService() };
