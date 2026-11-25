const SITE_CONFIG_URL = 'js/data/site-config.json';
let SITE_BRAND = '';
let SITE_TITLES = {};
window.siteBrand = SITE_BRAND;

function applyBrandName() {
  document.querySelectorAll('[data-brand-name]').forEach((element) => {
    element.textContent = SITE_BRAND;
  });
}

function setPageTitle(title) {
  const cleanTitle = String(title || '').trim();
  if (!cleanTitle) return;
  document.title = cleanTitle === SITE_BRAND || cleanTitle.endsWith(SITE_BRAND)
    ? cleanTitle
    : `${cleanTitle} – ${SITE_BRAND}`.replace(/ – $/, '');
}

async function loadSiteConfig() {
  try {
    const response = await fetch(SITE_CONFIG_URL);
    if (!response.ok) throw new Error('Unable to load site configuration');

    const config = await response.json();
    SITE_BRAND = config.brand || '';
    SITE_TITLES = config.titles || {};
    window.siteBrand = SITE_BRAND;
    applyBrandName();
    window.dispatchEvent(new CustomEvent('siteConfigLoaded', { detail: config }));

    const pageName = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
    const params = new URLSearchParams(window.location.search);
    const requestedTitle = params.get('title') || params.get('member') || params.get('name') || params.get('sno');

    if (requestedTitle) {
      const member = (window.teamMembers || []).find((item) =>
        String(item.sno) === String(requestedTitle) ||
        item.name.toLowerCase() === String(requestedTitle).toLowerCase()
      );
      setPageTitle(member ? member.name : requestedTitle);
    } else if (pageName === 'blog-details.html') {
      setPageTitle(window.blogPageTitle || SITE_TITLES[pageName]);
    } else if (pageName === 'team-member-details.html') {
      const memberTitle = document.querySelector('.pbmit-team-title');
      setPageTitle(memberTitle?.textContent.trim() || SITE_TITLES[pageName]);
    } else {
      setPageTitle(SITE_TITLES[pageName] || document.title);
    }
  } catch (error) {
    console.warn('Site configuration failed to load.', error);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadSiteConfig);
} else {
  loadSiteConfig();
}

const target = document.querySelector('[data-site-header]');

