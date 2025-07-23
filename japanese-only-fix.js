// 純粋日本語版専用スクリプト - 英語混在防止システム

document.addEventListener('DOMContentLoaded', function() {
    // 英語テキストを日本語に強制変換
    const englishToJapanese = {
        'Your Special Journey Awaits': 'あなただけの特別な旅を',
        'Discover hidden gems with local guides that tourism can\'t reveal': '地元ガイドと一緒に、観光では見つけられない隠れた魅力を体験しましょう',
        'Find a Guide': 'ガイドを探す',
        'Contact Us': 'お問い合わせ',
        'Popular Guides': '人気のガイド',
        'View Details': '詳細を見る',
        'guides found': '人のガイドが見つかりました',
        'Open Filter': 'ガイドを絞り込み',
        'Home': 'ホーム',
        'Find Guides': 'ガイドを探す',
        'How to Use': '使い方',
        'Login': 'ログイン',
        'Sign Up': '新規登録',
        'Sponsor Registration': '協賛店登録',
        'Compare': '比較',
        'Bookmarks': 'ブックマーク',
        'History': '履歴'
    };

    function forceJapaneseContent() {
        // テキストノードを探してすべて日本語に変換
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        const textNodes = [];
        let node;
        while (node = walker.nextNode()) {
            textNodes.push(node);
        }

        textNodes.forEach(textNode => {
            let content = textNode.textContent;
            let originalContent = content;
            
            Object.entries(englishToJapanese).forEach(([english, japanese]) => {
                content = content.replace(new RegExp(english, 'gi'), japanese);
            });

            if (content !== originalContent) {
                textNode.textContent = content;
            }
        });

        // 特定の要素を直接修正
        const specificElements = {
            'hero-title': 'あなただけの特別な旅を',
            'hero-subtitle': '地元ガイドと一緒に、観光では見つけられない隠れた魅力を体験しましょう',
            'find-guide-btn': 'ガイドを探す',
            'contact-btn': 'お問い合わせ'
        };

        Object.entries(specificElements).forEach(([id, text]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = text;
            }
        });
    }

    // 初回実行
    forceJapaneseContent();

    // 定期的に監視（3秒間隔）
    const monitorInterval = setInterval(forceJapaneseContent, 3000);

    // 5分後に監視停止（パフォーマンス向上）
    setTimeout(() => {
        clearInterval(monitorInterval);
        console.log('日本語監視システム停止 - パフォーマンス向上のため');
    }, 300000);

    console.log('純粋日本語版システム開始');
});