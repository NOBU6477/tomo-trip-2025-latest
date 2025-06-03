/**
 * ガイドデータ同期システム
 * ガイドプロフィール編集と観光客向け詳細ページのデータ同期を管理
 */

/**
 * ガイドデータを保存し、複数のストレージに同期
 * @param {Object} guideData - 保存するガイドデータ
 */
function saveGuideData(guideData) {
  console.log('ガイドデータを保存中:', guideData.name);
  
  try {
    // 1. 個別ストレージに保存（詳細ページ用）
    const individualKey = `guide_${guideData.id}`;
    sessionStorage.setItem(individualKey, JSON.stringify(guideData));
    console.log(`個別ストレージに保存: ${individualKey}`);
    
    // 2. 現在のユーザーデータとして保存
    sessionStorage.setItem('currentUser', JSON.stringify(guideData));
    console.log('現在のユーザーデータを更新');
    
    // 3. ガイドリストに同期（一覧ページ用）
    syncToGuideList(guideData);
    
    // 4. ローカルストレージにも保存（永続化用）
    saveToLocalStorage(guideData);
    
    // 5. 現在表示中のガイドカードを即座に更新
    updateDisplayedGuideCards(guideData);
    
    // 6. ガイド詳細ページが表示されている場合は更新
    updateDisplayedGuideDetails(guideData);
    
    console.log('ガイドデータの保存と表示更新が完了しました');
    return true;
  } catch (error) {
    console.error('ガイドデータの保存に失敗:', error);
    return false;
  }
}

/**
 * ガイドリストにデータを同期
 * @param {Object} guideData - 同期するガイドデータ
 */
function syncToGuideList(guideData) {
  try {
    // ローカルストレージからガイドリストを取得
    const savedGuides = localStorage.getItem('userAddedGuides');
    let guidesArray = savedGuides ? JSON.parse(savedGuides) : [];
    
    // 既存のガイドを更新または新規追加
    const existingIndex = guidesArray.findIndex(guide => guide.id.toString() === guideData.id.toString());
    
    if (existingIndex !== -1) {
      // 既存データを更新
      guidesArray[existingIndex] = { ...guidesArray[existingIndex], ...guideData };
      console.log(`ガイドリスト内のデータを更新: ${guideData.name}`);
    } else {
      // 新規データを追加
      guidesArray.push(guideData);
      console.log(`ガイドリストに新規データを追加: ${guideData.name}`);
    }
    
    // 更新されたリストを保存
    localStorage.setItem('userAddedGuides', JSON.stringify(guidesArray));
    
    // ガイドデータも別途保存
    const guidesData = localStorage.getItem('guidesData');
    let guidesDataArray = guidesData ? JSON.parse(guidesData) : [];
    
    const dataIndex = guidesDataArray.findIndex(guide => guide.id.toString() === guideData.id.toString());
    if (dataIndex !== -1) {
      guidesDataArray[dataIndex] = { ...guidesDataArray[dataIndex], ...guideData };
    } else {
      guidesDataArray.push(guideData);
    }
    
    localStorage.setItem('guidesData', JSON.stringify(guidesDataArray));
    
  } catch (error) {
    console.error('ガイドリストへの同期に失敗:', error);
  }
}

/**
 * ローカルストレージに永続化保存
 * @param {Object} guideData - 保存するガイドデータ
 */
function saveToLocalStorage(guideData) {
  try {
    const localKey = `guide_profile_${guideData.id}`;
    localStorage.setItem(localKey, JSON.stringify(guideData));
    console.log(`ローカルストレージに永続化保存: ${localKey}`);
  } catch (error) {
    console.error('ローカルストレージへの保存に失敗:', error);
  }
}

/**
 * ガイドデータを取得（複数のソースから検索）
 * @param {string} guideId - 取得するガイドのID
 * @returns {Object|null} ガイドデータまたはnull
 */
function getGuideData(guideId) {
  console.log(`ガイドID ${guideId} のデータを検索中...`);
  
  // 1. セッションストレージから個別データを検索
  const individualKey = `guide_${guideId}`;
  const individualData = sessionStorage.getItem(individualKey);
  if (individualData) {
    try {
      const data = JSON.parse(individualData);
      console.log(`個別ストレージからデータを取得: ${data.name}`);
      return data;
    } catch (e) {
      console.warn('個別データの解析に失敗:', e);
    }
  }
  
  // 2. ローカルストレージのガイドリストから検索
  const savedGuides = localStorage.getItem('userAddedGuides');
  if (savedGuides) {
    try {
      const guidesArray = JSON.parse(savedGuides);
      const guide = guidesArray.find(g => g.id.toString() === guideId.toString());
      if (guide) {
        console.log(`ガイドリストからデータを取得: ${guide.name}`);
        return guide;
      }
    } catch (e) {
      console.warn('ガイドリストデータの解析に失敗:', e);
    }
  }
  
  // 3. ローカルストレージの永続化データから検索
  const localKey = `guide_profile_${guideId}`;
  const localData = localStorage.getItem(localKey);
  if (localData) {
    try {
      const data = JSON.parse(localData);
      console.log(`ローカルストレージからデータを取得: ${data.name}`);
      return data;
    } catch (e) {
      console.warn('ローカルデータの解析に失敗:', e);
    }
  }
  
  // 4. 現在のユーザーデータをチェック
  const currentUser = sessionStorage.getItem('currentUser');
  if (currentUser) {
    try {
      const userData = JSON.parse(currentUser);
      if (userData.id.toString() === guideId.toString()) {
        console.log(`現在のユーザーデータを使用: ${userData.name}`);
        return userData;
      }
    } catch (e) {
      console.warn('現在のユーザーデータの解析に失敗:', e);
    }
  }
  
  console.warn(`ガイドID ${guideId} のデータが見つかりませんでした`);
  return null;
}

