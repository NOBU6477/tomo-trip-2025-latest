/**
 * TomoTrip協賛店ストレージ最適化システム
 * LocalStorage容量制限を回避し、スケーラブルなデータ管理を実現
 * 
 * 主な機能:
 * 1. データ分散保存（個別キー + メタデータ）
 * 2. 自動データクリーンアップ
 * 3. 画像最適化とプログレッシブ読み込み
 * 4. データ圧縮と効率的な保存
 */

class SponsorStorageManager {
    constructor() {
        this.maxStorageSize = 3 * 1024 * 1024; // 3MB制限
        this.imageCompressionQuality = 0.6;
        this.maxImageWidth = 600;
        this.maxStoresInMemory = 50; // メモリ上の最大店舗数
        this.metadataKey = 'sponsor_metadata';
        this.activeStoresKey = 'active_sponsors';
    }

    /**
     * データサイズを計算
     */
    calculateSize(data) {
        return new Blob([JSON.stringify(data)]).size;
    }

    /**
     * 画像圧縮
     */
    async compressImage(base64, maxWidth = this.maxImageWidth, quality = this.imageCompressionQuality) {
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
            img.src = base64;
        });
    }

    /**
     * 店舗データの最適化
     */
    async optimizeStoreData(storeData) {
        const optimized = { ...storeData };
        
        // 画像圧縮
        if (optimized.mainImage) {
            optimized.mainImage = await this.compressImage(optimized.mainImage, 600, 0.7);
        }
        if (optimized.logoImage) {
            optimized.logoImage = await this.compressImage(optimized.logoImage, 200, 0.8);
        }
        if (optimized.additionalImages && optimized.additionalImages.length > 0) {
            // 最大3枚まで
            optimized.additionalImages = await Promise.all(
                optimized.additionalImages.slice(0, 3).map(img => 
                    this.compressImage(img, 400, 0.6)
                )
            );
        }

        return optimized;
    }

    /**
     * メタデータ管理
     */
    getMetadata() {
        try {
            return JSON.parse(localStorage.getItem(this.metadataKey) || '{}');
        } catch {
            return {};
        }
    }

    updateMetadata(storeId, metadata) {
        const allMetadata = this.getMetadata();
        allMetadata[storeId] = {
            ...metadata,
            lastUpdated: new Date().toISOString(),
            size: this.calculateSize(metadata)
        };
        localStorage.setItem(this.metadataKey, JSON.stringify(allMetadata));
    }

    /**
     * 分散保存システム
     */
    async saveStore(storeData) {
        try {
            console.log('💾 最適化保存開始:', storeData.id);
            
            // データ最適化
            const optimized = await this.optimizeStoreData(storeData);
            
            // サイズチェック
            const storeSize = this.calculateSize(optimized);
            console.log('📊 最適化後サイズ:', (storeSize / 1024).toFixed(2), 'KB');
            
            if (storeSize > 500 * 1024) { // 500KB制限
                throw new Error('データサイズが大きすぎます（500KB制限）');
            }

            // 個別キーで保存
            const storeKey = `store_${optimized.id}`;
            localStorage.setItem(storeKey, JSON.stringify(optimized));
            
            // メタデータ更新
            this.updateMetadata(optimized.id, {
                id: optimized.id,
                storeName: optimized.storeName,
                category: optimized.category,
                status: optimized.status || 'published',
                size: storeSize
            });

            // アクティブリストに追加
            this.addToActiveList(optimized.id);
            
            console.log('✅ 分散保存完了:', optimized.id);
            return true;
            
        } catch (error) {
            console.error('❌ 保存エラー:', error.message);
            
            // 容量不足の場合、古いデータを削除
            if (error.name === 'QuotaExceededError' || error.message.includes('quota')) {
                await this.cleanupOldData();
                // 再試行
                return await this.saveStore(storeData);
            }
            
            return false;
        }
    }

    /**
     * アクティブリスト管理
     */
    addToActiveList(storeId) {
        try {
            let activeStores = JSON.parse(localStorage.getItem(this.activeStoresKey) || '[]');
            
            // 重複削除
            activeStores = activeStores.filter(id => id !== storeId);
            activeStores.unshift(storeId); // 先頭に追加
            
            // 最大50件まで
            if (activeStores.length > this.maxStoresInMemory) {
                const removed = activeStores.splice(this.maxStoresInMemory);
                // 削除された店舗のクリーンアップ
                removed.forEach(id => this.removeStore(id));
            }
            
            localStorage.setItem(this.activeStoresKey, JSON.stringify(activeStores));
        } catch (error) {
            console.error('Active list update error:', error);
        }
    }

    /**
     * 店舗データ取得
     */
    getStore(storeId) {
        try {
            const storeKey = `store_${storeId}`;
            const data = localStorage.getItem(storeKey);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Store retrieval error:', error);
            return null;
        }
    }

    /**
     * 全店舗リスト取得（メタデータベース）
     */
    getAllStores() {
        const metadata = this.getMetadata();
        const stores = [];
        
        Object.values(metadata).forEach(meta => {
            if (meta.status === 'published') {
                const storeData = this.getStore(meta.id);
                if (storeData) {
                    stores.push(storeData);
                }
            }
        });
        
        return stores.sort((a, b) => 
            new Date(b.lastUpdated || 0) - new Date(a.lastUpdated || 0)
        );
    }

    /**
     * 古いデータのクリーンアップ
     */
    async cleanupOldData() {
        console.log('🧹 データクリーンアップ開始...');
        
        try {
            const metadata = this.getMetadata();
            const activeStores = JSON.parse(localStorage.getItem(this.activeStoresKey) || '[]');
            
            // 7日以上古いデータを削除
            const cutoffDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            let cleanedCount = 0;
            
            Object.entries(metadata).forEach(([storeId, meta]) => {
                const lastUpdated = new Date(meta.lastUpdated || 0);
                if (lastUpdated < cutoffDate && !activeStores.includes(storeId)) {
                    this.removeStore(storeId);
                    cleanedCount++;
                }
            });
            
            // ドラフトデータのクリーンアップ
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith('draft_')) {
                    const draftDate = localStorage.getItem(key + '_timestamp');
                    if (!draftDate || Date.now() - parseInt(draftDate) > 3 * 24 * 60 * 60 * 1000) {
                        localStorage.removeItem(key);
                        localStorage.removeItem(key + '_timestamp');
                        cleanedCount++;
                    }
                }
            }
            
            console.log(`✅ クリーンアップ完了: ${cleanedCount}件削除`);
            return cleanedCount;
            
        } catch (error) {
            console.error('Cleanup error:', error);
            return 0;
        }
    }

    /**
     * 店舗削除
     */
    removeStore(storeId) {
        try {
            // メインデータ削除
            localStorage.removeItem(`store_${storeId}`);
            
            // メタデータから削除
            const metadata = this.getMetadata();
            delete metadata[storeId];
            localStorage.setItem(this.metadataKey, JSON.stringify(metadata));
            
            // アクティブリストから削除
            let activeStores = JSON.parse(localStorage.getItem(this.activeStoresKey) || '[]');
            activeStores = activeStores.filter(id => id !== storeId);
            localStorage.setItem(this.activeStoresKey, JSON.stringify(activeStores));
            
            console.log('🗑️ 店舗削除完了:', storeId);
            return true;
        } catch (error) {
            console.error('Store removal error:', error);
            return false;
        }
    }

    /**
     * ストレージ使用量チェック
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
            usagePercent: ((totalSize / (5 * 1024 * 1024)) * 100).toFixed(1) // 5MB想定
        };
    }

    /**
     * 初期化とマイグレーション
     */
    async initialize() {
        console.log('🔧 ストレージマネージャー初期化中...');
        
        // 既存のregisteredSponsorsから移行
        const existingData = localStorage.getItem('registeredSponsors');
        if (existingData) {
            try {
                const sponsors = JSON.parse(existingData);
                console.log(`📦 既存データ移行開始: ${sponsors.length}件`);
                
                for (const sponsor of sponsors) {
                    await this.saveStore(sponsor);
                }
                
                // 旧データをバックアップして削除
                localStorage.setItem('registeredSponsors_backup', existingData);
                localStorage.removeItem('registeredSponsors');
                
                console.log('✅ データ移行完了');
            } catch (error) {
                console.error('Migration error:', error);
            }
        }
        
        // 使用量表示
        const usage = this.getStorageUsage();
        console.log(`💾 ストレージ使用量: ${usage.totalSizeMB}MB (${usage.usagePercent}%)`);
        
        return true;
    }
}

// グローバルインスタンス
window.sponsorStorage = new SponsorStorageManager();

console.log('✅ 協賛店ストレージ最適化システム読み込み完了');