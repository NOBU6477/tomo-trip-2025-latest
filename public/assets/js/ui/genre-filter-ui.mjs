import { GUIDE_GENRES } from '../data/guide-genres.mjs';
import { executeSearch, resetFilters } from '../search/search-filter.mjs';

function renderGenreChips(container) {
    container.innerHTML = GUIDE_GENRES.map(genre => `
        <button type="button" class="genre-chip" data-genre="${genre.value}">
            ${genre.label}
        </button>
    `).join('');
}

function handleChipToggle(event) {
    const target = event.target.closest('.genre-chip');
    if (!target) return;

    target.classList.toggle('active');
    executeSearch();
}

export function setupGenreFilterUI() {
    const container = document.getElementById('genreFilterChips');
    if (!container) return;

    renderGenreChips(container);
    container.addEventListener('click', handleChipToggle);
}

export function setupScrollToFilters() {
    const trigger = document.getElementById('scrollToFiltersBtn');
    const filterSection = document.getElementById('filterArea');

    if (trigger && filterSection) {
        trigger.addEventListener('click', () => {
            filterSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            document.querySelectorAll('.genre-chip.active').forEach(btn => btn.classList.remove('active'));
            resetFilters();
        });
    }
}
