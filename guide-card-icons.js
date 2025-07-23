// ガイドカードにブックマーク・比較ボタンを追加するシステム

(function() {
    'use strict';
    
    console.log('ガイドカードアイコンシステム開始');
    
    function addIconsToGuideCards() {
        const guideCards = document.querySelectorAll('.guide-card');
        
        guideCards.forEach((card, index) => {
            // 既にアイコンが追加されている場合はスキップ
            if (card.querySelector('.guide-card-icons')) {
                return;
            }
            
            // ガイド情報を取得
            const nameElement = card.querySelector('h5');
            const locationElement = card.querySelector('.text-muted');
            const priceElement = card.querySelector('.text-primary');
            
            if (!nameElement || !locationElement || !priceElement) {
                return;
            }
            
            const guideData = {
                id: index,
                name: nameElement.textContent.trim(),
                location: locationElement.textContent.trim(),
                price: priceElement.textContent.replace('¥', '').replace(',', '').trim()
            };
            
            // アイコンコンテナを作成
            const iconsContainer = document.createElement('div');
            iconsContainer.className = 'guide-card-icons';
            iconsContainer.style.cssText = `
                position: absolute;
                top: 10px;
                right: 10px;
                display: flex;
                gap: 5px;
                z-index: 10;
            `;
            
            // ブックマークボタン
            const bookmarkBtn = document.createElement('button');
            bookmarkBtn.className = 'bookmark-btn btn btn-sm';
            bookmarkBtn.innerHTML = '⭐';
            bookmarkBtn.style.cssText = `
                background: rgba(255, 193, 7, 0.9);
                border: 2px solid #ffc107;
                border-radius: 50%;
                width: 35px;
                height: 35px;
                color: white;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 2px 8px rgba(255, 193, 7, 0.4);
            `;
            
            bookmarkBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                toggleBookmark(guideData, this);
            });
            
            bookmarkBtn.addEventListener('mouseover', function() {
                this.style.transform = 'scale(1.1)';
                this.style.boxShadow = '0 4px 12px rgba(255, 193, 7, 0.6)';
            });
            
            bookmarkBtn.addEventListener('mouseout', function() {
                this.style.transform = 'scale(1)';
                this.style.boxShadow = '0 2px 8px rgba(255, 193, 7, 0.4)';
            });
            
            // 比較ボタン
            const compareBtn = document.createElement('button');
            compareBtn.className = 'compare-btn btn btn-sm';
            compareBtn.innerHTML = '✓';
            compareBtn.style.cssText = `
                background: rgba(40, 167, 69, 0.9);
                border: 2px solid #28a745;
                border-radius: 50%;
                width: 35px;
                height: 35px;
                color: white;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 2px 8px rgba(40, 167, 69, 0.4);
            `;
            
            compareBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                toggleComparison(guideData, this);
            });
            
            compareBtn.addEventListener('mouseover', function() {
                this.style.transform = 'scale(1.1)';
                this.style.boxShadow = '0 4px 12px rgba(40, 167, 69, 0.6)';
            });
            
            compareBtn.addEventListener('mouseout', function() {
                this.style.transform = 'scale(1)';
                this.style.boxShadow = '0 2px 8px rgba(40, 167, 69, 0.4)';
            });
            
            // アイコンを追加
            iconsContainer.appendChild(bookmarkBtn);
            iconsContainer.appendChild(compareBtn);
            
            // カードを相対位置に設定
            card.style.position = 'relative';
            card.appendChild(iconsContainer);
            
            // 初期状態を設定
            updateButtonStates(guideData, bookmarkBtn, compareBtn);
        });
    }
    
    function toggleBookmark(guideData, button) {
        const bookmarkList = JSON.parse(localStorage.getItem('bookmarkList') || '[]');
        const existingIndex = bookmarkList.findIndex(item => item.name === guideData.name);
        
        if (existingIndex >= 0) {
            // 削除
            bookmarkList.splice(existingIndex, 1);
            button.style.background = 'rgba(255, 193, 7, 0.9)';
            button.style.transform = 'scale(0.8)';
            setTimeout(() => {
                button.style.transform = 'scale(1)';
            }, 150);
        } else {
            // 追加
            bookmarkList.push({
                ...guideData,
                bookmarkedAt: new Date().toLocaleString('ja-JP')
            });
            button.style.background = 'rgba(255, 193, 7, 1)';
            button.style.transform = 'scale(1.2)';
            setTimeout(() => {
                button.style.transform = 'scale(1)';
            }, 150);
        }
        
        localStorage.setItem('bookmarkList', JSON.stringify(bookmarkList));
        
        // カウンター更新
        if (window.updateBookmarkCounter) {
            window.updateBookmarkCounter();
        }
        
        console.log('ブックマーク更新:', bookmarkList.length, '件');
    }
    
    function toggleComparison(guideData, button) {
        const comparisonList = JSON.parse(localStorage.getItem('comparisonList') || '[]');
        const existingIndex = comparisonList.findIndex(item => item.name === guideData.name);
        
        if (existingIndex >= 0) {
            // 削除
            comparisonList.splice(existingIndex, 1);
            button.style.background = 'rgba(40, 167, 69, 0.9)';
            button.style.transform = 'scale(0.8)';
            setTimeout(() => {
                button.style.transform = 'scale(1)';
            }, 150);
        } else {
            // 追加（最大3人まで）
            if (comparisonList.length >= 3) {
                alert('比較できるのは最大3人までです。他のガイドを削除してから追加してください。');
                return;
            }
            
            comparisonList.push({
                ...guideData,
                comparedAt: new Date().toLocaleString('ja-JP')
            });
            button.style.background = 'rgba(40, 167, 69, 1)';
            button.style.transform = 'scale(1.2)';
            setTimeout(() => {
                button.style.transform = 'scale(1)';
            }, 150);
        }
        
        localStorage.setItem('comparisonList', JSON.stringify(comparisonList));
        
        // カウンター更新
        if (window.updateComparisonCounter) {
            window.updateComparisonCounter();
        }
        
        console.log('比較リスト更新:', comparisonList.length, '件');
    }
    
    function updateButtonStates(guideData, bookmarkBtn, compareBtn) {
        const bookmarkList = JSON.parse(localStorage.getItem('bookmarkList') || '[]');
        const comparisonList = JSON.parse(localStorage.getItem('comparisonList') || '[]');
        
        // ブックマーク状態
        const isBookmarked = bookmarkList.some(item => item.name === guideData.name);
        if (isBookmarked) {
            bookmarkBtn.style.background = 'rgba(255, 193, 7, 1)';
            bookmarkBtn.style.boxShadow = '0 0 15px rgba(255, 193, 7, 0.8)';
        }
        
        // 比較リスト状態
        const isInComparison = comparisonList.some(item => item.name === guideData.name);
        if (isInComparison) {
            compareBtn.style.background = 'rgba(40, 167, 69, 1)';
            compareBtn.style.boxShadow = '0 0 15px rgba(40, 167, 69, 0.8)';
        }
    }
    
    // 定期的にアイコンを追加
    function monitorGuideCards() {
        addIconsToGuideCards();
        setTimeout(monitorGuideCards, 2000);
    }
    
    // 初期化
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(addIconsToGuideCards, 1000);
        monitorGuideCards();
    });
    
    // 即座に実行
    setTimeout(addIconsToGuideCards, 500);
    
})();