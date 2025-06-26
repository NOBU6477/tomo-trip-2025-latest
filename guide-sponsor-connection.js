/**
 * ガイド・協賛店連携システム
 * ガイドの紹介による協賛店加入の追跡と成果管理
 */

(function() {
  'use strict';
  
  console.log('ガイド・協賛店連携システム開始');
  
  // 紹介コード生成
  function generateReferralCode(guideId) {
    const prefix = 'GUIDE';
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `${prefix}_${guideId}_${timestamp}_${random}`.toUpperCase();
  }
  
  // ガイド紹介データの管理
  const GuideReferralManager = {
    
    // ガイドの紹介コードを生成・取得
    getGuideReferralCode(guideId) {
      const existingCodes = this.getGuideReferralData(guideId);
      if (existingCodes.referralCode) {
        return existingCodes.referralCode;
      }
      
      const newCode = generateReferralCode(guideId);
      this.saveGuideReferralData(guideId, {
        referralCode: newCode,
        referrals: [],
        totalCommission: 0,
        createdAt: new Date().toISOString()
      });
      
      return newCode;
    },
    
    // ガイドの紹介データを取得
    getGuideReferralData(guideId) {
      try {
        const data = localStorage.getItem(`guide_referral_${guideId}`);
        return data ? JSON.parse(data) : {};
      } catch (error) {
        console.error('ガイド紹介データ取得エラー:', error);
        return {};
      }
    },
    
    // ガイドの紹介データを保存
    saveGuideReferralData(guideId, data) {
      try {
        localStorage.setItem(`guide_referral_${guideId}`, JSON.stringify(data));
        console.log('ガイド紹介データ保存完了:', guideId);
      } catch (error) {
        console.error('ガイド紹介データ保存エラー:', error);
      }
    },
    
    // 紹介による協賛店登録を記録
    recordSponsorReferral(referralCode, sponsorData) {
      // 紹介コードからガイドIDを抽出
      const guideId = this.extractGuideIdFromCode(referralCode);
      if (!guideId) {
        console.error('無効な紹介コード:', referralCode);
        return false;
      }
      
      const referralData = this.getGuideReferralData(guideId);
      if (!referralData.referrals) {
        referralData.referrals = [];
      }
      
      // 紹介記録を追加
      const referralRecord = {
        id: 'referral_' + Date.now(),
        sponsorId: sponsorData.id,
        sponsorName: sponsorData.storeName,
        sponsorType: sponsorData.storeType,
        referralDate: new Date().toISOString(),
        status: 'pending', // pending, approved, rejected
        commission: this.calculateCommission(sponsorData),
        referralCode: referralCode
      };
      
      referralData.referrals.push(referralRecord);
      this.saveGuideReferralData(guideId, referralData);
      
      // 協賛店データに紹介情報を追加
      this.addReferralToSponsor(sponsorData, referralRecord);
      
      return referralRecord;
    },
    
    // 紹介コードからガイドIDを抽出
    extractGuideIdFromCode(referralCode) {
      const parts = referralCode.split('_');
      return parts.length >= 2 ? parts[1] : null;
    },
    
    // コミッション計算
    calculateCommission(sponsorData) {
      const baseCommission = 1000; // 基本コミッション
      const typeMultiplier = {
        'restaurant': 1.5,
        'hotel': 2.0,
        'cafe': 1.2,
        'shop': 1.0,
        'activity': 1.8,
        'transportation': 1.3,
        'other': 1.0
      };
      
      return Math.round(baseCommission * (typeMultiplier[sponsorData.storeType] || 1.0));
    },
    
    // 協賛店データに紹介情報を追加
    addReferralToSponsor(sponsorData, referralRecord) {
      try {
        const sponsors = JSON.parse(localStorage.getItem('sponsorData') || '[]');
        const sponsorIndex = sponsors.findIndex(s => s.id === sponsorData.id);
        
        if (sponsorIndex !== -1) {
          sponsors[sponsorIndex].referredBy = referralRecord;
          localStorage.setItem('sponsorData', JSON.stringify(sponsors));
        }
      } catch (error) {
        console.error('協賛店紹介情報追加エラー:', error);
      }
    },
    
    // ガイドの紹介実績を取得
    getGuideReferralStats(guideId) {
      const data = this.getGuideReferralData(guideId);
      const referrals = data.referrals || [];
      
      return {
        totalReferrals: referrals.length,
        pendingReferrals: referrals.filter(r => r.status === 'pending').length,
        approvedReferrals: referrals.filter(r => r.status === 'approved').length,
        rejectedReferrals: referrals.filter(r => r.status === 'rejected').length,
        totalCommission: referrals.filter(r => r.status === 'approved').reduce((sum, r) => sum + r.commission, 0),
        pendingCommission: referrals.filter(r => r.status === 'pending').reduce((sum, r) => sum + r.commission, 0)
      };
    },
    
    // 紹介ステータスを更新
    updateReferralStatus(guideId, referralId, newStatus) {
      const data = this.getGuideReferralData(guideId);
      const referralIndex = data.referrals.findIndex(r => r.id === referralId);
      
      if (referralIndex !== -1) {
        data.referrals[referralIndex].status = newStatus;
        data.referrals[referralIndex].statusUpdatedAt = new Date().toISOString();
        
        // 承認時はコミッションを加算
        if (newStatus === 'approved') {
          data.totalCommission = (data.totalCommission || 0) + data.referrals[referralIndex].commission;
        }
        
        this.saveGuideReferralData(guideId, data);
        return true;
      }
      
      return false;
    }
  };
  
  // 協賛店紹介リンク生成
  function generateSponsorReferralLink(guideId) {
    const referralCode = GuideReferralManager.getGuideReferralCode(guideId);
    const baseUrl = window.location.origin;
    return `${baseUrl}/sponsor-registration.html?ref=${referralCode}`;
  }
  
  // 紹介コード入力UI作成
  function createReferralCodeInput() {
    const urlParams = new URLSearchParams(window.location.search);
    const referralCode = urlParams.get('ref');
    
    if (referralCode) {
      // 紹介コードが含まれている場合の処理
      console.log('紹介コード検出:', referralCode);
      
      // 協賛店登録フォームに紹介情報を追加
      if (document.getElementById('sponsorForm')) {
        addReferralInfoToForm(referralCode);
      }
    }
  }
  
  // 協賛店登録フォームに紹介情報を追加
  function addReferralInfoToForm(referralCode) {
    const form = document.getElementById('sponsorForm');
    if (!form) return;
    
    // 紹介情報セクションを追加
    const referralSection = document.createElement('div');
    referralSection.className = 'form-group';
    referralSection.innerHTML = `
      <div class="alert alert-info">
        <i class="bi bi-person-check"></i>
        <strong>ガイド紹介による登録</strong><br>
        紹介コード: <code>${referralCode}</code><br>
        <small>このガイドの紹介で登録いただくと、特別なサポートを受けられます。</small>
      </div>
      <input type="hidden" id="referralCode" value="${referralCode}">
    `;
    
    // フォームの最初に挿入
    form.insertBefore(referralSection, form.firstChild);
  }
  
  // ガイド向け紹介ダッシュボード作成
  function createGuideReferralDashboard(guideId) {
    const stats = GuideReferralManager.getGuideReferralStats(guideId);
    const referralLink = generateSponsorReferralLink(guideId);
    
    return `
      <div class="referral-dashboard">
        <h4><i class="bi bi-graph-up"></i> 協賛店紹介実績</h4>
        
        <div class="row mb-4">
          <div class="col-md-3">
            <div class="stat-card">
              <div class="stat-number">${stats.totalReferrals}</div>
              <div class="stat-label">総紹介数</div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="stat-card">
              <div class="stat-number">${stats.approvedReferrals}</div>
              <div class="stat-label">承認済み</div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="stat-card">
              <div class="stat-number">¥${stats.totalCommission.toLocaleString()}</div>
              <div class="stat-label">獲得コミッション</div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="stat-card">
              <div class="stat-number">¥${stats.pendingCommission.toLocaleString()}</div>
              <div class="stat-label">保留中</div>
            </div>
          </div>
        </div>
        
        <div class="referral-link-section">
          <h5>あなたの紹介リンク</h5>
          <div class="input-group">
            <input type="text" class="form-control" value="${referralLink}" id="referralLinkInput" readonly>
            <button class="btn btn-outline-primary" onclick="copyReferralLink()">
              <i class="bi bi-clipboard"></i> コピー
            </button>
          </div>
          <small class="text-muted">このリンクを協賛店候補に送信してください</small>
        </div>
      </div>
    `;
  }
  
  // 紹介リンクコピー機能
  window.copyReferralLink = function() {
    const input = document.getElementById('referralLinkInput');
    input.select();
    document.execCommand('copy');
    
    // 成功メッセージ表示
    const button = event.target.closest('button');
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="bi bi-check"></i> コピー完了';
    button.classList.add('btn-success');
    button.classList.remove('btn-outline-primary');
    
    setTimeout(() => {
      button.innerHTML = originalText;
      button.classList.remove('btn-success');
      button.classList.add('btn-outline-primary');
    }, 2000);
  };
  
  // グローバル関数として公開
  window.GuideReferralManager = GuideReferralManager;
  window.generateSponsorReferralLink = generateSponsorReferralLink;
  window.createGuideReferralDashboard = createGuideReferralDashboard;
  
  // 初期化
  document.addEventListener('DOMContentLoaded', function() {
    createReferralCodeInput();
  });
  
})();