(function () {
  const CONFIG_URL = 'js/data/site-config.json';
  let brand = '';
  let titles = {};

  function normalizePageName() {
    return (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
  }

  function getPageTitle() {
    const params = new URLSearchParams(window.location.search);
    const explicitTitle = params.get('title') || params.get('member') || params.get('name') || params.get('sno');

    if (explicitTitle) {
      const member = (window.teamMembers || []).find((item) =>
        String(item.sno) === String(explicitTitle) ||
        item.name.toLowerCase() === String(explicitTitle).toLowerCase()
      );
      if (member) return member.name;
    }

    const pageName = normalizePageName();

    if (pageName === 'team-member-details.html') {
      const memberTitle = document.querySelector('.pbmit-team-title');
      if (memberTitle && memberTitle.textContent.trim()) {
        return memberTitle.textContent.trim();
      }
    }

    return titles[pageName] || document.title || brand;
  }

  function setDocumentTitle() {
    const pageTitle = getPageTitle();
    document.title = pageTitle === brand || pageTitle.endsWith(brand)
      ? pageTitle
      : `${pageTitle} – ${brand}`;
  }

  async function loadSiteConfig() {
    try {
      const response = await fetch(CONFIG_URL);
      if (!response.ok) throw new Error('Unable to load site configuration');

      const config = await response.json();
      brand = config.brand || brand;
      titles = config.titles || {};
      window.siteBrand = brand;
      setDocumentTitle();
    } catch (error) {
      console.warn('Site configuration failed to load.', error);
      setDocumentTitle();
    }
  }

  loadSiteConfig();

  window.addEventListener('DOMContentLoaded', setDocumentTitle);
  window.addEventListener('teamDataLoaded', setDocumentTitle);
})();
