(async function () {
  const homeCards = document.querySelectorAll('[data-service-card-id]');
  const serviceDetail = document.querySelector('[data-service-detail]');
  const serviceList = document.querySelector('[data-service-list-items]');
  if (!homeCards.length && !serviceDetail && !serviceList) return;

  function serviceUrl(service) {
    return `service-details.html?id=${encodeURIComponent(service.id)}`;
  }

  function setText(selector, value) {
    document.querySelectorAll(selector).forEach((element) => {
      element.textContent = value;
    });
  }

  function renderServiceList(services, selectedId) {
    const list = document.querySelector('[data-service-list]');
    if (!list) return;

    list.replaceChildren();
    services.forEach((service) => {
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.href = serviceUrl(service);
      link.textContent = service.title;
      if (service.id === selectedId) {
        item.classList.add('post-active');
        link.setAttribute('aria-current', 'page');
      }
      item.appendChild(link);
      list.appendChild(item);
    });
  }

  function renderServiceCards(services) {
    if (!serviceList) return;

    serviceList.replaceChildren();
    services.forEach((service) => {
      const column = document.createElement('div');
      column.className = 'col-lg-4 col-md-6';

      const article = document.createElement('article');
      article.className = 'pbmit-service-style-3';
      const postItem = document.createElement('div');
      postItem.className = 'pbminfotech-post-item';

      const iconWrapper = document.createElement('div');
      iconWrapper.className = 'pbmit-service-icon-wrapper';
      const icon = document.createElement('i');
      icon.className = service.iconClass;
      iconWrapper.appendChild(icon);

      const title = document.createElement('h3');
      title.className = 'pbmit-service-title';
      const titleLink = document.createElement('a');
      titleLink.href = serviceUrl(service);
      titleLink.textContent = service.title;
      title.appendChild(titleLink);

      const content = document.createElement('div');
      content.className = 'pbmit-service-content';
      const summary = document.createElement('p');
      summary.textContent = service.summary;
      content.appendChild(summary);

      const buttonWrapper = document.createElement('div');
      buttonWrapper.className = 'pbmit-service-btn';
      const button = document.createElement('a');
      button.className = 'btn-arrow';
      button.href = serviceUrl(service);
      button.textContent = 'View Details';
      button.setAttribute('aria-label', `View ${service.title} details`);
      buttonWrapper.appendChild(button);

      postItem.append(iconWrapper, title, content, buttonWrapper);
      article.appendChild(postItem);
      column.appendChild(article);
      serviceList.appendChild(column);
    });
  }

  function renderFeatures(service) {
    const columns = [
      document.querySelector('[data-service-features="primary"]'),
      document.querySelector('[data-service-features="secondary"]'),
    ];
    const midpoint = Math.ceil(service.features.length / 2);
    const featureGroups = [
      service.features.slice(0, midpoint),
      service.features.slice(midpoint),
    ];

    columns.forEach((list, columnIndex) => {
      if (!list) return;
      list.replaceChildren();
      featureGroups[columnIndex].forEach((feature) => {
        const item = document.createElement('li');
        item.className = 'list-group-item';
        const icon = document.createElement('i');
        icon.className = 'pbmit-attorly-icon pbmit-attorly-icon-dot';
        item.append(icon, document.createTextNode(feature));
        list.appendChild(item);
      });
    });
  }

  function renderFaqs(service) {
    const accordion = document.querySelector('[data-service-faqs]');
    if (!accordion) return;

    accordion.id = `service-faqs-${service.id}`;
    accordion.replaceChildren();
    service.faqs.forEach((faq, index) => {
      const questionId = `${accordion.id}-question-${index + 1}`;
      const answerId = `${accordion.id}-answer-${index + 1}`;
      const item = document.createElement('div');
      item.className = 'accordion-item';

      const heading = document.createElement('h2');
      heading.className = 'accordion-header';
      heading.id = questionId;

      const button = document.createElement('button');
      button.className = 'accordion-button collapsed';
      button.type = 'button';
      button.dataset.bsToggle = 'collapse';
      button.dataset.bsTarget = `#${answerId}`;
      button.setAttribute('aria-expanded', 'false');
      button.setAttribute('aria-controls', answerId);
      const number = document.createElement('span');
      number.textContent = String(index + 1).padStart(2, '0');
      button.append(number, document.createTextNode(` ${faq.question}`));
      heading.appendChild(button);

      const answer = document.createElement('div');
      answer.id = answerId;
      answer.className = 'accordion-collapse collapse';
      answer.setAttribute('aria-labelledby', questionId);
      answer.dataset.bsParent = `#${accordion.id}`;
      const body = document.createElement('div');
      body.className = 'accordion-body';
      body.textContent = faq.answer;
      answer.appendChild(body);

      item.append(heading, answer);
      accordion.appendChild(item);
    });
  }

  try {
    const response = await fetch('js/data/services.json');
    if (!response.ok) {
      throw new Error(`Unable to load service data (${response.status})`);
    }

    const services = await response.json();
    if (!Array.isArray(services) || services.length === 0) {
      throw new Error('Service data must be a non-empty array');
    }

    homeCards.forEach((card) => {
      const service = services.find((item) => item.id === card.dataset.serviceCardId);
      if (!service) {
        throw new Error(`Service not found: ${card.dataset.serviceCardId}`);
      }

      const url = serviceUrl(service);
      const titleLink = card.querySelector('.pbmit-service-title a');
      const image = card.querySelector('.pbmit-featured-wrapper img');
      const imageWrapper = card.querySelector('.pbmit-service-image-wrapper');
      const summary = card.querySelector('.pbmit-service-content p');
      const number = card.querySelector('.pbminfotech-box-number');
      const icon = card.querySelector('.pbmit-service-icon-wrapper i');
      const button = card.querySelector('.pbmit-service-btn a');

      if (titleLink) {
        titleLink.href = url;
        titleLink.textContent = service.title;
      }
      if (image) {
        image.src = service.image;
        image.alt = service.title;
      }
      if (imageWrapper) {
        imageWrapper.style.backgroundImage = `url("${service.image}")`;
      }
      if (summary) summary.textContent = service.summary;
      if (number) number.textContent = service.number;
      if (icon) icon.className = service.iconClass;
      if (button) {
        button.href = url;
        button.setAttribute('aria-label', `View ${service.title}`);
      }
    });

    renderServiceCards(services);
    if (!serviceDetail) return;

    const requestedId = new URLSearchParams(window.location.search).get('id') || 'international-law-justice';
    const service = services.find((item) => item.id === requestedId);
    if (!service) {
      throw new Error(`Service not found: ${requestedId}`);
    }

    const brand = window.siteBrand || 'Aarohan Law Chambers';
    const updateDocumentTitle = () => {
      document.title = `${service.title} – ${window.siteBrand || brand}`;
    };
    updateDocumentTitle();
    window.addEventListener('siteConfigLoaded', updateDocumentTitle);

    setText('[data-service-title]', service.title);
    setText('[data-service-breadcrumb-title]', service.title);
    setText('[data-service-faq-title]', `Questions about ${service.title}?`);
    setText('[data-service-faq-intro]', service.faqIntro);

    const mainImage = serviceDetail.querySelector('[data-service-image]');
    if (mainImage) {
      mainImage.src = service.image;
      mainImage.alt = service.title;
    }

    const descriptions = serviceDetail.querySelector('[data-service-descriptions]');
    if (descriptions) {
      descriptions.replaceChildren();
      service.description.forEach((text) => {
        const paragraph = document.createElement('p');
        paragraph.textContent = text;
        descriptions.appendChild(paragraph);
      });
    }

    renderServiceList(services, service.id);
    renderFeatures(service);
    renderFaqs(service);

    serviceDetail.querySelectorAll('[data-service-detail-image]').forEach((image) => {
      const imagePath = service.detailImages[Number(image.dataset.serviceDetailImage)];
      if (imagePath) {
        image.src = imagePath;
        image.alt = service.title;
      }
    });
  } catch (error) {
    console.error('Service data failed to load.', error);
    const errorMessage = document.querySelector('[data-service-error]');
    if (errorMessage) {
      errorMessage.hidden = false;
      errorMessage.textContent = 'Service details could not be loaded. Please try again later.';
      const content = document.querySelector('[data-service-content]');
      if (content) content.hidden = true;
    }
    const listError = document.querySelector('[data-service-list-error]');
    if (listError) {
      listError.hidden = false;
      listError.textContent = 'Services could not be loaded. Please try again later.';
    }
  }
})();
