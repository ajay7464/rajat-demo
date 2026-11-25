(async function () {
  const detail = document.querySelector('[data-portfolio-detail]');
  if (!detail) return;

  function setText(selector, value) {
    document.querySelectorAll(selector).forEach((element) => {
      element.textContent = value;
    });
  }

  function createParagraph(content) {
    const paragraph = document.createElement('p');
    content.forEach((part) => {
      if (part.emphasis) {
        const emphasis = document.createElement('strong');
        emphasis.textContent = part.text;
        paragraph.appendChild(emphasis);
      } else {
        paragraph.appendChild(document.createTextNode(part.text));
      }
    });
    return paragraph;
  }

  try {
    const response = await fetch('js/data/portfolio.json');
    if (!response.ok) {
      throw new Error(`Unable to load portfolio detail data (${response.status})`);
    }

    const projects = await response.json();
    if (!Array.isArray(projects)) {
      throw new Error('Portfolio data must be an array');
    }

    const requestedId = new URLSearchParams(window.location.search).get('id') || 'tax-consultancy';
    const project = projects.find((item) => item.id === requestedId);
    if (!project) {
      throw new Error(`Portfolio project not found: ${requestedId}`);
    }

    setText('[data-detail-title]', project.title);
    setText('[data-detail-category]', project.category);
    setText('[data-detail-heading]', project.heading);
    setText('[data-detail-subheading]', project.subheading);
    setText('[data-detail-description]', project.description);

    const pageTitle = document.querySelector('[data-page-title]');
    const brand = window.siteBrand || 'Aarohan Law Chambers';
    if (pageTitle) pageTitle.textContent = `${project.title} – ${brand}`;
    document.title = `${project.title} – ${brand}`;

    const mainImage = detail.querySelector('[data-detail-image]');
    if (mainImage) {
      mainImage.src = project.image;
      mainImage.alt = project.title;
    }

    setText('[data-detail-client]', project.metadata.client);
    setText('[data-detail-team]', project.metadata.team);
    setText('[data-detail-date]', project.metadata.date);

    const shareIcons = detail.querySelector('[data-detail-share-icons]');
    if (shareIcons) {
      project.metadata.shareIcons.forEach((iconClass) => {
        const icon = document.createElement('i');
        icon.className = iconClass;
        shareIcons.appendChild(icon);
      });
    }

    setText('[data-challenge-heading]', project.challenge.heading);
    const challengeCopy = detail.querySelector('[data-challenge-copy]');
    if (challengeCopy) {
      project.challenge.paragraphs.forEach((paragraphText) => {
        const paragraph = document.createElement('p');
        paragraph.textContent = paragraphText;
        challengeCopy.appendChild(paragraph);
      });
    }

    const challengeImages = detail.querySelector('[data-challenge-images]');
    if (challengeImages) {
      project.challenge.images.forEach((image, index) => {
        const column = document.createElement('div');
        column.className = 'col-sm-6';
        const imageElement = document.createElement('img');
        imageElement.src = image.src;
        imageElement.alt = image.alt;
        imageElement.className = `img-fluid${index === 1 ? ' project-img-pd' : ''}`;
        column.appendChild(imageElement);
        challengeImages.appendChild(column);
      });
    }

    setText('[data-solution-heading]', project.solution.heading);
    setText('[data-solution-intro]', project.solution.intro);
    const solutionPoints = detail.querySelector('[data-solution-points]');
    if (solutionPoints) {
      project.solution.points.forEach((point) => {
        const item = document.createElement('li');
        item.className = 'list-group-item';
        const marker = document.createElement('i');
        marker.className = 'pbmit-attorly-icon pbmit-attorly-icon-dot';
        item.append(marker, document.createTextNode(point));
        solutionPoints.appendChild(item);
      });
    }

    const solutionParagraphs = detail.querySelector('[data-solution-paragraphs]');
    if (solutionParagraphs) {
      project.solution.paragraphs.forEach((content) => {
        solutionParagraphs.appendChild(createParagraph(content));
      });
    }

    setText('[data-result-heading]', project.result.heading);
    setText('[data-result-description]', project.result.description);
    setText('[data-result-quote]', project.result.quote);
    setText('[data-result-quote-author]', project.result.quoteAuthor);
    setText('[data-result-quote-author-description]', project.result.quoteAuthorDescription);
  } catch (error) {
    console.error('Portfolio detail data failed to load.', error);
  }
})();
