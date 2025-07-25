// English CSP Safe Fix System - eval prohibition compliance

(function() {
    'use strict';
    
    console.log('English CSP Safe Fix System Starting');
    
    // 1. Create Management Button with Direct DOM Manipulation
    function createSafeManagementButton() {
        console.log('Creating Management Button Safely');
        
        // Remove existing elements
        const existing = document.getElementById('management-trigger-btn');
        if (existing) {
            existing.remove();
            console.log('Existing management button removed');
        }
        
        // Safe DOM creation (no innerHTML)
        const triggerContainer = document.createElement('div');
        triggerContainer.id = 'management-trigger-btn';
        triggerContainer.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            z-index: 99998;
        `;
        
        const triggerButton = document.createElement('button');
        triggerButton.textContent = '🏆';
        triggerButton.title = 'Open Management Center';
        triggerButton.style.cssText = `
            width: 70px;
            height: 70px;
            border-radius: 50%;
            background: linear-gradient(135deg, #4CAF50, #45a049);
            border: none;
            color: white;
            font-size: 28px;
            cursor: pointer;
            box-shadow: 0 8px 25px rgba(76, 175, 80, 0.4);
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 3px solid rgba(255, 255, 255, 0.2);
        `;
        
        // Safe event listener addition
        triggerButton.addEventListener('click', function() {
            toggleManagementPanel();
        });
        
        triggerButton.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.boxShadow = '0 12px 35px rgba(76, 175, 80, 0.6)';
        });
        
        triggerButton.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = '0 8px 25px rgba(76, 175, 80, 0.4)';
        });
        
        triggerContainer.appendChild(triggerButton);
        document.body.appendChild(triggerContainer);
        
        console.log('✅ Management Center Button Created Safely');
        return triggerContainer;
    }
    
    // 2. Create Safe Management Panel
    function createSafeManagementPanel() {
        console.log('Creating Management Panel Safely');
        
        const existing = document.getElementById('management-center-panel');
        if (existing) {
            existing.remove();
        }
        
        const panel = document.createElement('div');
        panel.id = 'management-center-panel';
        panel.style.cssText = `
            display: none;
            position: fixed;
            bottom: 120px;
            right: 20px;
            background: linear-gradient(135deg, #4CAF50, #45a049);
            color: white;
            padding: 22px;
            border-radius: 20px;
            z-index: 99999;
            min-width: 300px;
            text-align: center;
            box-shadow: 0 20px 50px rgba(0,0,0,0.3);
        `;
        
        // Panel header
        const header = document.createElement('h5');
        header.textContent = '📋 Management Center';
        header.style.margin = '0 0 15px 0';
        panel.appendChild(header);
        
        // Counter display
        const counterDiv = document.createElement('div');
        counterDiv.style.margin = '15px 0';
        
        const comparisonDiv = document.createElement('div');
        comparisonDiv.textContent = 'Comparing: ';
        const comparisonCount = document.createElement('span');
        comparisonCount.id = 'comparison-count';
        comparisonCount.textContent = '0';
        comparisonDiv.appendChild(comparisonCount);
        comparisonDiv.appendChild(document.createTextNode('/3 people'));
        
        const bookmarkDiv = document.createElement('div');
        bookmarkDiv.textContent = 'Bookmarks: ';
        const bookmarkCount = document.createElement('span');
        bookmarkCount.id = 'bookmark-count';
        bookmarkCount.textContent = '0';
        bookmarkDiv.appendChild(bookmarkCount);
        bookmarkDiv.appendChild(document.createTextNode(' people'));
        
        counterDiv.appendChild(comparisonDiv);
        counterDiv.appendChild(bookmarkDiv);
        panel.appendChild(counterDiv);
        
        // Button group
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = 'display: flex; flex-direction: column; gap: 10px;';
        
        const createButton = (text, onclick) => {
            const btn = document.createElement('button');
            btn.textContent = text;
            btn.style.cssText = `
                background: rgba(255,255,255,0.2);
                border: none;
                color: white;
                padding: 8px 16px;
                border-radius: 8px;
                cursor: pointer;
            `;
            btn.addEventListener('click', onclick);
            return btn;
        };
        
        buttonContainer.appendChild(createButton('Show Comparison', showComparison));
        buttonContainer.appendChild(createButton('Show Bookmarks', showBookmarks));
        buttonContainer.appendChild(createButton('Clear All', clearAll));
        
        panel.appendChild(buttonContainer);
        
        // Close button
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.style.cssText = `
            position: absolute;
            top: 5px;
            right: 10px;
            background: none;
            border: none;
            color: white;
            font-size: 18px;
            cursor: pointer;
        `;
        closeBtn.addEventListener('click', toggleManagementPanel);
        panel.appendChild(closeBtn);
        
        document.body.appendChild(panel);
        console.log('✅ Management Panel Created Safely');
        return panel;
    }
    
    // 3. Remove White Elements and Stamps
    function removeWhiteElementsAndStamps() {
        console.log('🗑️ Removing White Elements and Stamps');
        
        let removedCount = 0;
        
        // Remove white frames
        const whiteElements = document.querySelectorAll('*');
        whiteElements.forEach(element => {
            const styles = window.getComputedStyle(element);
            const rect = element.getBoundingClientRect();
            
            // Remove white background empty elements
            if ((styles.backgroundColor === 'rgb(255, 255, 255)' || 
                 styles.backgroundColor === 'white' ||
                 styles.backgroundColor === '#ffffff') &&
                rect.width < 100 && rect.height < 100 &&
                !element.textContent.trim() &&
                !element.querySelector('img, button, input, select, textarea') &&
                !element.closest('.modal') &&
                !element.closest('.navbar') &&
                !element.closest('.card') &&
                !element.id.includes('management') &&
                element.tagName !== 'HTML' &&
                element.tagName !== 'BODY') {
                
                element.remove();
                removedCount++;
            }
        });
        
        // Remove circular stamps (circular overlays)
        const circularElements = document.querySelectorAll('*');
        circularElements.forEach(element => {
            const styles = window.getComputedStyle(element);
            
            // Identify circular elements
            if (styles.borderRadius === '50%' || 
                styles.borderRadius.includes('50%') ||
                (element.style.borderRadius && element.style.borderRadius.includes('50%'))) {
                
                // Remove unnecessary circular elements in filter area
                if (element.closest('#filter-card') || 
                    element.closest('.filter-container') ||
                    (element.getBoundingClientRect().width < 50 && 
                     element.getBoundingClientRect().height < 50 &&
                     !element.textContent.trim() &&
                     !element.querySelector('img, button') &&
                     !element.id.includes('management'))) {
                    
                    element.remove();
                    removedCount++;
                    console.log('Circular stamp removed:', element);
                }
            }
        });
        
        // Remove specific problem elements by class name
        const problematicClasses = [
            '.circular-overlay',
            '.stamp-overlay', 
            '.round-badge',
            '.circular-icon'
        ];
        
        problematicClasses.forEach(className => {
            const elements = document.querySelectorAll(className);
            elements.forEach(el => {
                if (!el.closest('#management-trigger-btn') && !el.closest('#management-center-panel')) {
                    el.remove();
                    removedCount++;
                }
            });
        });
        
        console.log(`✅ White Elements and Stamps Removal Complete: ${removedCount} removed`);
    }
    
    // 4. Fix Filter Functionality
    function fixFilterFunctionality() {
        console.log('🔧 Filter Functionality Repair Starting');
        
        const filterBtn = document.getElementById('filterToggleBtn');
        if (filterBtn) {
            // Remove existing events
            const newFilterBtn = filterBtn.cloneNode(true);
            filterBtn.parentNode.replaceChild(newFilterBtn, filterBtn);
            
            newFilterBtn.addEventListener('click', function(e) {
                e.preventDefault();
                const filterCard = document.getElementById('filter-card');
                if (filterCard) {
                    if (filterCard.style.display === 'none' || filterCard.classList.contains('d-none')) {
                        filterCard.style.display = 'block';
                        filterCard.classList.remove('d-none');
                        newFilterBtn.textContent = 'Close Filter';
                        console.log('Filter Shown');
                    } else {
                        filterCard.style.display = 'none';
                        filterCard.classList.add('d-none'); 
                        newFilterBtn.textContent = 'Filter Guides';
                        console.log('Filter Hidden');
                    }
                }
            });
            console.log('✅ Filter Toggle Repair Complete');
        }
    }
    
    // 5. Define Safe Global Functions
    function defineSafeFunctions() {
        window.toggleManagementPanel = function() {
            const panel = document.getElementById('management-center-panel');
            if (panel) {
                if (panel.style.display === 'none') {
                    panel.style.display = 'block';
                    updateCounters();
                } else {
                    panel.style.display = 'none';
                }
            }
        };
        
        window.showComparison = function() {
            const comparisonList = JSON.parse(localStorage.getItem('comparisonList') || '[]');
            if (comparisonList.length === 0) {
                alert('No guides selected for comparison');
                return;
            }
            
            let message = 'Comparing Guides:\n';
            comparisonList.forEach((guide, index) => {
                message += `${index + 1}. ${guide.name} (${guide.location}) - ¥${guide.price}\n`;
            });
            alert(message);
        };
        
        window.showBookmarks = function() {
            const bookmarkList = JSON.parse(localStorage.getItem('bookmarkList') || '[]');
            if (bookmarkList.length === 0) {
                alert('No bookmarked guides');
                return;
            }
            
            let message = 'Bookmarked Guides:\n';
            bookmarkList.forEach((guide, index) => {
                message += `${index + 1}. ${guide.name} (${guide.location}) - ¥${guide.price}\n`;
            });
            alert(message);
        };
        
        window.clearAll = function() {
            if (confirm('Clear all selections?')) {
                localStorage.removeItem('bookmarkList');
                localStorage.removeItem('comparisonList');
                updateCounters();
                alert('All selections cleared');
            }
        };
        
        console.log('✅ Safe Global Functions Defined');
    }
    
    function updateCounters() {
        const bookmarkList = JSON.parse(localStorage.getItem('bookmarkList') || '[]');
        const comparisonList = JSON.parse(localStorage.getItem('comparisonList') || '[]');
        
        const bookmarkCounter = document.getElementById('bookmark-count');
        const comparisonCounter = document.getElementById('comparison-count');
        
        if (bookmarkCounter) bookmarkCounter.textContent = bookmarkList.length;
        if (comparisonCounter) comparisonCounter.textContent = comparisonList.length;
    }
    
    // Initialization function
    function initialize() {
        setTimeout(() => {
            console.log('🚀 CSP Safe Initialization Starting');
            
            removeWhiteElementsAndStamps();
            createSafeManagementButton();
            createSafeManagementPanel();
            fixFilterFunctionality();
            defineSafeFunctions();
            
            // Continuous monitoring (5 second intervals)
            setInterval(() => {
                removeWhiteElementsAndStamps();
                
                // Check if management button disappeared
                if (!document.getElementById('management-trigger-btn')) {
                    console.log('Management button recreating');
                    createSafeManagementButton();
                }
            }, 5000);
            
            console.log('✅ CSP Safe Initialization Complete');
        }, 1000);
    }
    
    // Execute
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
    
    // Also execute immediately
    setTimeout(initialize, 100);
    
})();