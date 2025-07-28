// Guide Data Loader for Edit Page
// Loads current guide data from localStorage and populates the edit form

document.addEventListener('DOMContentLoaded', function() {
    console.log('Guide edit page loading...');
    
    // Get current guide ID from localStorage
    const currentGuideId = localStorage.getItem('currentGuideId');
    
    if (!currentGuideId) {
        console.log('No current guide ID found, redirecting to home page');
        alert('ガイド情報が見つかりません。ホームページに戻ります。');
        window.location.href = 'index.html';
        return;
    }
    
    // Load registered guides
    const registeredGuides = JSON.parse(localStorage.getItem('registeredGuides')) || [];
    const currentGuide = registeredGuides.find(guide => guide.id == currentGuideId);
    
    if (!currentGuide) {
        console.log('Guide not found in registered guides');
        alert('ガイド情報が見つかりません。ホームページに戻ります。');
        window.location.href = 'index.html';
        return;
    }
    
    console.log('Loading guide data:', currentGuide);
    
    // Populate form fields with current guide data
    populateEditForm(currentGuide);
});

function populateEditForm(guideData) {
    try {
        // Basic information (read-only fields)
        const nameField = document.getElementById('guide-name');
        const usernameField = document.getElementById('guide-username'); 
        const emailField = document.getElementById('guide-email');
        const locationField = document.getElementById('guide-location');
        const languagesField = document.getElementById('guide-languages');
        
        if (nameField) nameField.value = guideData.name || `${guideData.displayName?.first || guideData.realName?.first || ''} ${guideData.displayName?.last || guideData.realName?.last || ''}`;
        if (usernameField) usernameField.value = guideData.displayName ? `${guideData.displayName.first} ${guideData.displayName.last}` : guideData.name || '';
        if (emailField) emailField.value = guideData.email || '';
        if (locationField) locationField.value = getLocationName(guideData.location) || '';
        if (languagesField) languagesField.value = getLanguageNames(guideData.languages) || '';
        
        // Editable fields
        const bioField = document.getElementById('guide-bio');
        const experienceField = document.getElementById('guide-experience');
        const hourlyRateField = document.getElementById('guide-hourly-rate');
        const groupRateField = document.getElementById('guide-group-rate');
        
        if (bioField) bioField.value = guideData.description || guideData.specialty || '';
        if (experienceField) experienceField.value = guideData.experience || '';
        if (hourlyRateField) hourlyRateField.value = guideData.price || 6000;
        if (groupRateField) groupRateField.value = guideData.groupRate || 2000;
        
        // Profile photo
        const profileImg = document.getElementById('profile-preview');
        if (profileImg && (guideData.image || guideData.profilePhoto)) {
            profileImg.src = guideData.image || guideData.profilePhoto;
        }
        
        console.log('Form populated successfully');
        
        // Setup save functionality
        setupSaveHandlers(guideData);
        
    } catch (error) {
        console.error('Error populating form:', error);
        alert('フォームの読み込み中にエラーが発生しました。');
    }
}

function getLocationName(locationCode) {
    const locationNames = {
        hokkaido: "北海道", aomori: "青森県", iwate: "岩手県", miyagi: "宮城県", akita: "秋田県", yamagata: "山形県", fukushima: "福島県",
        ibaraki: "茨城県", tochigi: "栃木県", gunma: "群馬県", saitama: "埼玉県", chiba: "千葉県", tokyo: "東京都", kanagawa: "神奈川県",
        niigata: "新潟県", toyama: "富山県", ishikawa: "石川県", fukui: "福井県", yamanashi: "山梨県", nagano: "長野県", gifu: "岐阜県", shizuoka: "静岡県", aichi: "愛知県",
        mie: "三重県", shiga: "滋賀県", kyoto: "京都府", osaka: "大阪府", hyogo: "兵庫県", nara: "奈良県", wakayama: "和歌山県",
        tottori: "鳥取県", shimane: "島根県", okayama: "岡山県", hiroshima: "広島県", yamaguchi: "山口県", tokushima: "徳島県", kagawa: "香川県", ehime: "愛媛県", kochi: "高知県",
        fukuoka: "福岡県", saga: "佐賀県", nagasaki: "長崎県", kumamoto: "熊本県", oita: "大分県", miyazaki: "宮崎県", kagoshima: "鹿児島県", okinawa: "沖縄県",
        ogasawara: "小笠原諸島", izu: "伊豆諸島", sado: "佐渡島", awaji: "淡路島", yakushima: "屋久島", amami: "奄美大島", ishigaki: "石垣島", miyako: "宮古島"
    };
    return locationNames[locationCode] || locationCode;
}

