// Debug test script to check what's happening
console.log('🔍 Debug Test - Checking current state...');

// Test 1: Check if elements exist
console.log('🧪 Elements Check:');
console.log('  searchBtn:', !!document.getElementById('searchBtn'));
console.log('  guidesContainer:', !!document.getElementById('guidesContainer'));
console.log('  locationFilter:', !!document.getElementById('locationFilter'));
console.log('  languageFilter:', !!document.getElementById('languageFilter'));
console.log('  keywordInput:', !!document.getElementById('keywordInput'));

// Test 2: Check global functions
console.log('🧪 Functions Check:');
console.log('  window.filterGuides:', typeof window.filterGuides);
console.log('  window.AppState:', !!window.AppState);
console.log('  window.renderGuideCards:', typeof window.renderGuideCards);

// Test 3: Check guides data
console.log('🧪 Data Check:');
if (window.AppState) {
    console.log('  AppState.guides:', window.AppState.guides ? window.AppState.guides.length : 'undefined');
    console.log('  AppState.originalGuides:', window.AppState.originalGuides ? window.AppState.originalGuides.length : 'undefined');
}

// Test 4: Check guides container content
const container = document.getElementById('guidesContainer');
if (container) {
    console.log('🧪 Container Check:');
    console.log('  guidesContainer children:', container.children.length);
    console.log('  guidesContainer innerHTML length:', container.innerHTML.length);
    console.log('  contains guide cards:', container.innerHTML.includes('guide-card'));
}

// Test 5: Manual search test
window.debugTestSearch = function() {
    console.log('🧪 Manual Search Test:');
    try {
        if (window.filterGuides) {
            console.log('  Calling filterGuides...');
            window.filterGuides();
            console.log('  ✅ filterGuides called successfully');
        } else {
            console.log('  ❌ filterGuides not available');
        }
    } catch (error) {
        console.error('  ❌ Error calling filterGuides:', error);
    }
};

console.log('🧪 Debug test complete. Run window.debugTestSearch() to test search manually.');