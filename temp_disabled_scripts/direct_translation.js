/**
 * DOM要素を直接選択して日本語化するスクリプト
 */
(function() {
  // DOMが読み込まれたら実行
  document.addEventListener('DOMContentLoaded', function() {
    // モーダル表示時のイベント
    document.addEventListener('shown.bs.modal', function(e) {
      setTimeout(function() {
        translateModal(e.target);
      }, 100);
    });
    
    // クリックイベントで遅延して実行（代替手段）
    document.addEventListener('click', function(e) {
      // 登録ボタンのクリックを検出
      if (e.target && 
          (e.target.classList.contains('guide-register-btn') || 
           e.target.classList.contains('tourist-register-btn') ||
           (e.target.closest && (
             e.target.closest('.guide-register-btn') || 
             e.target.closest('.tourist-register-btn')
           ))
          )) {
        setTimeout(function() {
          // 表示中のすべてのモーダルを処理
          document.querySelectorAll('.modal.show').forEach(function(modal) {
            translateModal(modal);
          });
        }, 300);
      }
    });
  });
  
  // モーダル内の要素を直接変更
  function translateModal(modal) {
    if (!modal) return;
    
    try {
      // photo title (h5タグ)
      var photoTitle = modal.querySelector('h5');
      if (photoTitle && photoTitle.textContent.trim() === 'photo title') {
        photoTitle.textContent = '証明写真タイプ';
      }
      
      // photo description (div要素)
      var photoDesc = Array.from(modal.querySelectorAll('div')).find(function(div) {
        return div.textContent.trim() === 'photo description';
      });
      if (photoDesc) {
        photoDesc.textContent = '写真について';
      }
      
      // PHOTO SELECT (ボタン)
      var selectBtn = Array.from(modal.querySelectorAll('button')).find(function(btn) {
        return btn.textContent.includes('SELECT') || btn.textContent.includes('PHOTO SELECT');
      });
      if (selectBtn) {
        // アイコン要素を保持
        var icon = selectBtn.querySelector('i');
        if (icon) {
          selectBtn.innerHTML = icon.outerHTML + ' ファイルを選択';
        } else {
          selectBtn.innerHTML = '<i class="bi bi-file-earmark"></i> ファイルを選択';
        }
      }
      
      // PHOTO CAMERA (ボタン)
      var cameraBtn = Array.from(modal.querySelectorAll('button')).find(function(btn) {
        return btn.textContent.includes('CAMERA') || btn.textContent.includes('PHOTO CAMERA');
      });
      if (cameraBtn) {
        // アイコン要素を保持
        var icon = cameraBtn.querySelector('i');
        if (icon) {
          cameraBtn.innerHTML = icon.outerHTML + ' カメラで撮影';
        } else {
          cameraBtn.innerHTML = '<i class="bi bi-camera"></i> カメラで撮影';
        }
      }
      
      // ラジオボタンラベル
      var singleLabel = Array.from(modal.querySelectorAll('label')).find(function(label) {
        return label.textContent.trim() === 'photo single';
      });
      if (singleLabel) {
        // ラジオ入力を保持
        var radio = singleLabel.querySelector('input[type="radio"]');
        if (radio) {
          // 一時的に削除してテキストを変更してから元に戻す
          radio.remove();
          singleLabel.textContent = '証明写真（1枚）';
          singleLabel.prepend(radio);
        } else {
          singleLabel.textContent = '証明写真（1枚）';
        }
      }
      
      var dualLabel = Array.from(modal.querySelectorAll('label')).find(function(label) {
        return label.textContent.trim() === 'photo dual';
      });
      if (dualLabel) {
        // ラジオ入力を保持
        var radio = dualLabel.querySelector('input[type="radio"]');
        if (radio) {
          // 一時的に削除してテキストを変更してから元に戻す
          radio.remove();
          dualLabel.textContent = '表裏写真（運転免許証等）';
          dualLabel.prepend(radio);
        } else {
          dualLabel.textContent = '表裏写真（運転免許証等）';
        }
      }
      
      console.log('モーダル内の要素を日本語化しました');
    } catch (error) {
      console.error('翻訳処理中にエラーが発生しました:', error);
    }
  }
})();