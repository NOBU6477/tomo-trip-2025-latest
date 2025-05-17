/**
 * 証明写真のラジオボタンを追加・修正するスクリプト
 */
(function() {
  'use strict';
  
  // DOMが読み込まれた時に実行
  document.addEventListener('DOMContentLoaded', function() {
    // モーダル表示イベントをリッスン
    document.addEventListener('shown.bs.modal', function(event) {
      const modal = event.target;
      setTimeout(function() {
        fixPhotoRadioButtons(modal);
      }, 200);
    });
    
    // 登録ボタンクリック時の処理
    document.addEventListener('click', function(event) {
      if (event.target && 
         (event.target.classList.contains('guide-register-btn') || 
          event.target.classList.contains('tourist-register-btn') ||
          (event.target.closest && (
            event.target.closest('.guide-register-btn') || 
            event.target.closest('.tourist-register-btn')
          ))
         )) {
        setTimeout(function() {
          document.querySelectorAll('.modal.show').forEach(function(modal) {
            fixPhotoRadioButtons(modal);
          });
        }, 300);
      }
    });
  });
  
  // 証明写真のラジオボタンを修正する関数
  function fixPhotoRadioButtons(modal) {
    if (!modal) return;
    
    try {
      // photo title セクションを探す
      const photoTitleSection = findPhotoTitleSection(modal);
      
      if (photoTitleSection) {
        // 証明写真タイプのh5要素を取得
        const photoTitle = photoTitleSection.querySelector('h5') || 
                          photoTitleSection.querySelector('.photo-title') ||
                          Array.from(photoTitleSection.querySelectorAll('div')).find(div => 
                            div.textContent.trim() === 'photo title' || 
                            div.textContent.trim() === '証明写真タイプ'
                          );
        
        if (photoTitle) {
          // タイトルを確実に日本語化
          photoTitle.textContent = '証明写真タイプ';
          
          // ラジオボタンのコンテナを探す
          const radioContainer = findRadioContainer(photoTitleSection);
          
          if (radioContainer) {
            // ラジオボタンの現在の状態を確認
            const hasRadios = radioContainer.querySelector('input[type="radio"]');
            
            // ラジオボタンがなければ作成する
            if (!hasRadios) {
              console.log('ラジオボタンがありません。新規作成します。');
              createRadioButtons(radioContainer);
            } else {
              // ラジオボタンがあれば、スタイルとテキストだけ修正
              console.log('既存のラジオボタンを修正します。');
              fixExistingRadioButtons(radioContainer);
            }
          } else {
            console.log('ラジオボタンのコンテナが見つかりません。');
            // コンテナが見つからない場合は、photoTitleの次の要素にラジオボタンを挿入
            const container = document.createElement('div');
            container.className = 'photo-radio-container';
            container.style.marginBottom = '15px';
            
            if (photoTitle.nextElementSibling) {
              photoTitle.parentNode.insertBefore(container, photoTitle.nextElementSibling);
            } else {
              photoTitle.parentNode.appendChild(container);
            }
            
            createRadioButtons(container);
          }
        }
      }
    } catch (error) {
      console.error('ラジオボタン修正中にエラーが発生しました:', error);
    }
  }
  
  // 証明写真タイトルセクションを探す
  function findPhotoTitleSection(modal) {
    // photo title または 証明写真タイプ のテキストを持つ要素を探す
    const titleElement = Array.from(modal.querySelectorAll('h5, div')).find(el => 
      el.textContent.trim() === 'photo title' || 
      el.textContent.trim() === '証明写真タイプ'
    );
    
    if (titleElement) {
      // 親セクションを取得（通常はdivコンテナ）
      return titleElement.closest('div') || titleElement.parentNode;
    }
    
    return null;
  }
  
  // ラジオボタンのコンテナを探す
  function findRadioContainer(section) {
    // 証明写真（1枚）または表裏写真のテキストを含む要素を探す
    const radioLabel = Array.from(section.querySelectorAll('label, div')).find(el => 
      el.textContent.includes('証明写真') || 
      el.textContent.includes('表裏写真') ||
      el.textContent.includes('photo single') ||
      el.textContent.includes('photo dual')
    );
    
    if (radioLabel) {
      return radioLabel.parentNode;
    }
    
    return null;
  }
  
  // 既存のラジオボタンを修正
  function fixExistingRadioButtons(container) {
    const labels = container.querySelectorAll('label');
    
    labels.forEach(label => {
      const radio = label.querySelector('input[type="radio"]');
      if (radio) {
        // ラジオボタンのスタイルを修正
        radio.style.marginRight = '8px';
        radio.style.cursor = 'pointer';
        
        // ラベルのテキストを修正
        const text = label.textContent.trim();
        if (text.includes('photo single') || text.includes('証明写真')) {
          // 証明写真のラベルテキストを設定
          label.innerHTML = '';
          label.appendChild(radio);
          label.appendChild(document.createTextNode('証明写真（1枚）'));
          label.style.marginRight = '15px';
          label.style.cursor = 'pointer';
        } 
        else if (text.includes('photo dual') || text.includes('表裏写真')) {
          // 表裏写真のラベルテキストを設定
          label.innerHTML = '';
          label.appendChild(radio);
          label.appendChild(document.createTextNode('表裏写真（運転免許証等）'));
          label.style.cursor = 'pointer';
        }
      }
    });
  }
  
  // ラジオボタンを新規作成
  function createRadioButtons(container) {
    // コンテナ内を空にする
    container.innerHTML = '';
    
    // 証明写真用のラジオボタン作成
    const singleRadio = document.createElement('input');
    singleRadio.type = 'radio';
    singleRadio.name = 'photoType';
    singleRadio.value = 'single';
    singleRadio.id = 'photoTypeSingle';
    singleRadio.checked = true;
    singleRadio.style.marginRight = '8px';
    singleRadio.style.cursor = 'pointer';
    
    // 証明写真用のラベル作成
    const singleLabel = document.createElement('label');
    singleLabel.htmlFor = 'photoTypeSingle';
    singleLabel.textContent = '証明写真（1枚）';
    singleLabel.style.marginRight = '15px';
    singleLabel.style.cursor = 'pointer';
    singleLabel.insertBefore(singleRadio, singleLabel.firstChild);
    
    // 表裏写真用のラジオボタン作成
    const dualRadio = document.createElement('input');
    dualRadio.type = 'radio';
    dualRadio.name = 'photoType';
    dualRadio.value = 'dual';
    dualRadio.id = 'photoTypeDual';
    dualRadio.style.marginRight = '8px';
    dualRadio.style.cursor = 'pointer';
    
    // 表裏写真用のラベル作成
    const dualLabel = document.createElement('label');
    dualLabel.htmlFor = 'photoTypeDual';
    dualLabel.textContent = '表裏写真（運転免許証等）';
    dualLabel.style.cursor = 'pointer';
    dualLabel.insertBefore(dualRadio, dualLabel.firstChild);
    
    // コンテナに追加
    container.appendChild(singleLabel);
    container.appendChild(dualLabel);
    
    // ラジオボタンの変更イベント処理
    singleRadio.addEventListener('change', function() {
      if (this.checked) {
        console.log('証明写真（1枚）が選択されました');
        togglePhotoSections(container, 'single');
      }
    });
    
    dualRadio.addEventListener('change', function() {
      if (this.checked) {
        console.log('表裏写真（運転免許証等）が選択されました');
        togglePhotoSections(container, 'dual');
      }
    });
    
    // 初期状態で証明写真セクションを表示
    setTimeout(() => togglePhotoSections(container, 'single'), 100);
  }
  
  // 写真タイプに応じてセクションの表示/非表示を切り替え
  function togglePhotoSections(container, photoType) {
    const modal = container.closest('.modal');
    if (!modal) return;
    
    try {
      // すべての写真セクションを非表示
      const photoSections = modal.querySelectorAll('.photo-section, .photo-upload-section');
      photoSections.forEach(section => {
        section.style.display = 'none';
      });
      
      // 選択されたタイプのセクションを表示
      if (photoType === 'single') {
        // 証明写真セクションを表示
        const singleSection = modal.querySelector('.photo-section-single') || 
                            modal.querySelector('.photo-section:first-of-type');
        if (singleSection) {
          singleSection.style.display = 'block';
        }
      } else if (photoType === 'dual') {
        // 表裏写真セクションを表示
        const dualSection = modal.querySelector('.photo-section-dual') || 
                           modal.querySelector('.photo-section:nth-of-type(2)');
        if (dualSection) {
          dualSection.style.display = 'block';
        }
      }
    } catch (error) {
      console.error('セクション切り替え中にエラーが発生しました:', error);
    }
  }
})();