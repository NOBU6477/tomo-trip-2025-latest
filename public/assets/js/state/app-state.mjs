// AppState - Centralized state management to prevent TDZ errors
// Single source of truth for all application state

export function initAppState({ guides, pageSize = 12, currentPage = 1 } = {}) {
  const state = {
    guides: Array.isArray(guides) ? guides : [],
    pageSize,
    currentPage,
    get totalPages() {
      return Math.max(1, Math.ceil(this.guides.length / this.pageSize));
    }
  };
  
  // Make globally accessible (read-only to prevent accidents)
  Object.defineProperty(window, 'AppState', { 
    value: state, 
    writable: false,
    configurable: false
  });
  
  console.log('%cAppState initialized:', 'color: #28a745; font-weight: bold;', {
    guides: state.guides.length,
    pageSize: state.pageSize,
    currentPage: state.currentPage,
    totalPages: state.totalPages
  });
  
  return state;
}

// Utility function for safe state access
export function getAppState() {
  return window.AppState || null;
}