function getLanguageNames(languageCodes) {
    if (!Array.isArray(languageCodes)) return '';
    
    const languageNames = {
        japanese: "日本語", english: "英語", chinese: "中国語", korean: "韓国語",
        thai: "タイ語", vietnamese: "ベトナム語", indonesian: "インドネシア語",
        spanish: "スペイン語", french: "フランス語", german: "ドイツ語", italian: "イタリア語"
    };
    
    return languageCodes.map(code => languageNames[code] || code).join(', ');
}

function setupSaveHandlers(originalGuideData) {
    // Save draft functionality
    window.saveDraft = function() {
        console.log('Saving draft...');
        saveGuideData(originalGuideData, false);
    };
    
    // Save and publish functionality
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Form submitted for publishing...');
            saveGuideData(originalGuideData, true);
        });
    }
    
    // Also set up global functions for direct access
    window.saveAndPublish = function() {
        console.log('Publishing guide...');
        saveGuideData(originalGuideData, true);
    };
}

function saveGuideData(originalData, isPublished = false) {
    try {
        console.log('Starting save process with data:', originalData);
        
        // Validate input data
        if (!originalData || !originalData.id) {
            throw new Error('Invalid original data: missing ID');
        }
        
        // Get current profile photo (prioritize new uploaded photo)
        const profileImg = document.getElementById('profile-preview');
        const profileInput = document.getElementById('profile-photo');
        let currentProfilePhoto = originalData.profilePhoto || originalData.image;
        
        // Use preview image if it's different from original
        if (profileImg && profileImg.src && !profileImg.src.includes('placeholder')) {
            currentProfilePhoto = profileImg.src;
        }
        
        // Get form elements with validation
        const bioElement = document.getElementById('guide-bio');
        const experienceElement = document.getElementById('guide-experience');
        const hourlyRateElement = document.getElementById('guide-hourly-rate');
        const groupRateElement = document.getElementById('guide-group-rate');
        const startTimeElement = document.getElementById('available-start');
        const endTimeElement = document.getElementById('available-end');
        
        // Collect updated data from form
        const updatedData = {
            ...originalData,
            description: bioElement?.value || originalData.description || '',
            experience: experienceElement?.value || originalData.experience || '',
            price: parseInt(hourlyRateElement?.value) || originalData.price || 3000,
            groupRate: parseInt(groupRateElement?.value) || originalData.groupRate || 2000,
            availability: {
                start: startTimeElement?.value || '09:00',
                end: endTimeElement?.value || '18:00'
            },
            lastUpdated: new Date().toISOString(),
            isPublished: isPublished,
            // Update both image and profilePhoto fields
            image: currentProfilePhoto,
            profilePhoto: currentProfilePhoto,
            // Add specialties from the specialty system
            specialties: window.selectedSpecialties || originalData.specialties || []
        };
        
        console.log('Prepared data for saving:', updatedData);
        
        // Update in localStorage
        const registeredGuides = JSON.parse(localStorage.getItem('registeredGuides')) || [];
        const guideIndex = registeredGuides.findIndex(guide => guide.id == originalData.id);
        
        if (guideIndex !== -1) {
            registeredGuides[guideIndex] = updatedData;
            localStorage.setItem('registeredGuides', JSON.stringify(registeredGuides));
            
            // Also update the displayed guides cache to ensure immediate reflection
            const displayedGuides = JSON.parse(localStorage.getItem('displayedGuides')) || [];
            const displayedIndex = displayedGuides.findIndex(guide => guide.id == originalData.id);
            if (displayedIndex !== -1) {
                displayedGuides[displayedIndex] = updatedData;
                localStorage.setItem('displayedGuides', JSON.stringify(displayedGuides));
            }
            
            console.log('Guide data updated successfully:', updatedData);
            
            if (isPublished) {
                alert('ガイド情報を公開しました！\n\nホームページのガイド検索に反映されます。');
                // Clear caches to force refresh
                localStorage.removeItem('guideCardsCache');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            } else {
                alert('下書きを保存しました。');
            }
        } else {
            throw new Error('Guide not found in registered guides');
        }
        
    } catch (error) {
        console.error('Error saving guide data:', error);
        console.error('Original data:', originalData);
        console.error('Error details:', error);
        alert('保存中にエラーが発生しました: ' + (error.message || '不明なエラー'));
    }
}

// Photo upload functionality
function setupPhotoUpload() {
    const photoUpload = document.getElementById('profile-photo');
    const profileImg = document.getElementById('profile-preview');
    
    if (photoUpload) {
        photoUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    if (profileImg) {
                        profileImg.src = e.target.result;
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }
}

// Initialize photo upload when DOM is ready
document.addEventListener('DOMContentLoaded', setupPhotoUpload);