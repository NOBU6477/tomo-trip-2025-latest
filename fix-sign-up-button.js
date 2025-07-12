/**
 * Sign Upボタンを新規登録に修正し、右側ボタンのスタイルを改善
 */
(function() {
    console.log('Sign Up修正スクリプト開始');
    
    function fixSignUpButton() {
        // 1. すべてのSign Upテキストを新規登録に変更
        const textElements = document.querySelectorAll('*');
        textElements.forEach(element => {
            if (element.children.length === 0 && element.textContent && element.textContent.trim() === 'Sign Up') {
                console.log('Sign Upボタンを発見、修正中:', element);
                element.textContent = '新規登録';
            }
        });
        
        // 2. 右側のボタンエリアを改善
        addRightSideButtons();
    }
    
    function addRightSideButtons() {
        // 既存の右側ボタンを削除
        const existingButtons = document.querySelectorAll('.sponsor-mini-buttons');
        existingButtons.forEach(btn => btn.remove());
        
        // 新しいスタイルのボタンエリアを作成
        const buttonArea = document.createElement('div');
        buttonArea.style.cssText = `
            position: fixed;
            top: 50%;
            right: 20px;
            transform: translateY(-50%);
            z-index: 1000;
            display: flex;
            flex-direction: column;
            gap: 15px;
        `;
        
        // 協賛店登録ボタン
        const registerBtn = document.createElement('button');
        registerBtn.innerHTML = `
            <i class="bi bi-shop"></i>
            <span>協賛店登録</span>
        `;
        registerBtn.style.cssText = `
            background: linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%);
            border: none;
            color: white;
            padding: 12px 20px;
            border-radius: 25px;
            font-weight: 600;
            box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
            transition: all 0.3s ease;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
            white-space: nowrap;
        `;
        
        // ログインボタン
        const loginBtn = document.createElement('button');
        loginBtn.innerHTML = `
            <i class="bi bi-box-arrow-in-right"></i>
            <span>ログイン</span>
        `;
        loginBtn.style.cssText = `
            background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
            border: none;
            color: white;
            padding: 12px 20px;
            border-radius: 25px;
            font-weight: 600;
            box-shadow: 0 4px 15px rgba(78, 205, 196, 0.3);
            transition: all 0.3s ease;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
            white-space: nowrap;
        `;
        
        // ホバー効果を追加
        registerBtn.addEventListener('mouseenter', () => {
            registerBtn.style.transform = 'translateY(-2px)';
            registerBtn.style.boxShadow = '0 6px 20px rgba(255, 107, 107, 0.4)';
        });
        
        registerBtn.addEventListener('mouseleave', () => {
            registerBtn.style.transform = 'translateY(0)';
            registerBtn.style.boxShadow = '0 4px 15px rgba(255, 107, 107, 0.3)';
        });
        
        loginBtn.addEventListener('mouseenter', () => {
            loginBtn.style.transform = 'translateY(-2px)';
            loginBtn.style.boxShadow = '0 6px 20px rgba(78, 205, 196, 0.4)';
        });
        
        loginBtn.addEventListener('mouseleave', () => {
            loginBtn.style.transform = 'translateY(0)';
            loginBtn.style.boxShadow = '0 4px 15px rgba(78, 205, 196, 0.3)';
        });
        
        // クリックイベント
        registerBtn.addEventListener('click', () => {
            alert('協賛店登録機能は開発中です');
        });
        
        loginBtn.addEventListener('click', () => {
            alert('ログイン機能は開発中です');
        });
        
        buttonArea.appendChild(registerBtn);
        buttonArea.appendChild(loginBtn);
        document.body.appendChild(buttonArea);
        
        console.log('右側ボタンエリアを追加しました');
    }
    
    // 実行
    fixSignUpButton();
    
    // 定期的にチェック
    setInterval(fixSignUpButton, 2000);
    
    console.log('Sign Up修正スクリプト完了');
})();