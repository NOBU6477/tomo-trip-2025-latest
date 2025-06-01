/**
 * 最もシンプルなガイドカード翻訳システム
 * 確実に動作する最小限のコード
 */

function translateGuideCards() {
  const lang = localStorage.getItem('selectedLanguage') || 'ja';
  if (lang !== 'en') return;

  // ガイドカードの説明文を翻訳
  document.querySelectorAll('.card p, .guide-card p').forEach(desc => {
    const text = desc.textContent.trim();
    
    // 具体的な説明文パターンを翻訳
    if (text.includes('Tokyo') && text.includes('隠れた名所')) {
      desc.textContent = 'Tokyo hidden spots will be introduced. Gourmet and photography spots are specialty.';
    } else if (text.includes('History') && text.includes('伝統が息づく京都の魅力')) {
      desc.textContent = 'History and traditional culture that breathe in Kyoto charm. Traditional culture and festival experiences are specialty.';
    } else if (text.includes('Osaka') && text.includes('ならではの食べ歩き')) {
      desc.textContent = 'Osaka specialty food walks and street walks are specialty. Hidden spots known only to locals will be introduced.';
    } else if (text.includes('沖縄県の自然や文化を愛する地元ガイド')) {
      desc.textContent = 'Local guide who loves the nature and culture of Okinawa Prefecture. We especially share the charm of night tours and can also guide you to gourmet spots.';
    } else if (text.includes('生まれも育ちも京都府の地元っ子')) {
      desc.textContent = 'Born and raised in Kyoto Prefecture, a local resident. We propose plans tailored to your interests, including traditional culture and festivals.';
    } else if (text.includes('北海道在住10年以上のガイドが')) {
      desc.textContent = 'Guide with over 10 years of residence in Hokkaido will guide you to craft and souvenir places that tourists alone cannot find.';
    } else if (text.includes('石川県の魅力を知り尽くしたローカルガイドです')) {
      desc.textContent = 'Local guide who knows all the charm of Ishikawa Prefecture. We guide you to mountain climbing and trekking spots.';
    } else if (text.includes('長崎県のアクティビティに特化したツアーを提供しています')) {
      desc.textContent = 'We provide tours specializing in Nagasaki Prefecture activities. You can also enjoy nature.';
    } else if (text.includes('神奈川県の酒蔵巡りに特化したツアーを提供しています')) {
      desc.textContent = 'We provide tours specializing in sake brewery tours in Kanagawa Prefecture. You can also enjoy local sake.';
    } else if (text.includes('生まれも育ちも滋賀県の地元っ子')) {
      desc.textContent = 'Born and raised in Shiga Prefecture, a local resident. We propose plans tailored to your interests, including activities and nature.';
    } else if (text.includes('福岡県のアクティビティに特化したツアーを提供しています')) {
      desc.textContent = 'We provide tours specializing in Fukuoka Prefecture activities. You can also enjoy nature.';
    }
  });

  // ボタンテキストの翻訳
  document.querySelectorAll('.card .btn, .guide-card .btn').forEach(btn => {
    if (btn.textContent.includes('詳細を見る') || btn.textContent.includes('詳細')) {
      btn.textContent = 'See Details';
    }
  });
}

// 初回実行
document.addEventListener('DOMContentLoaded', function() {
  translateGuideCards();
});

// 言語切り替え時に実行
document.addEventListener('click', function(e) {
  if (e.target.closest('[data-lang]')) {
    setTimeout(translateGuideCards, 100);
  }
});