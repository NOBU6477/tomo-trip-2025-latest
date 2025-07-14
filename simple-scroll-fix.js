// 最小限スクロール修正
(function() {
  function fixScroll() {
    document.body.style.overflowY = 'auto';
    document.body.classList.remove('modal-open');
  }
  
  // 初期実行
  fixScroll();
  
  // DOM変更監視
  const observer = new MutationObserver(fixScroll);
  observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
})();