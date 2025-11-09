// Force redirect to loading page on first visit
(function() {
  // Check if this is the first visit or direct access to index.html
  const isFirstVisit = !sessionStorage.getItem('hasVisited');
  const currentPage = window.location.pathname.split('/').pop();
  
  if (isFirstVisit && currentPage === 'index.html') {
    sessionStorage.setItem('hasVisited', 'true');
    window.location.href = 'loading.html';
    return;
  }
  
  // If coming from loading page, mark as visited
  if (document.referrer.includes('loading.html')) {
    sessionStorage.setItem('hasVisited', 'true');
  }
})();