/**
 * 最小限スポンサー修正 - 点滅なし版
 * Sign Up→新規登録変換のみ（1回実行）
 */
(function() {
    'use strict';
    
    console.log('📝 最小限修正: Sign Up→新規登録');
    
    function fixSignUpOnce() {
        // Sign Upボタンを新規登録に変換（1回のみ）
        const allElements = document.querySelectorAll('*');
        let fixed = false;
        
        allElements.forEach(element => {
            if (element.textContent && element.textContent.trim() === 'Sign Up') {
                element.textContent = '新規登録';
                fixed = true;
                console.log('✅ Sign Up→新規登録変換完了');
            }
        });
        
        if (!fixed) {
            console.log('ℹ️ Sign Upボタンは見つかりませんでした');
        }
    }
    
    // 1回だけ実行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fixSignUpOnce);
    } else {
        fixSignUpOnce();
    }
    
    console.log('✅ 最小限修正設定完了');
})();