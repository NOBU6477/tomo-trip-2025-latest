// AppState - Singleton pattern to prevent redefinition errors
// Uses nullish coalescing to safely create or get existing state

const state = (window.AppState ??= {
  guides: [],
  pageSize: 12,
  currentPage: 1,
  filters: {},
  searchTerm: '',
  locationNames: {},
  
  get totalPages() {
    return Math.max(1, Math.ceil(this.guides.length / this.pageSize));
  },
  
  initialize(initialData = {}) {
    console.log('%cAppState initializing...', 'color: #007bff;');
    
    // Merge with initial data safely
    Object.assign(this, initialData);
    
    console.log('%cAppState initialized:', 'color: #28a745; font-weight: bold;', {
      guides: this.guides.length,
      pageSize: this.pageSize,
      currentPage: this.currentPage,
      totalPages: this.totalPages
    });
    
    return this;
  },
  
  setGuides(guides) {
    this.guides = Array.isArray(guides) ? guides : [];
    this.currentPage = 1; // Reset to first page
    return this;
  }
});

export default state;