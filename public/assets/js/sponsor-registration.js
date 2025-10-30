// Sponsor Registration JavaScript
// External file to comply with CSP (Content Security Policy)

document.addEventListener('DOMContentLoaded', function() {
    console.log('📝 Sponsor Registration Initializing...');
    
    // Setup form submission handler
    const registrationForm = document.getElementById('sponsorRegistrationForm');
    if (registrationForm) {
        registrationForm.addEventListener('submit', handleRegistrationSubmit);
        console.log('✅ Form submit handler registered');
    } else {
        console.error('❌ Form not found: sponsorRegistrationForm');
    }
    
    // Setup home button handler
    const homeButton = document.getElementById('homeButton');
    if (homeButton) {
        homeButton.addEventListener('click', function() {
            // Detect language from current page
            const isEnglish = window.location.pathname.includes('-en.html');
            window.location.href = isEnglish ? 'index-en.html' : 'index.html';
        });
    }
});

async function handleRegistrationSubmit(e) {
    e.preventDefault();
    
    console.log('📤 Submitting sponsor registration...');
    
    const formData = {
        storeName: document.getElementById('storeName').value,
        category: document.getElementById('category').value,
        description: document.getElementById('description').value || '',
        address: document.getElementById('address').value || '',
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        isActive: true,
        registrationDate: new Date().toISOString()
    };
    
    try {
        const response = await fetch('/api/sponsor-stores', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
            
            if (response.status === 409) {
                throw new Error('このメールアドレスは既に登録されています。別のメールアドレスをご使用ください。');
            }
            
            throw new Error(errorData.error || '登録処理中にエラーが発生しました。もう一度お試しください。');
        }
        
        const storeData = await response.json();
        console.log('✅ Registration successful:', storeData);
        
        // Store login session with actual store data from database
        localStorage.setItem('storeLogin', JSON.stringify({
            storeId: storeData.id,
            storeName: storeData.storeName,
            email: storeData.email,
            userType: 'store_owner',
            loginTime: new Date().toISOString()
        }));
        
        // Show success modal
        showSuccessModal(storeData);
        
    } catch (error) {
        console.error('❌ Registration error:', error);
        alert(error.message);
    }
}

function showSuccessModal(storeData) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('successModal');
    if (!modal) {
        const modalHTML = `
            <div class="modal fade" id="successModal" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content" style="border: none; border-radius: 20px; overflow: hidden;">
                        <div class="modal-body p-0">
                            <div style="background: linear-gradient(135deg, #28a745, #20c997); padding: 3rem 2rem; text-align: center;">
                                <div style="background: rgba(255,255,255,0.2); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 1.5rem; display: flex; align-items: center; justify-content: center;">
                                    <i class="bi bi-check-circle" style="font-size: 3rem; color: white;"></i>
                                </div>
                                <h4 class="text-white mb-3" style="font-weight: 700;">登録完了！</h4>
                                <p class="text-white mb-2" style="font-size: 1.1rem; font-weight: 600;" id="modalStoreName"></p>
                                <p class="mb-4 text-white" style="font-size: 0.95rem;" id="modalStoreId"></p>
                                
                                <div class="d-grid gap-3 mt-4">
                                    <button class="btn btn-light btn-lg" id="goToDashboardBtn" style="border-radius: 15px; font-weight: 600; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                                        <i class="bi bi-speedometer2 me-2"></i>店舗管理画面へ
                                    </button>
                                    <button class="btn btn-outline-light btn-lg" id="goToSponsorListBtn" style="border-radius: 15px; font-weight: 600; border: 2px solid white;">
                                        <i class="bi bi-shop me-2"></i>協賛店一覧を見る
                                    </button>
                                    <button class="btn btn-outline-light" id="goToHomeBtn" style="border-radius: 15px; border: 2px solid white;">
                                        <i class="bi bi-house me-2"></i>ホームへ戻る
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        modal = document.getElementById('successModal');
    }
    
    // Update modal content
    document.getElementById('modalStoreName').textContent = storeData.storeName;
    document.getElementById('modalStoreId').textContent = `店舗ID: ${storeData.id.substring(0,8)}...`;
    
    // Setup button event listeners
    const dashboardBtn = document.getElementById('goToDashboardBtn');
    const sponsorListBtn = document.getElementById('goToSponsorListBtn');
    const homeBtn = document.getElementById('goToHomeBtn');
    
    if (dashboardBtn) {
        // Remove any existing listeners
        const newDashboardBtn = dashboardBtn.cloneNode(true);
        dashboardBtn.parentNode.replaceChild(newDashboardBtn, dashboardBtn);
        
        newDashboardBtn.addEventListener('click', function() {
            window.location.href = `store-dashboard.html?storeId=${storeData.id}`;
        });
    }
    
    if (sponsorListBtn) {
        const newSponsorListBtn = sponsorListBtn.cloneNode(true);
        sponsorListBtn.parentNode.replaceChild(newSponsorListBtn, sponsorListBtn);
        
        newSponsorListBtn.addEventListener('click', function() {
            window.location.href = 'sponsor-list.html';
        });
    }
    
    if (homeBtn) {
        const newHomeBtn = homeBtn.cloneNode(true);
        homeBtn.parentNode.replaceChild(newHomeBtn, homeBtn);
        
        newHomeBtn.addEventListener('click', function() {
            window.location.href = 'index.html';
        });
    }
    
    // Show the modal
    const bootstrapModal = new bootstrap.Modal(modal);
    bootstrapModal.show();
}
