// Store Dashboard JavaScript
// External file to comply with CSP (Content Security Policy)

document.addEventListener('DOMContentLoaded', async function() {
    console.log('🏪 Store Dashboard Initializing...');
    
    // Check for storeId in URL parameters (from registration)
    const urlParams = new URLSearchParams(window.location.search);
    const urlStoreId = urlParams.get('storeId');
    
    // If coming from registration with storeId, load that store
    if (urlStoreId) {
        console.log('📝 Loading store from URL parameter:', urlStoreId);
        try {
            const response = await fetch(`/api/sponsor-stores/${urlStoreId}`);
            if (response.ok) {
                const storeData = await response.json();
                
                // Save to localStorage for future visits
                const storeLoginData = {
                    userType: 'store_owner',
                    storeId: storeData.id,
                    storeName: storeData.storeName,
                    email: storeData.email,
                    loginTime: new Date().toISOString()
                };
                localStorage.setItem('storeLogin', JSON.stringify(storeLoginData));
                
                // Update UI
                const storeNameElement = document.querySelector('h1');
                if (storeNameElement) {
                    storeNameElement.textContent = `${storeData.storeName} - 店舗管理画面`;
                }
                
                // Load store data
                await loadStoreData(storeData.id);
                console.log('🏪 店舗ダッシュボードが読み込まれました - ' + storeData.storeName);
                // Continue to setup event listeners below
            } else {
                throw new Error('Failed to load store data');
            }
        } catch (error) {
            console.error('Error loading store from URL:', error);
            alert('店舗データの読み込みに失敗しました。');
            window.location.href = 'index.html';
            return;
        }
    } else {
        // Otherwise, check localStorage
        const storeLogin = localStorage.getItem('storeLogin');
        
        if (!storeLogin) {
            alert('店舗管理画面にアクセスするには協賛店登録またはログインが必要です。');
            window.location.href = 'index.html';
            return;
        }
        
        try {
            const storeData = JSON.parse(storeLogin);
            if (storeData.userType !== 'store_owner') {
                alert('この画面は協賛店専用です。');
                window.location.href = 'index.html';
                return;
            }
            
            // Update store name in header if available
            const storeNameElement = document.querySelector('h1');
            if (storeNameElement && storeData.storeName) {
                storeNameElement.textContent = `${storeData.storeName} - 店舗管理画面`;
            }
            
            // Load store data from server
            if (storeData.storeId) {
                loadStoreData(storeData.storeId);
            }
            
            console.log('🏪 店舗ダッシュボードが読み込まれました - ' + storeData.storeName);
            
        } catch (error) {
            console.error('Store login data error:', error);
            localStorage.removeItem('storeLogin');
            alert('ログインデータに問題があります。再度ログインしてください。');
            window.location.href = 'index.html';
            return;
        }
    }
    
    // Setup event listeners
    setupEventListeners();
});

function setupEventListeners() {
    // プロフィール保存
    const storeProfileForm = document.getElementById('storeProfileForm');
    if (storeProfileForm) {
        storeProfileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveStoreProfile();
        });
    }
    
    // タブ切り替え時のログ
    const tabLinks = document.querySelectorAll('[data-bs-toggle="pill"]');
    tabLinks.forEach(function(tab) {
        tab.addEventListener('shown.bs.tab', function(e) {
            console.log('タブ切り替え:', e.target.id);
        });
    });
    
    // ログアウトボタンのイベントリスナーを追加
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            logout();
        });
    }
}

// Tourism guide store management functions
function addReservation() {
    const reservation = {
        date: prompt('予約日時を入力してください (例: 2024-08-30 14:00)'),
        customer: prompt('お客様名を入力してください'),
        guests: prompt('人数を入力してください'),
        contact: prompt('連絡先を入力してください')
    };
    
    if (reservation.date && reservation.customer) {
        console.log('新規予約追加:', reservation);
        alert('予約が追加されました。');
        location.reload();
    }
}

