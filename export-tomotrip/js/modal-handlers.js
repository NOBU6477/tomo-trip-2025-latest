// Modal and Registration Handlers - CSP Compliant
// Moved from inline script in index.html

document.addEventListener('DOMContentLoaded', function() {
    // Registration type selection
    const touristCard = document.getElementById('touristCard');
    const guideCard = document.getElementById('guideCard');
    const registrationForm = document.getElementById('registrationForm');
    const guideSpecificFields = document.getElementById('guideSpecificFields');
    const registrationSubmitBtn = document.getElementById('registrationSubmitBtn');
    
    let selectedType = null;
    let isPhoneVerified = false;
    let registeredGuides = JSON.parse(localStorage.getItem('registeredGuides')) || [];
    
    // Profile photo preview
    const profilePhotoInput = document.getElementById('profilePhoto');
    if (profilePhotoInput) {
        profilePhotoInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            const preview = document.getElementById('profilePreview');
            const placeholder = document.getElementById('photoPlaceholder');
            
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    preview.src = e.target.result;
                    preview.style.display = 'block';
                    placeholder.style.display = 'none';
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Password visibility toggles
    const togglePassword1 = document.getElementById('togglePassword1');
    const togglePassword2 = document.getElementById('togglePassword2');
    
    if (togglePassword1) {
        togglePassword1.addEventListener('click', function() {
            const passwordField = document.getElementById('regPassword');
            const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordField.setAttribute('type', type);
            this.classList.toggle('bi-eye');
            this.classList.toggle('bi-eye-slash');
        });
    }
    
    if (togglePassword2) {
        togglePassword2.addEventListener('click', function() {
            const passwordField = document.getElementById('regPasswordConfirm');
            const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordField.setAttribute('type', type);
            this.classList.toggle('bi-eye');
            this.classList.toggle('bi-eye-slash');
        });
    }
    
    // Tourist/Guide card selection
    if (touristCard) {
        touristCard.addEventListener('click', function() {
            selectedType = 'tourist';
            this.style.border = '2px solid #007bff';
            this.style.backgroundColor = '#f8f9fa';
            if (guideCard) {
                guideCard.style.border = '2px solid #e9ecef';
                guideCard.style.backgroundColor = 'white';
            }
            if (registrationForm) {
                registrationForm.style.display = 'block';
            }
            if (guideSpecificFields) {
                guideSpecificFields.style.display = 'none';
            }
            if (registrationSubmitBtn) {
                registrationSubmitBtn.style.display = 'block';
            }
        });
    }
    
    if (guideCard) {
        guideCard.addEventListener('click', function() {
            selectedType = 'guide';
            this.style.border = '2px solid #28a745';
            this.style.backgroundColor = '#f8f9fa';
            if (touristCard) {
                touristCard.style.border = '2px solid #e9ecef';
                touristCard.style.backgroundColor = 'white';
            }
            if (registrationForm) {
                registrationForm.style.display = 'block';
            }
            if (guideSpecificFields) {
                guideSpecificFields.style.display = 'block';
            }
            if (registrationSubmitBtn) {
                registrationSubmitBtn.style.display = 'block';
            }
        });
    }
    
    // Phone verification
    const sendCodeBtn = document.getElementById('sendCodeBtn');
    if (sendCodeBtn) {
        sendCodeBtn.addEventListener('click', function() {
            const phoneNumber = document.getElementById('regPhone').value;
            if (phoneNumber && phoneNumber.length >= 10) {
                alert('認証コードを送信しました（デモ版では「123456」を入力してください）');
            } else {
                alert('正しい電話番号を入力してください');
            }
        });
    }
    
    const verifyCodeBtn = document.getElementById('verifyCodeBtn');
    if (verifyCodeBtn) {
        verifyCodeBtn.addEventListener('click', function() {
            const code = document.getElementById('verificationCode').value;
            if (code === '123456') {
                isPhoneVerified = true;
                this.textContent = '認証完了';
                this.disabled = true;
                this.classList.remove('btn-success');
                this.classList.add('btn-outline-success');
                const codeInput = document.getElementById('verificationCode');
                if (codeInput) codeInput.disabled = true;
                alert('電話番号認証が完了しました');
            } else {
                alert('認証コードが正しくありません');
            }
        });
    }
    
    // Additional handlers for form elements would go here...
    console.log('Modal handlers initialized');
});