/**
 * ガイドデータのプリロードと整合性を確保するスクリプト
 * 様々なガイドの詳細ページで共通のデータソースを使用する
 */

document.addEventListener('DOMContentLoaded', function() {
  console.log('ガイドデータローダーを初期化...');
  
  // 現在のURLからガイドIDを取得（デバッグ用）
  const urlParams = new URLSearchParams(window.location.search);
  const currentGuideId = urlParams.get('id');
  if (currentGuideId) {
    console.log(`現在のページはガイドID=${currentGuideId}の詳細ページです`);
  }
  
  // サンプルガイドデータのマスターリスト
  // ID=5と特定のガイドIDについても正確なデータを保持
  const guideMasterData = [
    {
      id: "1",
      name: "桃太郎",
      location: "岡山県 岡山市",
      languages: ["日本語", "英語"],
      fee: 6000,
      specialties: ["歴史", "寺院"],
      rating: 4.8,
      reviewCount: 25,
      bio: "こんにちは！岡山県在住の桃太郎です。岡山の魅力をご案内いたします。鬼退治のコツもお教えします！"
    },
    {
      id: "2",
      name: "浦島 太郎",
      location: "京都府 京都市",
      languages: ["日本語", "英語", "フランス語"],
      fee: 7500,
      specialties: ["伝統文化", "祭り"],
      rating: 4.5,
      reviewCount: 18,
      bio: "京都在住の浦島太郎です。古都の魅力をご案内します。竜宮城とは違った魅力をお楽しみください。"
    },
    {
      id: "3",
      name: "金太郎",
      location: "静岡県 富士市",
      languages: ["日本語", "英語"],
      fee: 8000,
      specialties: ["アクティビティ", "自然"],
      rating: 4.7,
      reviewCount: 22,
      bio: "静岡県富士市在住の金太郎です。富士山周辺の自然を満喫するアクティビティをご案内します。熊との相撲も教えられます！"
    },
    {
      id: "4",
      name: "乙姫",
      location: "沖縄県 那覇市",
      languages: ["日本語", "英語", "中国語"],
      fee: 9000,
      specialties: ["マリンスポーツ", "ビーチ"],
      rating: 4.9,
      reviewCount: 30,
      bio: "沖縄在住の乙姫です。美しい海と南国の魅力をご案内します。竜宮城の話もお聞かせします。"
    },
    {
      id: "5",
      name: "海",
      location: "沖縄県 那覇市",
      languages: ["日本語", "英語"],
      fee: 9500,
      specialties: ["ダイビング", "シュノーケリング"],
      rating: 4.6,
      reviewCount: 15,
      bio: "沖縄のダイビングインストラクター海です。透明度抜群の海で素晴らしい体験をお約束します。初心者の方も大歓迎です！",
      tourPlans: [
        {
          title: "沖縄県那覇市ダイビングツアー",
          description: "沖縄の魅力が詰まった那覇市近郊の海を潜る特別なツアーです。カラフルなサンゴ礁や熱帯魚を間近で観察できます。ダイビング初心者の方でも経験豊富なインストラクターがサポートするので安心です。",
          duration: "約4時間",
          capacity: "1〜3人",
          price: 9500,
          priceUnit: "人",
          priceNote: "機材レンタル料込み"
        },
        {
          title: "沖縄グルメ満喫ツアー",
          description: "沖縄那覇市の美味しいグルメスポットを巡るフードツアーです。地元の人だけが知る名店や、最新のトレンド店など、様々な沖縄料理を楽しむことができます。",
          duration: "約3時間",
          capacity: "1〜4人",
          price: 8000,
          priceUnit: "人",
          priceNote: "食事代3店舗分込み"
        },
        {
          title: "沖縄自然探索ツアー",
          description: "沖縄の美しい自然を探索するツアーです。地元ガイドが案内する秘密のビーチや、観光客があまり訪れない絶景スポットをご案内します。",
          duration: "約5時間",
          capacity: "1〜2人",
          price: 12000,
          priceUnit: "人",
          priceNote: "交通費・体験料込み"
        }
      ]
    },
    {
      id: "6",
      name: "山",
      location: "長野県 松本市",
      languages: ["日本語", "英語", "スペイン語"],
      fee: 8500,
      specialties: ["登山", "トレッキング"],
      rating: 4.4,
      reviewCount: 12,
      bio: "長野県在住の山です。北アルプスの魅力を存分にお伝えします。登山初心者から経験者まで、レベルに合わせたプランをご用意しています。"
    },
    {
      id: "7",
      name: "川",
      location: "岐阜県 高山市",
      languages: ["日本語", "英語"],
      fee: 7000,
      specialties: ["ラフティング", "カヤック"],
      rating: 4.3,
      reviewCount: 20,
      bio: "岐阜県で川のアクティビティを提供している川です。清流での爽快な体験をお楽しみください。"
    },
    {
      id: "8",
      name: "花",
      location: "北海道 富良野市",
      languages: ["日本語", "英語", "フランス語"],
      fee: 7500,
      specialties: ["自然", "写真スポット"],
      rating: 4.8,
      reviewCount: 28,
      bio: "北海道富良野在住の花です。季節の花々と美しい景色をご案内します。写真スポットにもご案内しますので、カメラをお持ちください。"
    },
    {
      id: "9",
      name: "月",
      location: "奈良県 奈良市",
      languages: ["日本語", "英語", "イタリア語"],
      fee: 6500,
      specialties: ["歴史", "寺院"],
      rating: 4.7,
      reviewCount: 24,
      bio: "奈良県在住の月です。古都奈良の歴史と文化をご案内します。幻想的な夜の奈良もおすすめです。"
    },
    {
      id: "10",
      name: "星",
      location: "沖縄県 石垣島",
      languages: ["日本語", "英語"],
      fee: 9000,
      specialties: ["天体観測", "アクティビティ"],
      rating: 4.9,
      reviewCount: 32,
      bio: "石垣島在住の星です。日本で最も美しい星空をご案内します。昼間は海のアクティビティもお楽しみいただけます。"
    }
  ];
  
  // ローカルストレージ内のデータを一掃（修復のため）
  function clearStoredGuideData() {
    try {
      console.log('ローカルストレージのガイドデータをクリア中...');
      // guide_で始まるキーを削除
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('guide_')) {
          console.log(`削除: ${key}`);
          localStorage.removeItem(key);
        }
      }
      
      // ガイドリストを削除
      localStorage.removeItem('guidesData');
      console.log('ローカルストレージのクリア完了');
      return true;
    } catch (e) {
      console.error('ローカルストレージクリアエラー:', e);
      return false;
    }
  }
  
  // ガイドデータをローカルストレージに保存
  function saveGuideData() {
    try {
      // まず既存データをクリア
      clearStoredGuideData();
      
      // ガイドリスト全体を保存（まずこちらを保存）
      localStorage.setItem('guidesData', JSON.stringify(guideMasterData));
      console.log('ガイドリストを保存しました');
      
      // 個別のガイドデータを保存（guide_X形式）
      guideMasterData.forEach(guide => {
        const guideKey = `guide_${guide.id}`;
        // ガイドデータを文字列化
        const guideJson = JSON.stringify(guide);
        // ローカルストレージに保存
        localStorage.setItem(guideKey, guideJson);
        console.log(`ガイドデータを保存: ${guideKey} = ${guide.name} (${guideJson.length}バイト)`);
        
        // 保存後の確認
        const savedJson = localStorage.getItem(guideKey);
        if (savedJson) {
          try {
            const savedData = JSON.parse(savedJson);
            if (savedData.name === guide.name) {
              console.log(`✓ ${guideKey}の保存確認OK`);
            } else {
              console.error(`× ${guideKey}の保存に問題あり: 名前不一致`);
            }
          } catch (parseErr) {
            console.error(`× ${guideKey}の保存に問題あり: JSON解析エラー`, parseErr);
          }
        } else {
          console.error(`× ${guideKey}の保存に失敗: データなし`);
        }
      });
      
      // 特に重要なガイドID=5を再確認
      const guide5Key = 'guide_5';
      const guide5Json = localStorage.getItem(guide5Key);
      if (guide5Json) {
        try {
          const guide5Data = JSON.parse(guide5Json);
          console.log(`最終確認 - ${guide5Key}: ${guide5Data.name} @ ${guide5Data.location}`);
        } catch (e) {
          console.error(`最終確認に失敗 - ${guide5Key}:`, e);
        }
      } else {
        console.error(`最終確認に失敗 - ${guide5Key}: データが見つかりません`);
      }
      
      return true;
    } catch (e) {
      console.error('ガイドデータ保存エラー:', e);
      return false;
    }
  }
  
  // 現在のデータを確認し、必要に応じて更新
  function checkAndUpdateGuideData() {
    console.log('ガイドデータの整合性チェックを開始...');
    
    // 全体のガイドリストを確認
    const guidesListJson = localStorage.getItem('guidesData');
    let needsUpdate = false;
    
    if (!guidesListJson) {
      console.log('ガイドリストが見つかりません。データを初期化します');
      needsUpdate = true;
    } else {
      try {
        const guidesList = JSON.parse(guidesListJson);
        console.log(`ガイドリスト: ${guidesList.length}件のデータを確認`);
        
        // ID=5のデータを特に重点的に確認
        const guide5 = guidesList.find(g => g.id === "5");
        if (!guide5) {
          console.log('ガイドID=5のデータがリストに見つかりません。更新が必要');
          needsUpdate = true;
        } else if (guide5.name !== "海") {
          console.log(`ガイドID=5の名前が不正: "${guide5.name}" (期待値: "海")`);
          needsUpdate = true;
        }
      } catch (e) {
        console.error('ガイドリストの解析エラー:', e);
        needsUpdate = true;
      }
    }
    
    // 個別のID=5のデータも確認
    const guide5Key = 'guide_5';
    const guide5Json = localStorage.getItem(guide5Key);
    
    if (!guide5Json) {
      console.log(`${guide5Key}が見つかりません。データを初期化します`);
      needsUpdate = true;
    } else {
      try {
        const guide5Data = JSON.parse(guide5Json);
        console.log(`${guide5Key}のデータを確認: ${guide5Data.name} @ ${guide5Data.location}`);
        
        if (guide5Data.name !== "海") {
          console.log(`${guide5Key}の名前が不正: "${guide5Data.name}" (期待値: "海")`);
          needsUpdate = true;
        }
        
        // ツアープランも確認
        if (!guide5Data.tourPlans || guide5Data.tourPlans.length === 0) {
          console.log(`${guide5Key}のツアープランがありません。更新が必要`);
          needsUpdate = true;
        }
      } catch (e) {
        console.error(`${guide5Key}のデータ解析エラー:`, e);
        needsUpdate = true;
      }
    }
    
    // 現在のページがガイドID=5の詳細ページなら、強制的に更新
    if (currentGuideId === '5') {
      console.log('現在ID=5のページを表示中です。確実にデータを更新します');
      needsUpdate = true;
    }
    
    // 必要に応じてデータを更新
    if (needsUpdate) {
      console.log('データの更新が必要です。ガイドデータを再構築します');
      return saveGuideData();
    } else {
      console.log('ガイドデータは正常です。更新の必要はありません');
      return false;
    }
  }
  
  // 実行
  const updated = checkAndUpdateGuideData();
  console.log(`ガイドデータの更新: ${updated ? '完了' : '不要'}`);
});