/**
 * プロフィール更新時に呼び出される統合保存関数
 * @param {Object} updateData - 更新データ
 */
function updateGuideProfile(updateData) {
  // 現在のガイドデータを取得
  const currentUser = sessionStorage.getItem('currentUser');
  if (!currentUser) {
    console.error('現在のユーザーデータが見つかりません');
    return false;
  }
  
  try {
    const guideData = JSON.parse(currentUser);
    
    // データを統合
    const updatedGuideData = {
      ...guideData,
      ...updateData,
      lastUpdated: new Date().toISOString()
    };
    
    // 統合データを保存
    return saveGuideData(updatedGuideData);
    
  } catch (error) {
    console.error('プロフィール更新に失敗:', error);
    return false;
  }
}

/**
 * 現在表示されているガイドカードをリアルタイム更新
 */
function updateDisplayedGuideCards(guideData) {
  console.log('ガイドカードの表示を更新中:', guideData.name);
  
  try {
    const selectors = [
      `[data-guide-id="${guideData.id}"]`,
      `[data-id="${guideData.id}"]`,
      `.guide-card[data-guide-id="${guideData.id}"]`,
      `.swiper-slide[data-guide-id="${guideData.id}"]`
    ];
    
    selectors.forEach(selector => {
      const cards = document.querySelectorAll(selector);
      
      cards.forEach(card => {
        const nameElements = card.querySelectorAll('.guide-name, .card-title, h5, h6, .name');
        nameElements.forEach(elem => {
          if (elem) elem.textContent = guideData.name;
        });
        
        const locationElements = card.querySelectorAll('.guide-location, .location, .city, .text-muted');
        locationElements.forEach(elem => {
          if (elem && (elem.textContent.includes('都') || elem.textContent.includes('区') || elem.textContent.includes('市') || elem.classList.contains('location'))) {
            elem.textContent = guideData.location || guideData.city;
          }
        });
        
        const priceElements = card.querySelectorAll('.guide-price, .price, .fee, .session-fee');
        priceElements.forEach(elem => {
          if (elem) {
            const fee = guideData.fee || guideData.price || 6000;
            elem.textContent = `¥${fee.toLocaleString()}/セッション`;
          }
        });
        
        const bioElements = card.querySelectorAll('.guide-bio, .description, .bio');
        bioElements.forEach(elem => {
          if (elem) elem.textContent = guideData.bio || guideData.description;
        });
        
        const keywordElements = card.querySelectorAll('.guide-keywords, .keywords, .specialties');
        keywordElements.forEach(elem => {
          if (elem && guideData.keywords) {
            elem.textContent = guideData.keywords.join(', ');
          }
        });
        
        console.log(`ガイドカード「${guideData.name}」を更新しました`);
      });
    });
    
    if (window.guidesSwiper && typeof window.guidesSwiper.update === 'function') {
      window.guidesSwiper.update();
    }
    
  } catch (error) {
    console.error('ガイドカードの更新中にエラーが発生しました:', error);
  }
}

/**
 * ガイド詳細ページの表示をリアルタイム更新
 */
function updateDisplayedGuideDetails(guideData) {
  console.log('ガイド詳細ページの表示を更新中:', guideData.name);
  
  try {
    const currentUrl = window.location.href;
    if (!currentUrl.includes('guide-details.html') && !currentUrl.includes(`id=${guideData.id}`)) {
      return;
    }
    
    const nameElements = document.querySelectorAll('#guide-name, .guide-name, [data-field="name"]');
    nameElements.forEach(elem => {
      if (elem) elem.textContent = guideData.name;
    });
    
    const locationElements = document.querySelectorAll('#guide-location, .guide-location, [data-field="location"]');
    locationElements.forEach(elem => {
      if (elem) elem.textContent = guideData.location || guideData.city;
    });
    
    const bioElements = document.querySelectorAll('#guide-bio, .guide-bio, [data-field="bio"]');
    bioElements.forEach(elem => {
      if (elem) elem.textContent = guideData.bio || guideData.description;
    });
    
    const priceElements = document.querySelectorAll('#guide-price, .guide-price, [data-field="price"]');
    priceElements.forEach(elem => {
      if (elem) {
        const fee = guideData.fee || guideData.price || 6000;
        elem.textContent = `¥${fee.toLocaleString()}`;
      }
    });
    
    const specialtiesElements = document.querySelectorAll('#guide-specialties, .guide-specialties, [data-field="specialties"]');
    specialtiesElements.forEach(elem => {
      if (elem && guideData.keywords) {
        elem.innerHTML = guideData.keywords.map(keyword => 
          `<span class="badge bg-secondary me-2 mb-2">${keyword}</span>`
        ).join('');
      }
    });
    
    const languageElements = document.querySelectorAll('#guide-languages, .guide-languages, [data-field="languages"]');
    languageElements.forEach(elem => {
      if (elem && guideData.languages) {
        elem.innerHTML = guideData.languages.map(lang => 
          `<span class="badge bg-info me-2 mb-2">${lang}</span>`
        ).join('');
      }
    });
    
    console.log(`ガイド詳細ページ「${guideData.name}」を更新しました`);
    
  } catch (error) {
    console.error('ガイド詳細ページの更新中にエラーが発生しました:', error);
  }
}

// グローバルに関数をエクスポート
window.guideDataSync = {
  saveGuideData,
  getGuideData,
  updateGuideProfile,
  syncToGuideList,
  updateDisplayedGuideCards,
  updateDisplayedGuideDetails
};

console.log('ガイドデータ同期システムが初期化されました');