/**
 * 緊急ストレージ修復システム
 * 容量超過エラーの即座解決用
 */

class EmergencyStorageFix {
    constructor() {
        this.maxTotalSize = 4 * 1024 * 1024; // 4MB制限
        this.maxStoreSize = 200 * 1024; // 200KB制限（緊急時）
    }

    /**
     * 緊急修復の実行
     */
    async performEmergencyFix() {
        console.log('🆘 緊急ストレージ修復開始...');
        
        try {
            // 1. 現在の使用量確認
            const usage = this.getStorageUsage();
            console.log(`現在使用量: ${usage.totalSizeMB}MB (${usage.usagePercent}%)`);
            
            if (usage.totalSize < this.maxTotalSize * 0.8) {
                console.log('✅ 修復不要: 使用量は正常範囲内');
                return true;
            }

            // 2. 段階的クリーンアップ実行
            let cleanedItems = 0;
            
            // Step 1: ドラフトデータ全削除
            cleanedItems += this.clearAllDrafts();
            
            // Step 2: 古いregisteredSponsors削除
            cleanedItems += this.trimRegisteredSponsors();
            
            // Step 3: 古い個別store削除
            cleanedItems += this.cleanupOldStores();
            
            // Step 4: 大きすぎるデータを圧縮
            cleanedItems += await this.compressLargeStores();
            
            // 最終確認
            const finalUsage = this.getStorageUsage();
            console.log(`🎯 修復完了: ${finalUsage.totalSizeMB}MB (${cleanedItems}件処理)`);
            
            return finalUsage.totalSize < this.maxTotalSize * 0.9;
            
        } catch (error) {
            console.error('緊急修復エラー:', error);
            return false;
        }
    }

    /**
     * 全ドラフトデータを削除
     */
    clearAllDrafts() {
        let count = 0;
        const keys = Object.keys(localStorage);
        
        keys.forEach(key => {
            if (key.startsWith('draft_') || key.includes('_timestamp')) {
                localStorage.removeItem(key);
                count++;
            }
        });
        
        console.log(`🗑️ ドラフトデータ削除: ${count}件`);
        return count;
    }

    /**
     * registeredSponsorsを最新5件のみに削減
     */
    trimRegisteredSponsors() {
        try {
            const sponsors = JSON.parse(localStorage.getItem('registeredSponsors') || '[]');
            
            if (sponsors.length <= 5) {
                return 0;
            }
            
            // 最新5件のみ保持
            const sortedSponsors = sponsors.sort((a, b) => 
                new Date(b.lastUpdated || 0) - new Date(a.lastUpdated || 0)
            );
            const keepSponsors = sortedSponsors.slice(0, 5);
            
            localStorage.setItem('registeredSponsors', JSON.stringify(keepSponsors));
            
            const removed = sponsors.length - 5;
            console.log(`📋 registeredSponsors削減: ${removed}件削除`);
            return removed;
            
        } catch (error) {
            console.error('registeredSponsors削減エラー:', error);
            return 0;
        }
    }

    /**
     * 古い個別store_データを削除
     */
    cleanupOldStores() {
        let count = 0;
        const keys = Object.keys(localStorage);
        const storeKeys = keys.filter(key => key.startsWith('store_'));
        
        // 最新10件以外を削除
        if (storeKeys.length > 10) {
            const storesToRemove = storeKeys.slice(10);
            storesToRemove.forEach(key => {
                localStorage.removeItem(key);
                count++;
            });
        }
        
        console.log(`🏪 古い店舗データ削除: ${count}件`);
        return count;
    }

    /**
     * 大きすぎるデータを圧縮
     */
    async compressLargeStores() {
        let count = 0;
        const keys = Object.keys(localStorage);
        
        for (const key of keys) {
            if (key.startsWith('store_')) {
                try {
                    const data = localStorage.getItem(key);
                    const size = new Blob([data]).size;
                    
                    if (size > this.maxStoreSize) {
                        const storeData = JSON.parse(data);
                        const compressed = await this.aggressiveCompress(storeData);
                        
                        localStorage.setItem(key, JSON.stringify(compressed));
                        count++;
                        
                        console.log(`🔄 圧縮完了: ${key} (${(size/1024).toFixed(2)}KB → ${(new Blob([JSON.stringify(compressed)]).size/1024).toFixed(2)}KB)`);
                    }
                } catch (error) {
                    console.error(`圧縮エラー ${key}:`, error);
                    // エラーの場合は削除
                    localStorage.removeItem(key);
                    count++;
                }
            }
        }
        
        console.log(`📦 大容量データ圧縮: ${count}件`);
        return count;
    }

    /**
     * 積極的データ圧縮
     */
    async aggressiveCompress(storeData) {
        const compressed = { ...storeData };
        
        // 画像を超圧縮
        if (compressed.mainImage && compressed.mainImage.startsWith('data:image/')) {
            compressed.mainImage = await this.ultraCompressImage(compressed.mainImage, 200, 0.3);
        }
        
        if (compressed.logoImage && compressed.logoImage.startsWith('data:image/')) {
            compressed.logoImage = await this.ultraCompressImage(compressed.logoImage, 80, 0.4);
        }
        
        // 追加画像は削除
        compressed.additionalImages = [];
        
        // 不要なフィールド削除
        delete compressed.detailedDescription;
        delete compressed.specialty;
        delete compressed.atmosphere;
        delete compressed.detailedDiscount;
        
        return compressed;
    }

    /**
     * 超圧縮画像処理
     */
    async ultraCompressImage(base64, maxWidth, quality) {
        if (!base64 || !base64.startsWith('data:image/')) {
            return base64;
        }

        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                let { width, height } = img;
                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }
                
                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);
                
                canvas.toBlob((blob) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.readAsDataURL(blob);
                }, 'image/jpeg', quality);
            };
            img.onerror = () => resolve(''); // エラー時は空文字
            img.src = base64;
        });
    }

    /**
     * ストレージ使用量計算
     */
    getStorageUsage() {
        let totalSize = 0;
        let itemCount = 0;
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const value = localStorage.getItem(key);
            totalSize += new Blob([key + value]).size;
            itemCount++;
        }
        
        return {
            totalSize,
            totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2),
            itemCount,
            usagePercent: ((totalSize / (5 * 1024 * 1024)) * 100).toFixed(1)
        };
    }

    /**
     * 自動修復の実行
     */
    static async autoFix() {
        const fixer = new EmergencyStorageFix();
        return await fixer.performEmergencyFix();
    }
}

// グローバルアクセス用
window.EmergencyStorageFix = EmergencyStorageFix;

console.log('🆘 緊急ストレージ修復システム読み込み完了');
console.log('使用方法: EmergencyStorageFix.autoFix() でワンクリック修復');