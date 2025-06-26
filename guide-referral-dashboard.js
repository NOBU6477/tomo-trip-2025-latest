/**
 * ガイド紹介ダッシュボードの機能
 * 紹介実績の表示と管理
 */

(function() {
  'use strict';
  
  console.log('ガイド紹介ダッシュボード開始');
  
  // ガイドIDを取得（実際の実装では認証システムから取得）
  function getCurrentGuideId() {
    // デモ用：ローカルストレージから取得またはデフォルト値
    return localStorage.getItem('currentGuideId') || 'guide_demo_001';
  }
  
  // ガイド情報を表示
  function displayGuideInfo() {
    const guideId = getCurrentGuideId();
    const guideInfo = getGuideInfo(guideId);
    
    document.getElementById('guideDetails').innerHTML = `
      <div class="row">
        <div class="col-md-6">
          <strong>ガイドID:</strong> ${guideId}
        </div>
        <div class="col-md-6">
          <strong>ガイド名:</strong> ${guideInfo.name}
        </div>
      </div>
    `;
  }
  
  // ガイド情報を取得（デモ用）
  function getGuideInfo(guideId) {
    return {
      name: '山田太郎',
      email: 'yamada@example.com',
      specialties: ['文化体験', '自然ツアー', 'グルメ']
    };
  }
  
  // 統計カードを表示
  function displayStatsCards() {
    const guideId = getCurrentGuideId();
    const stats = window.GuideReferralManager.getGuideReferralStats(guideId);
    
    const statsHtml = `
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
    `;
    
    document.getElementById('statsCards').innerHTML = statsHtml;
  }
  
  // 紹介リンクを設定
  function setupReferralLink() {
    const guideId = getCurrentGuideId();
    const referralLink = window.generateSponsorReferralLink(guideId);
    document.getElementById('referralLinkInput').value = referralLink;
  }
  
  // 紹介履歴を表示
  function displayReferralHistory() {
    const guideId = getCurrentGuideId();
    const referralData = window.GuideReferralManager.getGuideReferralData(guideId);
    const referrals = referralData.referrals || [];
    
    if (referrals.length === 0) {
      document.getElementById('emptyReferralState').style.display = 'block';
      return;
    }
    
    const referralListHtml = referrals.map(referral => `
      <div class="referral-item">
        <div class="d-flex justify-content-between align-items-start">
          <div class="flex-grow-1">
            <h6 class="mb-2">${referral.sponsorName}</h6>
            <p class="text-muted mb-2">${getStoreTypeLabel(referral.sponsorType)}</p>
            <small class="text-muted">
              <i class="bi bi-calendar"></i> ${formatDate(referral.referralDate)}
            </small>
          </div>
          <div class="text-end">
            <span class="status-badge status-${referral.status}">
              ${getStatusLabel(referral.status)}
            </span>
            <div class="mt-2">
              <strong>¥${referral.commission.toLocaleString()}</strong>
            </div>
          </div>
        </div>
        
        <div class="mt-3">
          <small class="text-muted">
            <i class="bi bi-tag"></i> 紹介コード: <code>${referral.referralCode}</code>
          </small>
        </div>
        
        ${referral.status === 'pending' ? `
          <div class="mt-3">
            <button class="btn btn-sm btn-outline-success me-2" onclick="updateReferralStatus('${referral.id}', 'approved')">
              承認
            </button>
            <button class="btn btn-sm btn-outline-danger" onclick="updateReferralStatus('${referral.id}', 'rejected')">
              却下
            </button>
          </div>
        ` : ''}
      </div>
    `).join('');
    
    document.getElementById('referralList').innerHTML = referralListHtml;
  }
  
  // 業種ラベルを取得
  function getStoreTypeLabel(type) {
    const labels = {
      restaurant: 'レストラン',
      cafe: 'カフェ',
      hotel: 'ホテル・宿泊施設',
      shop: 'ショップ・小売店',
      activity: 'アクティビティ・体験',
      transportation: '交通・移動',
      other: 'その他'
    };
    return labels[type] || type;
  }
  
  // ステータスラベルを取得
  function getStatusLabel(status) {
    const labels = {
      pending: '審査中',
      approved: '承認済み',
      rejected: '却下'
    };
    return labels[status] || status;
  }
  
  // 日付フォーマット
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP') + ' ' + date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
  }
  
  // 紹介リンクコピー機能
  window.copyReferralLink = function() {
    const input = document.getElementById('referralLinkInput');
    input.select();
    input.setSelectionRange(0, 99999); // モバイル対応
    
    try {
      document.execCommand('copy');
      showNotification('紹介リンクをコピーしました', 'success');
    } catch (err) {
      console.error('コピー失敗:', err);
      showNotification('コピーに失敗しました', 'error');
    }
  };
  
  // 紹介リンク共有機能
  window.shareReferralLink = function() {
    const referralLink = document.getElementById('referralLinkInput').value;
    
    if (navigator.share) {
      navigator.share({
        title: 'TomoTrip協賛店紹介',
        text: 'TomoTripの協賛店として参加しませんか？',
        url: referralLink
      }).then(() => {
        console.log('共有成功');
      }).catch((error) => {
        console.log('共有エラー:', error);
        fallbackShare(referralLink);
      });
    } else {
      fallbackShare(referralLink);
    }
  };
  
  // フォールバック共有
  function fallbackShare(link) {
    const text = `TomoTripの協賛店として参加しませんか？\n\n${link}`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        showNotification('共有用テキストをコピーしました', 'success');
      });
    } else {
      // さらなるフォールバック
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      showNotification('共有用テキストをコピーしました', 'success');
    }
  }
  
  // 紹介ステータス更新
  window.updateReferralStatus = function(referralId, newStatus) {
    const guideId = getCurrentGuideId();
    const success = window.GuideReferralManager.updateReferralStatus(guideId, referralId, newStatus);
    
    if (success) {
      showNotification(`ステータスを「${getStatusLabel(newStatus)}」に更新しました`, 'success');
      // 画面を再読み込み
      displayStatsCards();
      displayReferralHistory();
    } else {
      showNotification('ステータス更新に失敗しました', 'error');
    }
  };
  
  // 通知表示
  function showNotification(message, type = 'info') {
    // 簡単な通知実装
    const alertClass = type === 'success' ? 'alert-success' : 
                      type === 'error' ? 'alert-danger' : 'alert-info';
    
    const notification = document.createElement('div');
    notification.className = `alert ${alertClass} alert-dismissible fade show`;
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.zIndex = '9999';
    notification.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // 5秒後に自動削除
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 5000);
  }
  
  // サンプルデータ追加（デモ用）
  function addSampleReferralData() {
    const guideId = getCurrentGuideId();
    const existingData = window.GuideReferralManager.getGuideReferralData(guideId);
    
    if (existingData.referrals && existingData.referrals.length > 0) {
      return; // 既にデータがある場合はスキップ
    }
    
    // サンプル紹介データ
    const sampleReferrals = [
      {
        id: 'referral_sample_1',
        sponsorId: 'sponsor_sample_3',
        sponsorName: '東京スカイツリーカフェ',
        sponsorType: 'cafe',
        referralDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5日前
        status: 'approved',
        commission: 1200,
        referralCode: 'GUIDE_DEMO_001_SAMPLE1'
      },
      {
        id: 'referral_sample_2',
        sponsorId: 'sponsor_sample_4',
        sponsorName: '浅草体験工房',
        sponsorType: 'activity',
        referralDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2日前
        status: 'pending',
        commission: 1800,
        referralCode: 'GUIDE_DEMO_001_SAMPLE2'
      }
    ];
    
    const referralData = {
      referralCode: window.GuideReferralManager.getGuideReferralCode(guideId),
      referrals: sampleReferrals,
      totalCommission: 1200,
      createdAt: new Date().toISOString()
    };
    
    window.GuideReferralManager.saveGuideReferralData(guideId, referralData);
  }
  
  // 初期化
  document.addEventListener('DOMContentLoaded', function() {
    // デモ用ガイドIDを設定
    if (!localStorage.getItem('currentGuideId')) {
      localStorage.setItem('currentGuideId', 'guide_demo_001');
    }
    
    addSampleReferralData(); // サンプルデータ追加
    displayGuideInfo();
    displayStatsCards();
    setupReferralLink();
    displayReferralHistory();
  });
  
})();