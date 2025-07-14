/**
 * ユーザージャーニーマッピング
 * ユーザーの行動履歴を追跡し、パーソナライズされた表示を提供するモジュール
 */

// ユーザーの行動タイプ
const ActionTypes = {
  VIEW_PAGE: 'view_page',
  SEARCH: 'search',
  CLICK_ELEMENT: 'click_element',
  COMPLETE_PROFILE: 'complete_profile',
  UPLOAD_DOCUMENT: 'upload_document',
  VERIFY_PHONE: 'verify_phone',
  BOOK_GUIDE: 'book_guide',
  CANCEL_BOOKING: 'cancel_booking',
  COMPLETE_BOOKING: 'complete_booking',
  WRITE_REVIEW: 'write_review'
};

// ユーザーの興味や好みを保存するストレージ
class UserPreferenceStore {
  constructor() {
    this.storage = localStorage;
    this.KEY_PREFIX = 'user_journey_';
    this.JOURNEY_STATE_KEY = `${this.KEY_PREFIX}journey_state`;
    this.USER_TYPE_KEY = `${this.KEY_PREFIX}user_type`;
    
    // 初期化: ユーザージャーニー状態が存在しない場合は作成
    if (!this.getJourneyState()) {
      this.updateJourneyState({
        profileCompleted: false,
        phoneVerified: false,
        documentUploaded: false,
        documentVerified: false,
        bookingsCount: 0,
        reviewsCount: 0,
        lastUpdated: new Date().toISOString()
      });
      console.log('UserPreferenceStoreを初期化しました');
    }
  }

  // ユーザーの興味を記録
  recordInterest(category, value, weight = 1) {
    const interests = this.getInterests(category);
    
    if (interests[value]) {
      interests[value] += weight;
    } else {
      interests[value] = weight;
    }
    
    this.storage.setItem(`${this.KEY_PREFIX}${category}`, JSON.stringify(interests));
  }

  // 特定カテゴリの興味を取得
  getInterests(category) {
    const data = this.storage.getItem(`${this.KEY_PREFIX}${category}`);
    return data ? JSON.parse(data) : {};
  }

  // すべての興味を取得
  getAllInterests() {
    const interests = {};
    Object.keys(this.storage).forEach(key => {
      if (key.startsWith(this.KEY_PREFIX)) {
        const category = key.replace(this.KEY_PREFIX, '');
        interests[category] = JSON.parse(this.storage.getItem(key));
      }
    });
    return interests;
  }

  // ユーザーの直近のアクション履歴を保存
  recordAction(actionType, data) {
    const actions = this.getRecentActions();
    const newAction = {
      type: actionType,
      data: data,
      timestamp: new Date().toISOString()
    };
    
    actions.unshift(newAction);
    // 直近の20アクションまで保存
    if (actions.length > 20) {
      actions.pop();
    }
    
    this.storage.setItem(`${this.KEY_PREFIX}recent_actions`, JSON.stringify(actions));
    return newAction;
  }

  // 直近のアクション履歴を取得
  getRecentActions() {
    const data = this.storage.getItem(`${this.KEY_PREFIX}recent_actions`);
    return data ? JSON.parse(data) : [];
  }

  // ユーザーの進捗状態を更新
  updateJourneyState(state) {
    try {
      const currentState = this.getJourneyState();
      const updatedState = { ...currentState, ...state, lastUpdated: new Date().toISOString() };
      this.storage.setItem(this.JOURNEY_STATE_KEY, JSON.stringify(updatedState));
      console.log('ユーザージャーニー状態を更新しました:', updatedState);
      return updatedState;
    } catch (error) {
      console.error('ユーザージャーニー状態の更新エラー:', error);
      return state;
    }
  }

  // ユーザーの進捗状態を取得
  getJourneyState() {
    try {
      const data = this.storage.getItem(this.JOURNEY_STATE_KEY);
      if (data) {
        return JSON.parse(data);
      } else {
        // デフォルト値を設定して保存
        const defaultState = {
          profileCompleted: false,
          phoneVerified: false,
          documentUploaded: false,
          documentVerified: false,
          bookingsCount: 0,
          reviewsCount: 0,
          firstBookingDate: null,
          lastBookingDate: null,
          cities: [],
          preferredLanguages: [],
          lastUpdated: new Date().toISOString()
        };
        this.storage.setItem(this.JOURNEY_STATE_KEY, JSON.stringify(defaultState));
        return defaultState;
      }
    } catch (error) {
      console.error('ユーザージャーニー状態の取得エラー:', error);
      // エラー時はデフォルト値を返す
      return {
        profileCompleted: false,
        phoneVerified: false,
        documentUploaded: false,
        documentVerified: false,
        bookingsCount: 0,
        reviewsCount: 0,
        lastUpdated: new Date().toISOString()
      };
    }
  }