function filterReservations() {
    const filter = prompt('フィルター条件を入力してください（確定/保留中/全て）');
    console.log('Filtering reservations by:', filter);
    alert('フィルター機能は実装中です。');
}

function viewReservation(reservationId) {
    console.log('Viewing reservation:', reservationId);
    alert(`予約詳細 ${reservationId} を表示します。`);
}

function editReservation(reservationId) {
    console.log('Editing reservation:', reservationId);
    alert(`予約 ${reservationId} を編集します。`);
}

function cancelReservation(reservationId) {
    const confirmation = confirm(`予約 ${reservationId} をキャンセルしますか？`);
    if (confirmation) {
        console.log('Cancelling reservation:', reservationId);
        alert('予約がキャンセルされました。');
        location.reload();
    }
}

function viewReview(reviewId) {
    console.log('Viewing review:', reviewId);
    alert(`レビュー ${reviewId} の詳細を表示します。`);
}

function respondToReview(reviewId) {
    const response = prompt(`レビュー ${reviewId} への返信を入力してください:`);
    if (response) {
        console.log('Responding to review:', reviewId, response);
        alert('返信が送信されました。');
        location.reload();
    }
}

async function loadStoreData(storeId) {
    try {
        const response = await fetch(`/api/sponsor-stores/${storeId}`);
        if (!response.ok) {
            throw new Error('Failed to load store data');
        }
        
        const storeData = await response.json();
        console.log('📊 Store data loaded:', storeData);
        
        // Populate form fields with store data
        const formFields = {
            'storeName': storeData.storeName,
            'category': storeData.category,
            'description': storeData.description,
            'address': storeData.address,
            'phone': storeData.phone,
            'email': storeData.email,
            'openingHours': storeData.openingHours,
            'closedDays': storeData.closedDays,
            'website': storeData.website,
            'priceRange': storeData.priceRange,
            'specialties': storeData.specialties
        };
        
        // Fill in the form
        for (const [fieldId, value] of Object.entries(formFields)) {
            const field = document.getElementById(fieldId);
            if (field && value) {
                field.value = value;
            }
        }
        
    } catch (error) {
        console.error('Error loading store data:', error);
        alert('店舗データの読み込みに失敗しました。');
    }
}

async function saveStoreProfile() {
    const storeLogin = localStorage.getItem('storeLogin');
    if (!storeLogin) {
        alert('ログイン情報が見つかりません。');
        return;
    }
    
    const { storeId } = JSON.parse(storeLogin);
    
    const formData = {
        storeName: document.getElementById('storeName').value,
        category: document.getElementById('category').value,
        description: document.getElementById('description').value,
        address: document.getElementById('address').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        openingHours: document.getElementById('openingHours').value,
        closedDays: document.getElementById('closedDays').value,
        website: document.getElementById('website').value,
        priceRange: document.getElementById('priceRange').value,
        specialties: document.getElementById('specialties').value
    };
    
    try {
        const response = await fetch(`/api/sponsor-stores/${storeId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
            throw new Error('Failed to save store profile');
        }
        
        const updatedStore = await response.json();
        console.log('✅ Store profile saved:', updatedStore);
        
        // Update localStorage with new store name if changed
        if (formData.storeName !== JSON.parse(storeLogin).storeName) {
            const updatedLogin = JSON.parse(storeLogin);
            updatedLogin.storeName = formData.storeName;
            localStorage.setItem('storeLogin', JSON.stringify(updatedLogin));
            
            // Update header
            const storeNameElement = document.querySelector('h1');
            if (storeNameElement) {
                storeNameElement.textContent = `${formData.storeName} - 店舗管理画面`;
            }
        }
        
        alert('店舗プロフィールが保存されました。');
        
    } catch (error) {
        console.error('Error saving store profile:', error);
        alert('店舗プロフィールの保存に失敗しました。');
    }
}

function logout() {
    const confirmation = confirm('ログアウトしますか？');
    if (confirmation) {
        console.log('🚪 Logging out...');
        localStorage.removeItem('storeLogin');
        window.location.href = 'index.html';
    }
}
