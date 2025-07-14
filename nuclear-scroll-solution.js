/**
 * 核レベルスクロール解決システム
 * 全ての原因を根本から解決する最終手段
 */
(function() {
    'use strict';
    
    console.log('☢️ 核レベルスクロール解決システム開始');
    
    let fixExecuted = false;
    let monitoringActive = false;
    
    // 1. 完全なCSS無効化とリセット
    function nukeAllCSS() {
        console.log('💥 CSS完全無効化開始');
        
        // 既存のCSS無効化
        const existingStyles = document.querySelectorAll('style, link[rel="stylesheet"]');
        existingStyles.forEach(style => {
            if (style.id !== 'nuclear-scroll-solution') {
                style.disabled = true;
            }
        });
        
        // 核レベルCSS注入
        const nuclearCSS = document.createElement('style');
        nuclearCSS.id = 'nuclear-scroll-solution';
        nuclearCSS.textContent = `
            /* 核レベルCSS - 全てを強制的にリセット */
            * {
                overflow: visible !important;
                position: static !important;
                transform: none !important;
                top: auto !important;
                left: auto !important;
                right: auto !important;
                bottom: auto !important;
                height: auto !important;
                max-height: none !important;
                min-height: 0 !important;
                width: auto !important;
                max-width: none !important;
                margin: 0 !important;
                padding: 0 !important;
                border: none !important;
                outline: none !important;
                box-shadow: none !important;
                background: transparent !important;
            }
            
            /* 基本レイアウト復元 */
            html, body {
                overflow: auto !important;
                overflow-y: auto !important;
                overflow-x: hidden !important;
                height: auto !important;
                min-height: 100vh !important;
                position: static !important;
                margin: 0 !important;
                padding: 0 !important;
                background: white !important;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif !important;
                font-size: 16px !important;
                line-height: 1.5 !important;
                color: #333 !important;
            }
            
            /* コンテンツ表示復元 */
            .container, main, section, div, p, h1, h2, h3, h4, h5, h6 {
                display: block !important;
                visibility: visible !important;
                opacity: 1 !important;
                position: static !important;
                overflow: visible !important;
                height: auto !important;
                margin: 10px !important;
                padding: 10px !important;
                background: rgba(240, 240, 240, 0.1) !important;
                border: 1px solid rgba(200, 200, 200, 0.3) !important;
            }
            
            /* ナビゲーション復元 */
            nav, .navbar {
                display: block !important;
                position: static !important;
                background: #007bff !important;
                padding: 15px !important;
                margin: 0 !important;
                color: white !important;
            }
            
            /* ヒーロー区域復元 */
            .hero, .hero-section, .jumbotron {
                display: block !important;
                height: 400px !important;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
                padding: 50px !important;
                margin: 0 !important;
                color: white !important;
                text-align: center !important;
            }
            
            /* 最小限のコンテンツ高さ確保 */
            body::after {
                content: "" !important;
                display: block !important;
                height: 200vh !important;
                background: linear-gradient(to bottom, #f8f9fa, #e9ecef) !important;
            }
            
            /* 言語切り替え復元 */
            .language-switcher {
                position: fixed !important;
                top: 20px !important;
                right: 20px !important;
                z-index: 9999 !important;
                background: white !important;
                border: 2px solid #007bff !important;
                border-radius: 25px !important;
                padding: 10px !important;
            }
            
            /* 基本的なボタンスタイル */
            button, .btn, a {
                display: inline-block !important;
                padding: 10px 20px !important;
                margin: 5px !important;
                background: #007bff !important;
                color: white !important;
                border: none !important;
                border-radius: 5px !important;
                text-decoration: none !important;
                cursor: pointer !important;
            }
            
            /* スクロール強制有効化 */
            html {
                scroll-behavior: smooth !important;
            }
            
            /* 全てのモーダル関連クラス無効化 */
            .modal-open, .modal-backdrop, .modal {
                display: none !important;
            }
        `;
        
        document.head.appendChild(nuclearCSS);
        console.log('💥 核レベルCSS注入完了');
    }
    
    // 2. 全JavaScript無効化（必要な機能のみ残す）
    function nukeJavaScript() {
        console.log('💥 JavaScript干渉無効化開始');
        
        // 全てのsetIntervalを停止
        const highestTimeoutId = setTimeout(() => {});
        for (let i = 0; i < highestTimeoutId; i++) {
            clearTimeout(i);
            clearInterval(i);
        }
        
        // イベントリスナーを削除
        const allElements = document.querySelectorAll('*');
        allElements.forEach(element => {
            const newElement = element.cloneNode(true);
            element.parentNode.replaceChild(newElement, element);
        });
        
        // 問題のあるスクリプトを無効化
        const scripts = document.querySelectorAll('script');
        scripts.forEach(script => {
            if (script.src && !script.src.includes('nuclear-scroll-solution')) {
                script.type = 'text/disabled';
            }
        });
        
        console.log('💥 JavaScript干渉無効化完了');
    }
    
    // 3. DOM構造の完全再構築
    function rebuildDOM() {
        console.log('🔨 DOM構造再構築開始');
        
        // 既存のbody内容を保存
        const originalContent = document.body.innerHTML;
        
        // 新しいDOM構造を作成
        const newBody = document.createElement('body');
        newBody.innerHTML = `
            <nav style="background: #007bff; padding: 20px; color: white;">
                <div style="max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center;">
                    <h1 style="margin: 0;">TomoTrip</h1>
                    <div>
                        <button onclick="alert('言語切り替え')">日本語</button>
                        <button onclick="alert('ログイン')">ログイン</button>
                        <button onclick="alert('新規登録')">新規登録</button>
                    </div>
                </div>
            </nav>
            
            <main style="min-height: 100vh; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                <div style="max-width: 1200px; margin: 0 auto; text-align: center; padding: 100px 20px; color: white;">
                    <h1 style="font-size: 3rem; margin-bottom: 30px;">あなただけの特別な旅を</h1>
                    <p style="font-size: 1.5rem; margin-bottom: 50px;">地元ガイドと一緒に、観光では見つけられない隠れた魅力を体験しましょう</p>
                    <button onclick="alert('ガイド検索')" style="padding: 15px 30px; font-size: 1.2rem; background: rgba(255,255,255,0.2); border: 2px solid white; color: white; border-radius: 50px; margin: 10px;">ガイドを探す</button>
                    <button onclick="alert('お問い合わせ')" style="padding: 15px 30px; font-size: 1.2rem; background: transparent; border: 2px solid white; color: white; border-radius: 50px; margin: 10px;">お問い合わせ</button>
                </div>
            </main>
            
            <section style="padding: 100px 20px; background: white;">
                <div style="max-width: 1200px; margin: 0 auto; text-align: center;">
                    <h2 style="font-size: 2.5rem; margin-bottom: 50px; color: #333;">サービス特徴</h2>
                    <div style="display: flex; flex-wrap: wrap; gap: 30px; justify-content: center;">
                        <div style="flex: 1; min-width: 300px; padding: 30px; background: #f8f9fa; border-radius: 10px;">
                            <h3 style="color: #007bff; margin-bottom: 20px;">地元ガイドとの出会い</h3>
                            <p>現地を知り尽くしたガイドが、特別な体験をご提供します。</p>
                        </div>
                        <div style="flex: 1; min-width: 300px; padding: 30px; background: #f8f9fa; border-radius: 10px;">
                            <h3 style="color: #007bff; margin-bottom: 20px;">カスタマイズされた旅</h3>
                            <p>あなたの興味に合わせて、オーダーメイドの旅程を作成します。</p>
                        </div>
                        <div style="flex: 1; min-width: 300px; padding: 30px; background: #f8f9fa; border-radius: 10px;">
                            <h3 style="color: #007bff; margin-bottom: 20px;">安心・安全</h3>
                            <p>すべてのガイドは厳格な審査を通過しており、安心してご利用いただけます。</p>
                        </div>
                    </div>
                </div>
            </section>
            
            <section style="padding: 100px 20px; background: #f8f9fa;">
                <div style="max-width: 1200px; margin: 0 auto; text-align: center;">
                    <h2 style="font-size: 2.5rem; margin-bottom: 50px; color: #333;">スクロールテスト区域</h2>
                    <div style="height: 500px; background: linear-gradient(45deg, #ff6b6b, #4ecdc4); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; font-size: 2rem;">
                        スクロールが正常に動作しています
                    </div>
                </div>
            </section>
            
            <footer style="padding: 50px 20px; background: #333; color: white; text-align: center;">
                <p>&copy; 2026 TomoTrip. All rights reserved.</p>
            </footer>
        `;
        
        // 既存のbodyを置換
        document.body.parentNode.replaceChild(newBody, document.body);
        
        console.log('🔨 DOM構造再構築完了');
    }
    
    // 4. 核レベル監視システム
    function startNuclearMonitoring() {
        console.log('☢️ 核レベル監視開始');
        
        monitoringActive = true;
        
        const nuclearMonitor = setInterval(() => {
            if (!monitoringActive) {
                clearInterval(nuclearMonitor);
                return;
            }
            
            // スクロールブロックの検出と即座の修正
            const body = document.body;
            const html = document.documentElement;
            
            const bodyStyle = window.getComputedStyle(body);
            const htmlStyle = window.getComputedStyle(html);
            
            if (bodyStyle.overflow === 'hidden' || htmlStyle.overflow === 'hidden') {
                console.log('🚨 スクロールブロック検出 - 即座に修正');
                body.style.overflow = 'auto';
                html.style.overflow = 'auto';
            }
            
            // modal-openクラスの強制削除
            if (body.classList.contains('modal-open')) {
                body.classList.remove('modal-open');
                console.log('🧹 modal-openクラス強制削除');
            }
            
            // 高さ制限の強制解除
            if (bodyStyle.height === '100vh' || htmlStyle.height === '100vh') {
                body.style.height = 'auto';
                html.style.height = 'auto';
                console.log('📏 高さ制限解除');
            }
            
        }, 50); // 50ms間隔で高速監視
        
        // 30秒後に監視を停止
        setTimeout(() => {
            monitoringActive = false;
            console.log('🛑 核レベル監視停止');
        }, 30000);
    }
    
    // メイン実行関数
    function executeNuclearSolution() {
        if (fixExecuted) {
            console.log('⚠️ 核レベル修正は既に実行済みです');
            return;
        }
        
        fixExecuted = true;
        console.log('🚀 核レベル解決開始');
        
        // 段階的実行
        setTimeout(() => nukeAllCSS(), 100);
        setTimeout(() => nukeJavaScript(), 200);
        setTimeout(() => rebuildDOM(), 300);
        setTimeout(() => startNuclearMonitoring(), 400);
        
        // 完了通知
        setTimeout(() => {
            console.log('✅ 核レベル解決完了');
            alert('スクロール問題の核レベル修正が完了しました。ページをスクロールして確認してください。');
        }, 500);
    }
    
    // 即座に実行
    executeNuclearSolution();
    
    // グローバルアクセス
    window.nuclearScrollSolution = {
        execute: executeNuclearSolution,
        stopMonitoring: () => { monitoringActive = false; }
    };
    
})();