  // ユーザータイプを保存
  setUserType(type) {
    try {
      this.storage.setItem(this.USER_TYPE_KEY, JSON.stringify(type));
      console.log('ユーザータイプを設定しました:', type);
      
      // ユーザータイプが変更されたので、進捗状況を初期化
      if (type && !this.getJourneyState().lastUpdated) {
        this.updateJourneyState({
          profileCompleted: false,
          phoneVerified: false,
          documentUploaded: false,
          documentVerified: false,
          lastUpdated: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('ユーザータイプの保存に失敗しました:', error);
    }
  }

  // ユーザータイプを取得
  getUserType() {
    try {
      const storedType = this.storage.getItem(this.USER_TYPE_KEY);
      if (!storedType) return null;
      return JSON.parse(storedType);
    } catch (error) {
      console.error('ユーザータイプの取得エラー:', error);
      return null;
    }
  }

  // ストレージをクリア
  clear() {
    Object.keys(this.storage).forEach(key => {
      if (key.startsWith(this.KEY_PREFIX)) {
        this.storage.removeItem(key);
      }
    });
  }
}

// パーソナライズされた推奨を提供するエンジン
class PersonalizationEngine {
  constructor(preferenceStore) {
    this.preferenceStore = preferenceStore;
  }

  // ユーザーの行動に基づいてパーソナライズされた推奨を生成
  getPersonalizedRecommendations() {
    const userType = this.preferenceStore.getUserType();
    const journeyState = this.preferenceStore.getJourneyState();
    const interests = this.preferenceStore.getAllInterests();
    
    // レコメンデーション結果
    const recommendations = {
      nextSteps: [],
      suggestedCities: [],
      suggestedGuides: [],
      userJourneyProgress: this.calculateJourneyProgress(journeyState)
    };
    
    // ユーザータイプ別の処理
    if (userType === 'tourist') {
      // 観光客向けのレコメンデーション
      this.getRecommendationsForTourist(journeyState, interests, recommendations);
    } else if (userType === 'guide') {
      // ガイド向けのレコメンデーション
      this.getRecommendationsForGuide(journeyState, interests, recommendations);
    } else {
      // ユーザータイプが未設定の場合（新規訪問者など）
      this.getRecommendationsForNewVisitor(interests, recommendations);
    }
    
    return recommendations;
  }

  // ユーザージャーニーの進捗度を計算（0～100%）
  calculateJourneyProgress(journeyState) {
    const userType = this.preferenceStore.getUserType();
    
    if (!userType) return 0;
    
    let progress = 0;
    let totalSteps = 0;
    
    if (userType === 'tourist') {
      // 観光客のジャーニー
      const steps = [
        { completed: journeyState.profileCompleted, weight: 30 },
        { completed: journeyState.phoneVerified, weight: 20 },
        { completed: journeyState.documentUploaded, weight: 20 },
        { completed: journeyState.bookingsCount > 0, weight: 30 }
      ];
      
      totalSteps = steps.reduce((sum, step) => sum + step.weight, 0);
      progress = steps.reduce((sum, step) => sum + (step.completed ? step.weight : 0), 0);
    } else if (userType === 'guide') {
      // ガイドのジャーニー
      const steps = [
        { completed: journeyState.profileCompleted, weight: 20 },
        { completed: journeyState.phoneVerified, weight: 20 },
        { completed: journeyState.documentUploaded, weight: 20 },
        { completed: journeyState.documentVerified, weight: 20 },
        { completed: journeyState.bookingsCount > 0, weight: 20 }
      ];
      
      totalSteps = steps.reduce((sum, step) => sum + step.weight, 0);
      progress = steps.reduce((sum, step) => sum + (step.completed ? step.weight : 0), 0);
    }
    
    return totalSteps > 0 ? Math.round((progress / totalSteps) * 100) : 0;
  }

  // 観光客向けのレコメンデーション
  getRecommendationsForTourist(journeyState, interests, recommendations) {
    // 次のステップの推奨
    if (!journeyState.profileCompleted) {
      recommendations.nextSteps.push({
        message: 'プロフィールを完成させましょう',
        action: 'complete_profile',
        priority: 'high'
      });
    }
    
    if (!journeyState.phoneVerified) {
      recommendations.nextSteps.push({
        message: '電話番号を認証しましょう',
        action: 'verify_phone',
        priority: journeyState.profileCompleted ? 'high' : 'medium'
      });
    }
    
    if (!journeyState.documentUploaded) {
      recommendations.nextSteps.push({
        message: '身分証明書をアップロードして信頼性を高めましょう',
        action: 'upload_document',
        priority: journeyState.profileCompleted && journeyState.phoneVerified ? 'high' : 'medium'
      });
    } else if (journeyState.documentUploaded && !journeyState.documentVerified) {
      recommendations.nextSteps.push({
        message: '身分証明書の審査中です。もうしばらくお待ちください',
        action: '',
        priority: 'info'
      });
    }
    
    if (journeyState.profileCompleted && journeyState.phoneVerified && journeyState.bookingsCount === 0) {
      recommendations.nextSteps.push({
        message: '最初のガイド予約をしてみましょう',
        action: 'search_guides',
        priority: 'high'
      });
    }
    
    // 興味に基づいた都市の推薦
    if (interests.cities) {
      const sortedCities = Object.entries(interests.cities)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(city => city[0]);
      
      recommendations.suggestedCities = sortedCities;
    }
  }

  // ガイド向けのレコメンデーション
  getRecommendationsForGuide(journeyState, interests, recommendations) {
    // 次のステップの推奨
    if (!journeyState.profileCompleted) {
      recommendations.nextSteps.push({
        message: 'ガイドプロフィールを完成させましょう',
        action: 'complete_guide_profile',
        priority: 'high'
      });
    }
    
    if (!journeyState.phoneVerified) {
      recommendations.nextSteps.push({
        message: '電話番号を認証して信頼性を高めましょう',
        action: 'verify_phone',
        priority: journeyState.profileCompleted ? 'high' : 'medium'
      });
    }
    
    if (!journeyState.documentUploaded) {
      recommendations.nextSteps.push({
        message: '身分証明書をアップロードしましょう',
        action: 'upload_document',
        priority: journeyState.profileCompleted && journeyState.phoneVerified ? 'high' : 'medium'
      });
    } else if (journeyState.documentUploaded && !journeyState.documentVerified) {
      recommendations.nextSteps.push({
        message: '身分証明書の審査中です。承認されるとガイドとして活動できます',
        action: '',
        priority: 'info'
      });
    }
    
    // 既に同様のメッセージが表示されるため、このブロックは削除
    
    if (journeyState.profileCompleted && journeyState.phoneVerified && journeyState.documentVerified && journeyState.bookingsCount === 0) {
      recommendations.nextSteps.push({
        message: 'プロフィール写真や紹介文を魅力的にしてみましょう',
        action: 'enhance_profile',
        priority: 'medium'
      });
    }
  }

  // 新規訪問者向けのレコメンデーション
  getRecommendationsForNewVisitor(interests, recommendations) {
    recommendations.nextSteps.push({
      message: 'アカウントを作成して旅行体験を始めましょう',
      action: 'register',
      priority: 'high'
    });
    
    recommendations.nextSteps.push({
      message: '地元の知識を活かして収入を得てみませんか？',
      action: 'become_guide',
      priority: 'medium'
    });
    
    // 興味に基づいた都市の推薦（閲覧履歴がある場合）
    if (interests.cities) {
      const sortedCities = Object.entries(interests.cities)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(city => city[0]);
      
      recommendations.suggestedCities = sortedCities;
    }
  }
}

// UIレンダリングクラス
class PersonalizedUIRenderer {
  constructor(personalizationEngine) {
    this.engine = personalizationEngine;
  }

  // パーソナライズされたウェルカムセクションを描画
  renderWelcomeSection(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const recommendations = this.engine.getPersonalizedRecommendations();
    const userType = userPreferenceStore.getUserType();
    const journeyState = userPreferenceStore.getJourneyState();
    
    let welcomeHTML = '';
    
    if (userType) {
      // ログイン済みユーザー向けの表示
      const userName = getUserDisplayName();
      const progress = recommendations.userJourneyProgress;
      
      welcomeHTML = `
        <div class="personalized-welcome-card mb-4">
          <div class="card shadow-sm border-0">
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col-md-7">
                  <h3 class="welcome-title">ようこそ、${userName}さん</h3>
                  <p class="welcome-subtitle">${this.getPersonalizedMessage(userType, journeyState)}</p>
                  
                  <div class="journey-progress mb-3">
                    <label class="form-label d-flex justify-content-between mb-1">
                      <span>あなたの進捗状況</span>
                      <span>${progress}%</span>
                    </label>
                    <div class="progress" style="height: 10px;">
                      <div class="progress-bar bg-success" role="progressbar" style="width: ${progress}%" 
                        aria-valuenow="${progress}" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                  </div>
                  
                  ${this.renderNextSteps(recommendations.nextSteps)}
                </div>
                <div class="col-md-5">
                  ${this.renderJourneySummary(userType, journeyState)}
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    } else {
      // 未ログインユーザー向けの表示
      welcomeHTML = `
        <div class="personalized-welcome-card mb-4">
          <div class="card shadow-sm border-0">
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col-md-8">
                  <h3 class="welcome-title">Local Guideへようこそ</h3>
                  <p class="welcome-subtitle">現地ガイドとの特別な旅行体験を始めましょう</p>
                  
                  <div class="mt-4">
                    <a href="#" class="btn btn-primary me-2" id="welcome-register-btn">新規登録</a>
                    <a href="#" class="btn btn-outline-primary" id="welcome-login-btn">ログイン</a>
                  </div>
                </div>
                <div class="col-md-4 text-center">
                  <img src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80" class="img-fluid rounded" alt="Local Guide">
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }
    
    // 推奨都市の表示（ログインの有無にかかわらず）
    if (recommendations.suggestedCities && recommendations.suggestedCities.length > 0) {
      welcomeHTML += this.renderSuggestedCities(recommendations.suggestedCities);
    }
    
    container.innerHTML = welcomeHTML;
    
    // イベントリスナーの設定
    this.setupEventListeners(container, userType);
  }

  // ユーザータイプと状態に基づいたパーソナライズされたメッセージを生成
  getPersonalizedMessage(userType, journeyState) {
    if (userType === 'tourist') {
      if (!journeyState.profileCompleted) {
        return 'プロフィールを完成させて、あなたにぴったりのガイドを見つけましょう。';
      } else if (journeyState.bookingsCount === 0) {
        return '最初のガイド予約を通じて、特別な旅の体験を始めましょう。';
      } else {
        return '新しい都市の探索や、ガイドとの素晴らしい体験をお楽しみください。';
      }
    } else if (userType === 'guide') {
      if (!journeyState.profileCompleted) {
        return 'プロフィールを充実させて、より多くの旅行者にあなたの魅力を伝えましょう。';
      } else if (!journeyState.documentVerified) {
        return '身分証明書の認証を完了させて、信頼性を高めましょう。';
      } else if (journeyState.bookingsCount === 0) {
        return '初めての予約を受け付ける準備が整いました！プロフィールをさらに魅力的にしましょう。';
      } else {
        return 'あなたのガイドサービスが旅行者に特別な体験を提供しています。';
      }
    }
    
    return 'Local Guideで素晴らしい体験を見つけましょう。';
  }

  // 次のステップの表示
  renderNextSteps(nextSteps) {
    if (!nextSteps || nextSteps.length === 0) {
      return '';
    }
    
    let html = '<div class="next-steps mt-3"><h6>次のステップ</h6><ul class="list-group list-group-flush">';
    
    nextSteps.slice(0, 2).forEach(step => {
      const priorityClass = step.priority === 'high' ? 'text-danger' : 
                            step.priority === 'medium' ? 'text-warning' : 'text-info';
      
      html += `
        <li class="list-group-item border-0 ps-0">
          <i class="bi bi-arrow-right-circle ${priorityClass} me-2"></i>
          <a href="#" class="next-step-link" data-action="${step.action}">${step.message}</a>
        </li>
      `;
    });
    
    html += '</ul></div>';
    return html;
  }

  // ユーザージャーニーのサマリー表示
  renderJourneySummary(userType, journeyState) {
    let html = '<div class="journey-summary p-3 bg-light rounded">';
    
    if (userType === 'tourist') {
      html += `
        <h6 class="journey-summary-title mb-3">あなたの旅行ステータス</h6>
        <ul class="list-unstyled">
          <li class="mb-2">
            <i class="bi ${journeyState.profileCompleted ? 'bi-check-circle-fill text-success' : 'bi-circle text-muted'} me-2"></i>
            プロフィール完了
          </li>
          <li class="mb-2">
            <i class="bi ${journeyState.phoneVerified ? 'bi-check-circle-fill text-success' : 'bi-circle text-muted'} me-2"></i>
            電話番号認証
          </li>
          <li class="mb-2">
            <i class="bi ${journeyState.documentUploaded ? 'bi-check-circle-fill text-success' : 'bi-circle text-muted'} me-2"></i>
            身分証明書アップロード
          </li>
          <li>
            <i class="bi ${journeyState.bookingsCount > 0 ? 'bi-check-circle-fill text-success' : 'bi-circle text-muted'} me-2"></i>
            最初の予約
          </li>
        </ul>
        ${this.renderBookingStats(journeyState)}
      `;
    } else if (userType === 'guide') {
      html += `
        <h6 class="journey-summary-title mb-3">ガイドステータス</h6>
        <ul class="list-unstyled">
          <li class="mb-2">
            <i class="bi ${journeyState.profileCompleted ? 'bi-check-circle-fill text-success' : 'bi-circle text-muted'} me-2"></i>
            プロフィール完了
          </li>
          <li class="mb-2">
            <i class="bi ${journeyState.phoneVerified ? 'bi-check-circle-fill text-success' : 'bi-circle text-muted'} me-2"></i>
            電話番号認証
          </li>
          <li class="mb-2">
            <i class="bi ${journeyState.documentUploaded ? 'bi-check-circle-fill text-success' : 'bi-circle text-muted'} me-2"></i>
            身分証明書アップロード
          </li>
          <li class="mb-2">
            <i class="bi ${journeyState.documentVerified ? 'bi-check-circle-fill text-success' : journeyState.documentUploaded ? 'bi-hourglass-split text-warning' : 'bi-circle text-muted'} me-2"></i>
            身分証明書認証
          </li>
          <li>
            <i class="bi ${journeyState.bookingsCount > 0 ? 'bi-check-circle-fill text-success' : 'bi-circle text-muted'} me-2"></i>
            最初の予約受付
          </li>
        </ul>
        ${this.renderBookingStats(journeyState)}
      `;
    }
    
    html += '</div>';
    return html;
  }

  // 予約統計の表示
  renderBookingStats(journeyState) {
    if (journeyState.bookingsCount === 0) {
      return '';
    }
    
    return `
      <div class="booking-stats mt-3 pt-3 border-top">
        <div class="row g-2">
          <div class="col-6">
            <div class="stat-item text-center">
              <div class="stat-value">${journeyState.bookingsCount}</div>
              <div class="stat-label small">総予約数</div>
            </div>
          </div>
          <div class="col-6">
            <div class="stat-item text-center">
              <div class="stat-value">${journeyState.reviewsCount || 0}</div>
              <div class="stat-label small">レビュー数</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // 推奨都市の表示
  renderSuggestedCities(cities) {
    if (!cities || cities.length === 0) {
      return '';
    }
    
    let html = `
      <div class="suggested-cities-section mb-4">
        <h4 class="section-title mb-3">おすすめの都市</h4>
        <div class="row">
    `;
    
    const cityImages = {
      'tokyo': 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      'kyoto': 'https://images.unsplash.com/photo-1493997181344-a810db0630f6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      'osaka': 'https://images.unsplash.com/photo-1590559899731-a382839e5549?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      'sapporo': 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      'fukuoka': 'https://images.unsplash.com/photo-1594717527389-a590b56e8d0a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      'default': 'https://images.unsplash.com/photo-1480796927426-f609979314bd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
    };
    
    cities.forEach(city => {
      const cityImage = cityImages[city.toLowerCase()] || cityImages.default;
      
      html += `
        <div class="col-md-4">
          <div class="card h-100 city-card border-0 shadow-sm">
            <img src="${cityImage}" class="card-img-top" alt="${city}">
            <div class="card-body">
              <h5 class="card-title">${city}</h5>
              <p class="card-text">この都市のユニークな体験を発見しましょう</p>
              <a href="#" class="btn btn-sm btn-outline-primary city-explore-link" data-city="${city}">ガイドを探す</a>
            </div>
          </div>
        </div>
      `;
    });
    
    html += '</div></div>';
    return html;
  }

  // イベントリスナーのセットアップ
  setupEventListeners(container, userType) {
    // 「次のステップ」のリンククリック
    container.querySelectorAll('.next-step-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const action = e.target.getAttribute('data-action');
        this.handleNextStepAction(action);
      });
    });
    
    // 都市カードのクリック
    container.querySelectorAll('.city-explore-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const city = e.target.getAttribute('data-city');
        this.handleCityExplore(city);
      });
    });
    
    // 未ログインユーザーの場合の登録・ログインボタン
    if (!userType) {
      const registerBtn = container.querySelector('#welcome-register-btn');
      if (registerBtn) {
        registerBtn.addEventListener('click', (e) => {
          e.preventDefault();
          const modal = new bootstrap.Modal(document.getElementById('userTypeModal'));
          modal.show();
        });
      }
      
      const loginBtn = container.querySelector('#welcome-login-btn');
      if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
          e.preventDefault();
          const modal = new bootstrap.Modal(document.getElementById('loginModal'));
          modal.show();
        });
      }
    }
  }

  // 「次のステップ」アクションのハンドラ
  handleNextStepAction(action) {
    console.log(`次のステップアクション: ${action}`);
    
    switch (action) {
      case 'register':
        const userTypeModal = new bootstrap.Modal(document.getElementById('userTypeModal'));
        userTypeModal.show();
        break;
        
      case 'login':
        const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
        loginModal.show();
        break;
        
      case 'verify_phone':
        // 電話番号認証モーダルを表示
        userPreferenceStore.recordAction(ActionTypes.CLICK_ELEMENT, { element: 'verify_phone_button' });
        const phoneModal = new bootstrap.Modal(document.getElementById('phoneVerificationModal'));
        phoneModal.show();
        break;
        
      case 'upload_document':
        // 身分証明書アップロードモーダルを表示
        userPreferenceStore.recordAction(ActionTypes.CLICK_ELEMENT, { element: 'upload_document_button' });
        const docModal = new bootstrap.Modal(document.getElementById('idDocumentModal'));
        docModal.show();
        break;
        
      case 'become_guide':
        userPreferenceStore.recordAction(ActionTypes.CLICK_ELEMENT, { element: 'become_guide_button' });
        const userTypeModal2 = new bootstrap.Modal(document.getElementById('userTypeModal'));
        userTypeModal2.show();
        // ガイドボタンにフォーカス
        userTypeModal2._element.addEventListener('shown.bs.modal', () => {
          document.getElementById('guide-register-btn').focus();
        });
        break;
        
      case 'complete_profile':
      case 'complete_guide_profile':
        // プロフィールフォームに遷移
        // 現在のモックアプリでは該当フォームがないため、ユーザータイプに応じたモーダルを表示
        if (userPreferenceStore.getUserType() === 'tourist') {
          const touristModal = new bootstrap.Modal(document.getElementById('touristRegisterModal'));
          touristModal.show();
        } else {
          const guideModal = new bootstrap.Modal(document.getElementById('guideRegisterModal'));
          guideModal.show();
        }
        break;
        
      case 'search_guides':
        userPreferenceStore.recordAction(ActionTypes.CLICK_ELEMENT, { element: 'search_guides_button' });
        // 検索フォームにフォーカス
        const searchInput = document.getElementById('city-search');
        if (searchInput) {
          searchInput.scrollIntoView({ behavior: 'smooth' });
          searchInput.focus();
        }
        break;
        
      case 'enhance_profile':
        // ガイドプロフィール編集フォームに遷移
        // モックアプリでは該当フォームがないため、ガイド登録モーダルを表示
        userPreferenceStore.recordAction(ActionTypes.CLICK_ELEMENT, { element: 'enhance_profile_button' });
        const profileModal = new bootstrap.Modal(document.getElementById('guideRegisterModal'));
        profileModal.show();
        break;
        
      default:
        console.log(`未処理のアクション: ${action}`);
    }
  }

  // 都市探索のハンドラ
  handleCityExplore(city) {
    console.log(`都市を探索: ${city}`);
    userPreferenceStore.recordAction(ActionTypes.SEARCH, { city: city });
    userPreferenceStore.recordInterest('cities', city, 5);
    
    // 検索フォームに都市名を入力して検索
    const searchInput = document.getElementById('city-search');
    if (searchInput) {
      searchInput.value = city;
      searchInput.scrollIntoView({ behavior: 'smooth' });
      
      // 検索ボタンをクリック
      const searchBtn = document.getElementById('search-btn');
      if (searchBtn) {
        searchBtn.click();
      }
    }
  }
}

// ユーザー名を取得（モックデータ）
function getUserDisplayName() {
  const user = getJourneyUser();
  if (user) {
    return `${user.firstName} ${user.lastName}`;
  }
  return '田中 太郎';
}

// 現在のユーザーを取得する関数（script.jsにある関数を使用）
function getJourneyUser() {
  // グローバルのgetCurrentUser()関数を使用
  if (window.getCurrentUser && typeof window.getCurrentUser === 'function') {
    const user = window.getCurrentUser();
    if (user) return user;
  }
  
  // バックアップ実装
  const userInfo = localStorage.getItem('currentUser');
  return userInfo ? JSON.parse(userInfo) : null;
}

// スタイルを適用
function applyPersonalizedStyles() {
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    .personalized-welcome-card {
      transition: all 0.3s ease;
    }
    
    .personalized-welcome-card:hover {
      transform: translateY(-5px);
    }
    
    .welcome-title {
      font-weight: bold;
      color: #333;
    }
    
    .welcome-subtitle {
      color: #666;
    }
    
    .journey-progress .progress {
      height: 8px;
      border-radius: 4px;
      background-color: #e9ecef;
    }
    
    .journey-progress .progress-bar {
      border-radius: 4px;
    }
    
    .next-steps .list-group-item {
      padding: 0.5rem 0;
    }
    
    .next-step-link {
      color: #333;
      text-decoration: none;
    }
    
    .next-step-link:hover {
      color: #007bff;
      text-decoration: underline;
    }
    
    .journey-summary {
      background-color: #f8f9fa;
      border-radius: 0.5rem;
    }
    
    .journey-summary-title {
      font-weight: 600;
      color: #495057;
    }
    
    .booking-stats {
      color: #6c757d;
    }
    
    .stat-value {
      font-size: 1.5rem;
      font-weight: bold;
      color: #495057;
    }
    
    .city-card {
      transition: all 0.3s ease;
      overflow: visible;
    }
    
    .city-card:hover {
      transform: translateY(-5px);
    }
    
    .city-card img {
      height: 180px;
      object-fit: cover;
      transition: transform 0.5s ease;
    }
    
    .city-card:hover img {
      transform: scale(1.05);
    }
  `;
  
  document.head.appendChild(styleElement);
}

// グローバルインスタンスを作成
const userPreferenceStore = new UserPreferenceStore();
const personalizationEngine = new PersonalizationEngine(userPreferenceStore);
const personalizedUI = new PersonalizedUIRenderer(personalizationEngine);

// グローバルスコープにpersonalizedUIを公開
window.personalizedUI = personalizedUI;

// 電話認証フォームのセットアップ
function setupPhoneVerification() {
  // 認証コード送信ボタンのイベント登録
  const sendCodeBtn = document.getElementById('send-code-btn');
  if (sendCodeBtn) {
    sendCodeBtn.addEventListener('click', function() {
      const phoneNumber = document.getElementById('phone-number').value;
      
      if (!phoneNumber) {
        // 電話番号未入力
        document.getElementById('verification-error').textContent = '電話番号を入力してください。';
        document.getElementById('verification-error').classList.remove('d-none');
        return;
      }
      
      // モックでの認証コード送信成功
      // 実際にはこの部分でAPIを呼び出し、SMSで認証コードを送信
      console.log(`電話番号 ${phoneNumber} に認証コードを送信します`);
      
      // 送信ボタンを無効化（連打防止）
      sendCodeBtn.disabled = true;
      sendCodeBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> 送信中...';
      
      // 擬似的な遅延（実際はAPI呼び出し）
      setTimeout(() => {
        // 成功メッセージ
        document.getElementById('verification-success').textContent = '認証コードを送信しました。テスト環境では「123456」を使用してください。';
        document.getElementById('verification-success').classList.remove('d-none');
        document.getElementById('verification-error').classList.add('d-none');
        
        // ボタンを復活
        sendCodeBtn.disabled = false;
        sendCodeBtn.innerHTML = document.querySelector('[data-i18n="phone.sendCode"]').textContent;
        
        // 送信完了メッセージを一定時間後に非表示
        setTimeout(() => {
          document.getElementById('verification-success').classList.add('d-none');
        }, 5000);
      }, 1500);
    });
  }

  // 認証フォーム送信時の処理
  const verificationForm = document.getElementById('verification-form');
  if (verificationForm) {
    verificationForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const code = document.getElementById('verification-code').value;
      
      // テスト環境では「123456」が正しい認証コード
      if (code === '123456') {
        // 成功表示
        document.getElementById('verification-success').textContent = '電話番号が認証されました';
        document.getElementById('verification-success').classList.remove('d-none');
        document.getElementById('verification-error').classList.add('d-none');
        
        // ユーザージャーニーを更新
        const journeyState = userPreferenceStore.getJourneyState();
        journeyState.phoneVerified = true;
        journeyState.lastUpdated = new Date().toISOString();
        userPreferenceStore.updateJourneyState(journeyState);
        
        // UIを更新（少し遅延させる）
        setTimeout(() => {
          // モーダルを閉じる
          const modal = bootstrap.Modal.getInstance(document.getElementById('phoneVerificationModal'));
          if (modal) modal.hide();
          
          // ウェルカムセクションを再描画
          personalizedUI.renderWelcomeSection('personalized-welcome');
          
          // 成功メッセージ表示を初期化
          setTimeout(() => {
            document.getElementById('verification-success').classList.add('d-none');
          }, 1000);
        }, 1500);
      } else {
        // エラー表示
        document.getElementById('verification-error').textContent = '認証コードが正しくありません。123456を入力してください。';
        document.getElementById('verification-error').classList.remove('d-none');
      }
    });
  }
}

// 初期化
document.addEventListener('DOMContentLoaded', function() {
  console.log('パーソナライズされたユーザージャーニーモジュールを初期化しています');
  
  // UserPreferenceStoreインスタンスをグローバルで利用可能に
  window.userPreferenceStore = new UserPreferenceStore();
  
  // デモでは、すでにログインしている状態をシミュレート
  const mockUser = getJourneyUser();
  if (mockUser) {
    window.userPreferenceStore.setUserType(mockUser.type || 'tourist');
    
    // ユーザーの進捗状態を確認（存在しない場合は初期化）
    const journeyState = window.userPreferenceStore.getJourneyState();
    if (!journeyState.lastUpdated || new Date(journeyState.lastUpdated).getFullYear() < 2024) {
      console.log('デフォルトの進捗情報を初期化します');
      // 模擬的なユーザーの進捗状態（本来はサーバーから取得）
      const mockJourneyState = {
        profileCompleted: true,
        phoneVerified: false,
        documentUploaded: false,
        documentVerified: false,
        bookingsCount: 0,
        reviewsCount: 0,
        lastUpdated: new Date().toISOString()
      };
      
      window.userPreferenceStore.updateJourneyState(mockJourneyState);
    } else {
      console.log('既存のユーザージャーニー状態を使用します:', journeyState);
    }
  } else {
    console.log('デフォルトのテストユーザータイプを設定します');
    window.userPreferenceStore.setUserType('tourist');
  }
  
  // パーソナライズエンジンの初期化
  const personalizationEngine = new PersonalizationEngine(window.userPreferenceStore);
  window.personalizedUI = new PersonalizedUIRenderer(personalizationEngine);
  
  // 電話認証フォームのイベント登録
  setupPhoneVerification();
  
  // 都市への興味を記録（デモ用）
  userPreferenceStore.recordInterest('cities', 'Tokyo', 3);
  userPreferenceStore.recordInterest('cities', 'Kyoto', 2);
  userPreferenceStore.recordInterest('cities', 'Osaka', 1);
  
  // スタイルを適用
  applyPersonalizedStyles();
  
  // ウェルカムセクションを描画
  personalizedUI.renderWelcomeSection('personalized-welcome');
  
  // イベントリスナーの追加
  setupGlobalEventListeners();
});

// グローバルイベントリスナーの設定
function setupGlobalEventListeners() {
  // 検索ボックス入力の追跡
  const citySearch = document.getElementById('city-search');
  if (citySearch) {
    citySearch.addEventListener('input', (e) => {
      if (e.target.value.length > 2) {
        userPreferenceStore.recordInterest('search_terms', e.target.value.toLowerCase(), 1);
      }
    });
  }
  
  // 検索ボタンクリックの追跡
  const searchBtn = document.getElementById('search-btn');
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      const citySearch = document.getElementById('city-search');
      if (citySearch && citySearch.value) {
        userPreferenceStore.recordAction(ActionTypes.SEARCH, { city: citySearch.value });
        userPreferenceStore.recordInterest('cities', citySearch.value, 3);
      }
    });
  }
  
  // リンククリックの追跡
  document.addEventListener('click', (e) => {
    // ナビゲーションリンクの追跡
    if (e.target.matches('.nav-link')) {
      const navText = e.target.textContent.trim();
      userPreferenceStore.recordAction(ActionTypes.CLICK_ELEMENT, { element: 'nav_link', text: navText });
    }
    
    // ボタンクリックの追跡
    if (e.target.matches('.btn')) {
      const btnText = e.target.textContent.trim();
      userPreferenceStore.recordAction(ActionTypes.CLICK_ELEMENT, { element: 'button', text: btnText });
    }
  });
  
  // フォーム送信の追跡
  document.addEventListener('submit', (e) => {
    if (e.target.matches('form')) {
      const formId = e.target.id;
      userPreferenceStore.recordAction(ActionTypes.CLICK_ELEMENT, { element: 'form_submit', formId: formId });
      
      // ユーザータイプによる進捗状態の更新
      if (formId === 'tourist-register-form') {
        userPreferenceStore.setUserType('tourist');
        userPreferenceStore.updateJourneyState({ profileCompleted: true });
      } else if (formId === 'guide-register-form') {
        userPreferenceStore.setUserType('guide');
        userPreferenceStore.updateJourneyState({ profileCompleted: true });
      } else if (formId === 'verification-form') {
        userPreferenceStore.updateJourneyState({ phoneVerified: true });
      } else if (formId === 'document-form') {
        userPreferenceStore.updateJourneyState({ documentUploaded: true });
      }
    }
  });
}