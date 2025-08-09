// AppState - Centralized singleton state management to prevent TDZ errors and redefinition
// Single source of truth for all application state - no global property redefinition

let _appState = null;

export function initAppState({ guides, pageSize = 12, currentPage = 1 } = {}) {
  // Return existing state if already initialized (prevents redefinition)
  if (_appState) {
    console.log('%cAppState already initialized - returning existing state', 'color: #ffc107;');
    return _appState;
  }

  _appState = {
    guides: Array.isArray(guides) ? guides : [],
    pageSize,
    currentPage,
    locationNames: {},
    get totalPages() {
      return Math.max(1, Math.ceil(this.guides.length / this.pageSize));
    },
    initialized: Date.now()
  };
  
  // Safe global access for debugging (read-only, configurable to avoid redefinition error)
  if (!('AppState' in window)) {
    Object.defineProperty(window, 'AppState', {
      get: () => _appState,
      configurable: true
    });
  }
  
  console.log('%cAppState initialized:', 'color: #28a745; font-weight: bold;', {
    guides: _appState.guides.length,
    pageSize: _appState.pageSize,
    currentPage: _appState.currentPage,
    totalPages: _appState.totalPages
  });
  
  return _appState;
}

// Utility function for safe state access
export function getAppState() {
  return _appState;
}