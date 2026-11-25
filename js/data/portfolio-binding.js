(async function () {
  const portfolioContainer = document.querySelector('[data-portfolio-items]');
  const homePortfolioContainer = document.querySelector('[data-home-portfolio-items]');
  if (!portfolioContainer && !homePortfolioContainer) return;

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[character]);
  }

  try {
    const response = await fetch('js/data/portfolio.json');
    if (!response.ok) {
      throw new Error(`Unable to load portfolio data (${response.status})`);
    }

    const projects = await response.json();
    if (!Array.isArray(projects)) {
      throw new Error('Portfolio data must be an array');
    }

    if (homePortfolioContainer) {
      homePortfolioContainer.innerHTML = projects.map((project) => {
        const title = escapeHtml(project.title);
        const detailsUrl = escapeHtml(`portfolio-details.html?id=${encodeURIComponent(project.id)}`);

        return `
          <div class="swiper-slide">
            <div class="pbmit-portfolio-style-3">
              <div class="pbminfotech-post-content" data-cursor-tooltip="">
                <div class="pbmit-featured-wrapper">
                  <img src="${escapeHtml(project.image)}" class="img-fluid" alt="${title}">
                </div>
                <div class="pbminfotech-box-content">
                  <div class="pbmit-port-cat"><a href="${detailsUrl}">${escapeHtml(project.category)}</a></div>
                  <h3 class="pbmit-title">${title}</h3>
                </div>
                <a class="pbmit-link" href="${detailsUrl}" aria-label="View ${title}"></a>
              </div>
            </div>
          </div>
        `;
      }).join('');

      homePortfolioContainer.querySelectorAll('[data-cursor-tooltip]').forEach((item) => {
        const content = item.querySelector('.pbminfotech-box-content');
        item.dataset.cursorTooltip = content ? content.innerHTML : '';
      });
      window.dispatchEvent(new Event('homePortfolioLoaded'));
    }

    if (portfolioContainer) {
      portfolioContainer.innerHTML = Array.from(
        { length: Math.ceil(projects.length / 2) },
        (_, rowIndex) => {
          const rowProjects = projects.slice(rowIndex * 2, rowIndex * 2 + 2);
          const cards = rowProjects.map((project, index) => {
            const category = escapeHtml(project.category);
            const title = escapeHtml(project.title);
            const image = escapeHtml(project.image);
            const detailsUrl = escapeHtml(`portfolio-details.html?id=${encodeURIComponent(project.id)}`);
            const position = rowIndex * 2 + index;
            const alignment = position % 2 === 0 ? 'pbmit-odd' : 'pbmit-even';
            const categoryClass = category.toLowerCase().replace(/[^a-z0-9-]+/g, '-');

            return `
              <div class="col-md-6">
                <article class="pbmit-portfolio-style-2 ${categoryClass} ${alignment}">
                  <div class="pbminfotech-post-content">
                    <div class="pbmit-image-wrapper">
                      <div class="pbmit-featured-img-wrapper">
                        <div class="pbmit-featured-wrapper">
                          <img src="${image}" class="img-fluid" alt="${title}">
                        </div>
                      </div>
                    </div>
                    <div class="pbminfotech-box-content">
                      <div class="pbminfotech-titlebox">
                        <h3 class="pbmit-portfolio-title">
                          <a href="${detailsUrl}">${title}</a>
                        </h3>
                        <div class="pbmit-port-cat">
                          <a href="${detailsUrl}" rel="tag">${category}</a>
                        </div>
                      </div>
                    </div>
                    <a class="pbmit-link" title="${title}" aria-label="View ${title}" href="${detailsUrl}"></a>
                  </div>
                </article>
              </div>
            `;
          }).join('');

          return `<div class="row">${cards}</div>`;
        }
      ).join('');

      window.pbmit_portfolio_effect(portfolioContainer);
    }
  } catch (error) {
    console.error('Portfolio data failed to load.', error);
  }
})();
