(function () {
  const fallbackData = {
    phones: ['1300 877 503'],
    emails: ['hello@attorly.com'],
    addresses: ['Grand Conference<br>Hall 881 7th Ave<br>New York, NY']
  };

  function toArray(value) {
    return Array.isArray(value) ? value : value ? [value] : [];
  }

  function renderContactData(data) {
    const phones = toArray(data.phones || data.phone).length
      ? toArray(data.phones || data.phone)
      : fallbackData.phones;
    const emails = toArray(data.emails || data.email).length
      ? toArray(data.emails || data.email)
      : fallbackData.emails;
    const addresses = toArray(data.addresses || data.address).length
      ? toArray(data.addresses || data.address)
      : fallbackData.addresses;

    const phoneField = document.querySelector('[data-contact-field="phone"] h2');
    const emailField = document.querySelector('[data-contact-field="email"] h2');
    const addressField = document.querySelector('[data-contact-field="address"] h2');

    if (phoneField) {
      phoneField.innerHTML = phones
        .map((phone) => `<a href="tel:${phone.replace(/[^+\d]/g, '')}">${phone}</a>`)
        .join('<br>');
    }

    if (emailField) {
      emailField.innerHTML = emails
        .map((email) => `<a href="mailto:${email}">${email}</a>`)
        .join('<br>');
    }

    if (addressField) {
      addressField.innerHTML = addresses.join('<br><br>');
    }
  }

  function loadContactData() {
    fetch('js/data/contact-info.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch contact info');
        }
        return response.json();
      })
      .then((data) => renderContactData(data))
      .catch(() => renderContactData(fallbackData));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadContactData);
  } else {
    loadContactData();
  }
})();
