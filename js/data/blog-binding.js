(async function () {
  const blogLists = document.querySelectorAll('[data-blog-items]');
  const blogDetail = document.querySelector('[data-blog-detail]');
  const recentPosts = document.querySelectorAll('[data-blog-recent-list]');
  const homeBlogList = document.querySelector('[data-home-blog-items]');
  if (!blogLists.length && !blogDetail && !recentPosts.length && !homeBlogList) return;

  const layout = new URLSearchParams(window.location.search).get('layout') === 'grid'
    ? 'grid'
    : 'classic';
  document.querySelectorAll('[data-blog-layout-view]').forEach((view) => {
    view.hidden = view.dataset.blogLayoutView !== layout;
  });
  document.querySelectorAll('[data-blog-layout-toggle]').forEach((toggle) => {
    const active = toggle.dataset.blogLayoutToggle === layout;
    toggle.classList.toggle('active', active);
    if (active) {
      toggle.setAttribute('aria-current', 'page');
    } else {
      toggle.removeAttribute('aria-current');
    }
  });

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[character]);
  }

  function detailUrl(blog) {
    return `blog-details.html?id=${encodeURIComponent(blog.id)}`;
  }

  function categorySlug(category) {
    return String(category).trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  function categoryUrl(category, targetLayout = 'classic') {
    return `blog.html?layout=${targetLayout}&category=${encodeURIComponent(categorySlug(category))}`;
  }

  function renderClassicCard(blog) {
    const url = escapeHtml(detailUrl(blog));
    const image = escapeHtml(blog.classicImage);
    const title = escapeHtml(blog.title);
    const date = escapeHtml(blog.date);
    const category = escapeHtml(blog.category);
    const categoryHref = escapeHtml(categoryUrl(blog.category));
    const author = escapeHtml(blog.author);
    const excerpt = escapeHtml(blog.excerpt);

    return `
      <article class="post blog-classic">
        <div class="post-thumbnail">
          <div class="pbmit-featured-container">
            <div class="pbmit-featured-wrapper">
              <img src="${image}" class="img-fluid w-100" alt="${title}">
            </div>
            <div class="pbmit-meta-date-wrapper">
              <span class="pbmit-meta pbmit-date"><a href="${url}" rel="bookmark">${date}</a></span>
              <span class="pbmit-meta pbmit-meta-line"><a href="${categoryHref}" rel="category tag">${category}</a></span>
              <span class="pbmit-meta pbmit-meta-author"><a href="${url}" title="Posted by ${author}" rel="author">${author}</a></span>
              <span class="pbmit-meta pbmit-meta-comments"><a href="${url}" rel="category tag">${blog.comments} Comments</a></span>
            </div>
            <h3 class="pbmit-post-title"><a href="${url}">${title}</a></h3>
            <div class="pbmit-entry-content">
              ${excerpt}
              <div class="pbmit-read-more-link">
                <a href="${url}" class="pbmit-btn pbmit-btn-inline"><span>Read More</span></a>
              </div>
            </div>
          </div>
        </div>
      </article>
    `;
  }

  function renderGridCard(blog) {
    const url = escapeHtml(detailUrl(blog));
    const image = escapeHtml(blog.gridImage);
    const title = escapeHtml(blog.title);
    const date = escapeHtml(blog.date);
    const category = escapeHtml(blog.category);
    const categoryHref = escapeHtml(categoryUrl(blog.category));
    const excerpt = escapeHtml(blog.excerpt);

    return `
      <div class="col-sm-12 col-md-4">
        <article class="pbmit-blog-style-1">
          <div class="post-item">
            <div class="pbmit-featured-container">
              <div class="pbmit-featured-img-wrapper">
                <div class="pbmit-featured-wrapper">
                  <img src="${image}" class="img-fluid" alt="${title}">
                </div>
              </div>
            </div>
            <div class="pbminfotech-box-content">
              <div class="pbmit-meta-container">
                <span class="pbmit-date-wrapper pbmit-meta-line"><span class="pbmit-post-date">${date}</span></span>
                <span class="pbmit-meta-category pbmit-meta-line">
                  <a href="${categoryHref}" rel="category tag">${category}</a>
                </span>
              </div>
              <div class="pbmit-box-content-wrapper">
                <h3 class="pbmit-post-title"><a href="${url}">${title}</a></h3>
                <div class="pbminfotech-box-desc-text">${excerpt}</div>
              </div>
            </div>
          </div>
        </article>
      </div>
    `;
  }

  function renderRecentPost(blog) {
    const url = escapeHtml(detailUrl(blog));
    const image = escapeHtml(blog.classicImage);
    const title = escapeHtml(blog.title);
    const date = escapeHtml(blog.date);

    return `
      <li class="recent-post-list-li">
        <a class="recent-post-thum" href="${url}">
          <img src="${image}" class="img-fluid" alt="${title}">
        </a>
        <div class="media-body">
          <a href="${url}">${title}</a>
          <span class="post-date">${date}</span>
        </div>
      </li>
    `;
  }

  function renderHomeBlog(blog) {
    const url = escapeHtml(detailUrl(blog));
    const image = escapeHtml(blog.homeImage || blog.classicImage);
    const title = escapeHtml(blog.title);
    const category = escapeHtml(blog.category);
    const author = escapeHtml(blog.author);
    const comments = escapeHtml(blog.comments);
    const parsedDate = new Date(blog.date);
    const date = Number.isNaN(parsedDate.getTime())
      ? escapeHtml(blog.date)
      : escapeHtml(parsedDate.toLocaleString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' }));

    return `
      <article class="pbmit-blog-style-2">
        <div class="post-item">
          <div class="pbminfotech-box-content">
            <div class="pbmit-meta-date-wrapper pbmit-meta-line">
              <div class="pbmit-meta-date">${date}</div>
            </div>
            <div class="pbmit-content-wrapper">
              <h3 class="pbmit-post-title"><a href="${url}">${title}</a></h3>
              <div class="pbmit-meta-container">
                <div class="pbmit-meta-cat-wrapper pbmit-meta-line">
                  <div class="pbmit-meta-category"><a href="${url}" rel="category tag">${category}</a></div>
                </div>
                <span class="pbmit-meta-comments pbmit-meta-line">${comments}
                  <span class="pbmit-meta-comments">Comments</span>
                </span>
              </div>
            </div>
          </div>
          <div class="pbmit-hover-img">
            <img src="${image}" class="img-fluid" alt="${title}">
          </div>
        </div>
        <a class="pbmit-home-blog-link" href="${url}" aria-label="Read ${title} by ${author}"></a>
      </article>
    `;
  }

  try {
    const response = await fetch('js/data/blogs.json');
    if (!response.ok) {
      throw new Error(`Unable to load blog data (${response.status})`);
    }

    const blogs = await response.json();
    if (!Array.isArray(blogs) || blogs.length === 0) {
      throw new Error('Blog data must be a non-empty array');
    }

    const requestedCategory = new URLSearchParams(window.location.search).get('category');
    const selectedCategory = blogs.find((blog) => categorySlug(blog.category) === requestedCategory)?.category || '';
    const selectedCategorySlug = selectedCategory ? categorySlug(selectedCategory) : '';
    const filteredBlogs = selectedCategory
      ? blogs.filter((blog) => blog.category === selectedCategory)
      : blogs;

    document.querySelectorAll('[data-blog-layout-toggle]').forEach((toggle) => {
      const params = new URLSearchParams({ layout: toggle.dataset.blogLayoutToggle });
      if (selectedCategorySlug) params.set('category', selectedCategorySlug);
      toggle.href = `blog.html?${params.toString()}`;
    });

    document.querySelectorAll('[data-blog-category-filter]').forEach((link) => {
      const category = link.dataset.blogCategoryFilter;
      const categoryHref = new URLSearchParams({ layout, ...(category ? { category: categorySlug(category) } : {}) });
      const active = category ? categorySlug(category) === selectedCategorySlug : !selectedCategorySlug;
      link.href = `blog.html?${categoryHref.toString()}`;
      link.classList.toggle('active', active);
      if (active) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });

    const categoryCounts = new Map();
    blogs.forEach((blog) => {
      categoryCounts.set(blog.category, (categoryCounts.get(blog.category) || 0) + 1);
    });
    document.querySelectorAll('[data-blog-category-count]').forEach((count) => {
      const category = count.dataset.blogCategoryCount;
      count.textContent = `( ${category ? categoryCounts.get(category) || 0 : blogs.length} )`;
    });

    document.querySelectorAll('[data-blog-filter-status]').forEach((status) => {
      status.replaceChildren();
      status.hidden = !selectedCategory;
      if (selectedCategory) {
        const label = document.createElement('span');
        const postCount = filteredBlogs.length;
        label.textContent = `Showing ${postCount} ${postCount === 1 ? 'post' : 'posts'} in ${selectedCategory}`;
        const clearLink = document.createElement('a');
        clearLink.href = `blog.html?layout=${layout}`;
        clearLink.textContent = 'Clear filter';
        status.append(label, clearLink);
      }
    });

    blogLists.forEach((blogList) => {
      if (blogList.dataset.blogItems === 'classic') {
        blogList.innerHTML = filteredBlogs.map(renderClassicCard).join('');
      } else if (blogList.dataset.blogItems === 'grid') {
        blogList.innerHTML = Array.from(
          { length: Math.ceil(filteredBlogs.length / 3) },
          (_, rowIndex) => `<div class="row">${filteredBlogs.slice(rowIndex * 3, rowIndex * 3 + 3).map(renderGridCard).join('')}</div>`
        ).join('');
      }
    });

    recentPosts.forEach((list) => {
      list.innerHTML = blogs.slice(0, 3).map(renderRecentPost).join('');
    });

    if (homeBlogList) {
      homeBlogList.innerHTML = blogs.slice(0, 3).map(renderHomeBlog).join('');
      pbmit_hover_img(homeBlogList);
    }

    if (!blogDetail) return;

    const requestedId = new URLSearchParams(window.location.search).get('id') || blogs[0].id;
    const blogIndex = blogs.findIndex((item) => item.id === requestedId);
    if (blogIndex === -1) {
      throw new Error(`Blog post not found: ${requestedId}`);
    }

    const blog = blogs[blogIndex];
    const title = blog.title;
    const brand = window.siteBrand || 'Aarohan Law Chambers';
    const previousBlog = blogs[(blogIndex - 1 + blogs.length) % blogs.length];
    const nextBlog = blogs[(blogIndex + 1) % blogs.length];
    const setText = (selector, value) => {
      document.querySelectorAll(selector).forEach((element) => {
        element.textContent = value;
      });
    };

    window.blogPageTitle = title;
    document.title = `${title} – ${brand}`;
    window.addEventListener('siteConfigLoaded', () => {
      document.title = `${title} – ${window.siteBrand || brand}`;
    });

    setText('[data-blog-title]', title);
    setText('[data-blog-breadcrumb-title]', title);
    setText('[data-blog-category]', blog.category);
    setText('[data-blog-date]', blog.date);
    setText('[data-blog-author]', blog.author);
    setText('[data-blog-comment-label]', `${blog.comments} Comments`);
    setText('[data-blog-comments-title]', `Comments on “${title}”`);
    setText('[data-blog-author-bio]', blog.authorBio);

    const image = blogDetail.querySelector('[data-blog-image]');
    if (image) {
      image.src = blog.classicImage;
      image.alt = title;
    }

    const postContent = blogDetail.querySelector('[data-blog-content]');
    if (postContent) {
      postContent.replaceChildren();
      blog.content.forEach((paragraphText, index) => {
        if (index === 1 && blog.quote) {
          const quote = document.createElement('blockquote');
          const quoteText = document.createElement('p');
          quoteText.textContent = `“${blog.quote}”`;
          const cite = document.createElement('cite');
          cite.textContent = `${blog.quoteAuthor || ''} ${blog.quoteAuthorDescription || ''}`.trim();
          quoteText.append(document.createElement('br'), cite);
          quote.appendChild(quoteText);
          postContent.appendChild(quote);
        }
        const paragraph = document.createElement('p');
        paragraph.textContent = paragraphText;
        postContent.appendChild(paragraph);
        if (index === 1 && blog.subheading) {
          const heading = document.createElement('h4');
          heading.textContent = blog.subheading;
          postContent.appendChild(heading);
        }
      });

      if (Array.isArray(blog.detailImages) && blog.detailImages.length) {
        const imageRow = document.createElement('div');
        imageRow.className = 'post-img';
        const row = document.createElement('div');
        row.className = 'row';
        blog.detailImages.forEach((src) => {
          const column = document.createElement('div');
          column.className = 'col-md-12 col-xl-6';
          const detailImage = document.createElement('img');
          detailImage.src = src;
          detailImage.className = 'img-fluid w-100';
          detailImage.alt = title;
          column.appendChild(detailImage);
          row.appendChild(column);
        });
        imageRow.appendChild(row);
        postContent.appendChild(imageRow);
      }
    }

    const tags = document.querySelector('[data-blog-tags]');
    if (tags) {
      tags.replaceChildren(...blog.tags.map((tag) => {
        const link = document.createElement('a');
        link.href = categoryUrl(tag);
        link.rel = 'tag';
        link.textContent = tag;
        return link;
      }));
    }

    const previousLink = document.querySelector('[data-blog-previous-link]');
    if (previousLink) {
      previousLink.href = detailUrl(previousBlog);
      previousLink.querySelector('[data-blog-previous-title]').textContent = previousBlog.title;
    }

    const nextLink = document.querySelector('[data-blog-next-link]');
    if (nextLink) {
      nextLink.href = detailUrl(nextBlog);
      nextLink.querySelector('[data-blog-next-title]').textContent = nextBlog.title;
    }
  } catch (error) {
    console.error('Blog data failed to load.', error);
    blogLists.forEach((list) => {
      list.textContent = 'Unable to load blog posts.';
    });
    if (blogDetail) {
      const message = document.createElement('p');
      message.className = 'alert alert-warning';
      message.textContent = 'Unable to load this blog post.';
      blogDetail.replaceChildren(message);
    }
  }
})();
