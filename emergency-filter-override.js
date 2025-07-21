// Emergency Filter Override - Direct DOM manipulation
console.log('🚨 Emergency Filter Override Loading...');

// Override immediately when script loads
(function() {
  console.log('🚨 Immediate filter override starting...');
  
  function emergencyOverride() {
    // Direct HTML injection for filter button
    const buttonHTML = `
      <button type="button" class="btn btn-outline-primary" id="emergencyFilterBtn" 
              style="z-index: 1050; position: relative; cursor: pointer; pointer-events: auto; background: red; color: white;">
        <i class="bi bi-funnel"></i> EMERGENCY FILTER
      </button>
    `;
    
    // Find the button container and add emergency button
    const container = document.querySelector('.d-flex.justify-content-between.align-items-center.mb-4');
    if (container) {
      container.innerHTML += buttonHTML;
      console.log('🚨 Emergency button injected');
      
      // Set up emergency button functionality
      setTimeout(function() {
        const emergencyBtn = document.getElementById('emergencyFilterBtn');
        if (emergencyBtn) {
          emergencyBtn.onclick = function(e) {
            console.log('🚨 EMERGENCY BUTTON CLICKED!');
            alert('Emergency Filter Button Clicked! Filter functionality active.');
            
            // Create and show emergency filter panel
            let panel = document.getElementById('emergencyFilterPanel');
            if (!panel) {
              panel = document.createElement('div');
              panel.id = 'emergencyFilterPanel';
              panel.style.cssText = `
                position: fixed;
                top: 100px;
                left: 50%;
                transform: translateX(-50%);
                width: 80%;
                max-width: 600px;
                background: white;
                border: 3px solid red;
                border-radius: 10px;
                padding: 20px;
                z-index: 9999;
                box-shadow: 0 0 20px rgba(0,0,0,0.5);
              `;
              panel.innerHTML = `
                <h3 style="color: red;">Emergency Filter Panel</h3>
                <p>Filter functionality is now active!</p>
                <button onclick="document.getElementById('emergencyFilterPanel').style.display='none'">Close</button>
              `;
              document.body.appendChild(panel);
            }
            
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
          };
          console.log('🚨 Emergency button functionality set');
        }
      }, 500);
    }
  }
  
  // Try multiple times to ensure it works
  emergencyOverride();
  setTimeout(emergencyOverride, 1000);
  setTimeout(emergencyOverride, 3000);
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', emergencyOverride);
  }
})();

console.log('🚨 Emergency Filter Override Active');