if (target) {
  fetch('js/data/navigation.json')
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Unable to load navigation data (${response.status})`);
      }
      return response.json();
    })
    .then((navItems) => {
      if (!Array.isArray(navItems)) {
        throw new Error('Navigation data must be an array');
      }

      const pageName = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
      const getMenuMarkup = () => navItems.map((item) => {
        const active = item.href && item.href !== '#' && (
          pageName === item.href.toLowerCase() ||
          (item.href === 'blog.html' && pageName === 'blog-details.html') ||
          (item.href === 'service.html' && pageName === 'service-details.html')
        );
        const childMarkup = item.children.length
          ? `
            <ul>
              ${item.children.map((child) => {
                const childPage = child.toLowerCase();
                const isChildActive = pageName === childPage;
                return `<li class="${isChildActive ? 'active' : ''}"><a href="${child}">${child.replace(/[-.]/g, ' ').replace(/\b\w/g, (ch) => ch.toUpperCase())}</a></li>`;
              }).join('')}
            </ul>
          `
          : '';

        const dropdownClass = item.children.length ? 'dropdown' : '';
        const liClasses = [active ? 'active' : '', dropdownClass].filter(Boolean).join(' ');

        return `
          <li class="${liClasses}">
            <a href="${item.href || '#'}">${item.label}</a>
            ${childMarkup}
            ${item.children.length ? "<span class='righticon'><i class='ti-angle-down'></i></span>" : ''}
          </li>
        `;
      }).join('');

      const commonHeader = `
    <header class="site-header header-style-1">
      <div class="site-header-menu">
        <div class="container-fluid g-0">
          <div class="row g-0">
            <div class="col-md-12">
              <div class="d-flex align-items-center justify-content-between">
                <div class="d-flex align-items-center justify-content-between header-content">
                  <div class="site-branding pbmit-logo-area">
                    <h1 class="site-title">
                      <a href="index.html">
                        <img class="logo-img" src="images/logo.svg" alt="attorly">
                      </a>
                    </h1>
                  </div>
                  <div class="site-navigation">
                    <nav class="main-menu navbar-expand-xl navbar-light">
                      <div class="navbar-header">
                        <button class="navbar-toggler" type="button">
                          <i class="pbmit-base-icon-menu-1"></i>
                        </button>
                      </div>
                      <div class="pbmit-mobile-menu-bg"></div>
                      <div class="collapse navbar-collapse clearfix show" id="pbmit-menu">
                        <div class="pbmit-menu-wrap">
                          <span class="closepanel">
                            <i class="pbmit-base-icon-close-circular-button-symbol"></i>
                          </span>
                          <ul class="navigation clearfix">
                            ${getMenuMarkup()}
                          </ul>
                        </div>
                      </div>
                    </nav>
                  </div>
                </div>
                <div class="pbmit-right-box">
                  <div class="pbmit-header-search-btn">
                    <a href="#"><i class="pbmit-base-icon-search-1"></i></a>
                  </div>
                  <div class="menu-right-box d-flex align-items-center">
                    <div class="pbmit-button">
                      <a href="contact-us.html" class="pbmit-btn">
                        <span class="pbmit-header-button-text-1">Free consultant</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  `;

      const homeHeader = `
    <header class="site-header header-style-1">
      <div class="site-header-menu">
        <div class="container-fluid g-0">
          <div class="row g-0">
            <div class="col-md-12">
              <div class="d-flex align-items-center justify-content-between">
                <div class="d-flex align-items-center justify-content-between header-content">
                  <div class="site-branding pbmit-logo-area">
                    <h1 class="site-title">
                      <a href="index.html">
                        <img class="logo-img" src="images/logo.svg" alt="attorly">
                      </a>
                    </h1>
                  </div>
                  <div class="site-navigation">
                    <nav class="main-menu navbar-expand-xl navbar-light">
                      <div class="navbar-header">
                        <button class="navbar-toggler" type="button">
                          <i class="pbmit-base-icon-menu-1"></i>
                        </button>
                      </div>
                      <div class="pbmit-mobile-menu-bg"></div>
                      <div class="collapse navbar-collapse clearfix show" id="pbmit-menu">
                        <div class="pbmit-menu-wrap">
                          <span class="closepanel">
                            <i class="pbmit-base-icon-close-circular-button-symbol"></i>
                          </span>
                          <ul class="navigation clearfix">
                            ${getMenuMarkup()}
                          </ul>
                        </div>
                      </div>
                    </nav>
                  </div>
                </div>
                <div class="pbmit-right-box">
                  <div class="pbmit-header-search-btn">
                    <a href="#"><i class="pbmit-base-icon-search-1"></i></a>
                  </div>
                  <div class="menu-right-box d-flex align-items-center">
                    <div class="pbmit-button">
                      <a href="contact-us.html" class="pbmit-btn">
                        <span class="pbmit-header-button-text-1">Free consultant</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="pbmit-slider-social">
        <ul class="pbmit-social-links">
          <li class="pbmit-social-li pbmit-social-facebook"><a href="#" target="_blank"><span><i class="pbmit-base-icon-facebook-squared"></i></span></a></li>
          <li class="pbmit-social-li pbmit-social-twitter"><a href="#" target="_blank"><span><i class="pbmit-base-icon-twitter"></i></span></a></li>
          <li class="pbmit-social-li pbmit-social-instagram"><a href="#" target="_blank"><span><i class="pbmit-base-icon-instagram"></i></span></a></li>
          <li class="pbmit-social-li pbmit-social-youtube"><a href="#" target="_blank"><span><i class="pbmit-base-icon-youtube-play"></i></span></a></li>
        </ul>
      </div>
      <div class="pbmit-slider-area pbmit-slider-one">
        <div class="swiper-slider" data-autoplay="true" data-loop="true" data-dots="true" data-arrows="false" data-columns="1" data-margin="0" data-effect="fade">
          <div class="swiper-wrapper">
            <div class="swiper-slide slide1">
              <div class="pbmit-slider-item">
                <div class="pbmit-slider-bg" style="background-image: url(images/banner-slider-img/attorly-s1-bg.png);"></div>
                <div class="container">
                  <div class="row align-items-center">
                    <div class="col-md-6">
                      <div class="slider-img-01 transform-center"><img src="images/banner-slider-img/attorly-s1-img-01.png" class="img-fluid" alt=""></div>
                      <div class="slider-img-02 transform-center"><img src="images/banner-slider-img/attorly-s1-img-02.png" class="img-fluid" alt=""></div>
                    </div>
                    <div class="col-md-6">
                      <div class="pbmit-slider-content">
                        <h5 class="pbmit-sub-title transform-right transform-delay-1">Leave court to us</h5>
                        <h2 class="pbmit-title transform-right transform-delay-2">A law firm with a <br> <span class="globalcolor pbmit-text-underline">passion</span> for success</h2>
                        <div class="pbmit-desc transform-bottom transform-delay-3">The lawyers are both experienced and highly skilled.</div>
                        <div class="pbmit-button d-flex">
                          <div class="me-4 transform-bottom transform-delay-4"><a href="portfolio-details.html" class="pbmit-btn pbmit-btn-global"><span class="pbmit-header-button-text-1">Recent Work</span></a></div>
                          <div class="transform-bottom transform-delay-5 d-none d-lg-block"><a href="contact-us.html" class="pbmit-btn pbmit-btn-inline"><span>Contact Us</span></a></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="slider-img-03"><img src="images/banner-slider-img/attorly-s1-img-03.png" class="img-fluid" alt=""></div>
            </div>
            <div class="swiper-slide slide2">
              <div class="pbmit-slider-item">
                <div class="pbmit-slider-bg" style="background-image: url(images/banner-slider-img/attorly-s1-bg.png);"></div>
                <div class="container">
                  <div class="row align-items-center">
                    <div class="col-md-6">
                      <div class="slider-img-01 transform-center"><img src="images/banner-slider-img/slider-01-img-b2.png" alt=""></div>
                    </div>
                    <div class="col-md-6">
                      <div class="pbmit-slider-content">
                        <h5 class="pbmit-sub-title transform-right transform-delay-1">Leave court to us</h5>
                        <h2 class="pbmit-title transform-right transform-delay-2">A law firm with a <br> <span class="globalcolor pbmit-text-underline">passion</span> for success</h2>
                        <div class="pbmit-desc transform-bottom transform-delay-3">The lawyers are both experienced and highly skilled.</div>
                        <div class="pbmit-button d-flex">
                          <div class="me-4 transform-bottom transform-delay-4"><a href="portfolio-details.html" class="pbmit-btn pbmit-btn-global"><span class="pbmit-header-button-text-1">Recent Work</span></a></div>
                          <div class="transform-bottom transform-delay-5 d-none d-lg-block"><a href="contact-us.html" class="pbmit-btn pbmit-btn-inline"><span>Contact Us</span></a></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  `;

      target.innerHTML = pageName === 'index.html' ? homeHeader : commonHeader;
      window.dispatchEvent(new Event('siteHeaderLoaded'));
    })
    .catch((error) => {
      console.error('Navigation menu failed to load.', error);
    });
}
