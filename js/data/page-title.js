(function () {
  const brand = 'Aarohan Law Chambers';

  const titles = {
    'index.html': 'Home',
    'about-us-light.html': 'About Us light 2',
    'contact-us.html': 'Contact Us',
    'blog-classic.html': 'Blog Classic',
    'blog-grid.html': 'Blog Grid View',
    'blog-details.html': 'Divorce in the UK today',
    'portfolio-style-1.html': 'Portfolio Style 1',
    'portfolio-details.html': 'Tax Consultancy',
    'service-details.html': 'International Law & Justice',
    'team-member-details.html': 'Team Member'
  };

  function normalizePageName() {
    return (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
  }

  function getPageTitle() {
    const params = new URLSearchParams(window.location.search);
    const explicitTitle = params.get('title') || params.get('member') || params.get('name');

    if (explicitTitle) {
      return explicitTitle;
    }

    const pageName = normalizePageName();

    if (pageName === 'team-member-details.html') {
      const memberTitle = document.querySelector('.pbmit-team-title');
      if (memberTitle && memberTitle.textContent.trim()) {
        return memberTitle.textContent.trim();
      }
    }

    return titles[pageName] || document.title || 'Aarohan Law Chambers';
  }

  function setDocumentTitle() {
    const pageTitle = getPageTitle();
    document.title = pageTitle === brand || pageTitle.endsWith(brand)
      ? pageTitle
      : `${pageTitle} – ${brand}`;
  }

  setDocumentTitle();

  window.addEventListener('DOMContentLoaded', setDocumentTitle);
  window.addEventListener('teamDataLoaded', function (event) {
    const params = new URLSearchParams(window.location.search);
    const requestedName = params.get('member') || params.get('name');

    if (normalizePageName() !== 'team-member-details.html' || !requestedName) return;

    const member = (event.detail || window.teamMembers || []).find((item) =>
      item.name.toLowerCase() === requestedName.toLowerCase()
    );

    if (member) {
      document.title = `${member.name} – ${brand}`;
    }
  });
})();
