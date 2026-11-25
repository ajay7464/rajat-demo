(function () {
  function renderTeamSocialLinks(socials = []) {
    return socials.map((social) => `
      <li class="pbmit-social-li pbmit-social-${social.name}">
        <a href="${social.url || '#'}" title="${(social.name || 'Social').charAt(0).toUpperCase() + (social.name || 'Social').slice(1)}" target="_blank">
          <span><i class="${social.icon || 'pbmit-base-icon-link'}"></i></span>
        </a>
      </li>
    `).join('');
  }

  function renderHomeTeam(teamMembers) {
    const teamImagesRow = document.getElementById('teamImagesRow');
    const teamContentRow = document.getElementById('teamContentRow');

    if (!teamImagesRow || !teamContentRow) return;

    teamImagesRow.innerHTML = teamMembers.map((member) => `
      <div class="col-md-12 col-lg-4">
        <div class="pbmit-team-style-1">
          <div class="pbminfotech-post-item">
            <div class="pbmit-featured-img-wrapper">
              <div class="pbmit-featured-wrapper">
                <img src="${member.image}" class="img-fluid" alt="${member.name}">
              </div>
            </div>
          </div>
        </div>
      </div>
    `).join('');

    teamContentRow.innerHTML = teamMembers.map((member) => `
      <div class="col-md-12 col-lg-4">
        <div class="pbminfotech-box-content">
          <div class="pbminfotech-box-content-inner">
            <h3 class="pbmit-team-title">
              <a href="team-member-details.html?sno=${encodeURIComponent(member.sno)}">${member.name}</a>
            </h3>
            <div class="pbminfotech-team-position">
              <div class="pbminfotech-box-team-position">${member.role}</div>
            </div>
            <div class="pbminfotech-social-box">
              <div class="pbminfotech-box-social-links">
                <ul class="pbmit-social-links pbmit-team-social-links">
                  ${renderTeamSocialLinks(member.socials)}
                </ul>
              </div>
            </div>
          </div>
          <div class="pbmit-featured-img-wrapper">
            <div class="pbmit-featured-wrapper">
              <img src="${member.image}" class="img-fluid" alt="${member.name}">
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }

  function renderTeamCarousel(teamMembers) {
    const teamMembersWrapper = document.getElementById('teamMembersWrapper');

    if (!teamMembersWrapper) return;

    teamMembersWrapper.innerHTML = teamMembers.map((member) => `
      <div class="swiper-slide">
        <article class="pbmit-team-style-2">
          <div class="pbminfotech-post-item">
            <div class="pbminfotech-team-image-box">
              <div class="pbminfotech-box-social-links">
                <ul class="pbmit-social-links pbmit-team-social-links">
                  ${renderTeamSocialLinks(member.socials)}
                </ul>
              </div>
              <div class="pbmit-featured-img-wrapper">
                <div class="pbmit-featured-wrapper">
                  <img src="${member.image}" class="img-fluid" alt="${member.name}">
                </div>
              </div>
            </div>
            <div class="pbminfotech-box-content">
              <div class="pbminfotech-box-content-inner">
                <h3 class="pbmit-team-title">
                  <a href="team-member-details.html?sno=${encodeURIComponent(member.sno)}">${member.name}</a>
                </h3>
                <div class="pbminfotech-team-position">
                  <div class="pbminfotech-box-team-position">${member.role}</div>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    `).join('');
  }

  function renderTeamMembers() {
    const teamMembers = window.teamMembers || [];
    renderHomeTeam(teamMembers);
    renderTeamCarousel(teamMembers);
    renderTeamDetails(teamMembers);
  }

  function renderTeamDetails(teamMembers) {
    const detailName = document.getElementById('teamDetailName');
    if (!detailName) return;

    const params = new URLSearchParams(window.location.search);
    const requestedSno = params.get('sno');
    const requestedName = params.get('member') || params.get('name') || params.get('title');

    const member = requestedSno
      ? teamMembers.find((item) => String(item.sno) === String(requestedSno))
      : requestedName
        ? teamMembers.find((item) => item.name.toLowerCase() === requestedName.toLowerCase())
        : teamMembers[0];

    if (!member) return;

    const detailImage = document.getElementById('teamDetailImage');
    const detailRole = document.getElementById('teamDetailRole');
    const detailSocials = document.getElementById('teamDetailSocials');

    if (detailImage) {
      detailImage.src = member.image;
      detailImage.alt = member.name;
    }
    if (detailRole) detailRole.textContent = member.role;
    detailName.textContent = member.name;
    if (detailSocials) detailSocials.innerHTML = renderTeamSocialLinks(member.socials);

    const detailClient = document.getElementById('teamDetailClient');
    const detailPhone = document.getElementById('teamDetailPhone');
    const detailEmail = document.getElementById('teamDetailEmail');
    const detailEmailText = document.getElementById('teamDetailEmailText');

    if (detailClient) detailClient.textContent = member.client || 'PBM Infotech';
    if (detailPhone) detailPhone.textContent = ` ${member.phone || '+ (123) 1800-567-8990'}`;
    if (detailEmailText) detailEmailText.textContent = member.email || '';
    if (detailEmail) detailEmail.href = member.email ? `mailto:${member.email}` : '#';

    const personalInfo = document.getElementById('teamDetailPersonalInfo');
    if (personalInfo) {
      personalInfo.innerHTML = (member.personal_info || []).map((text) => `<p>${text}</p>`).join('');
    }

    const skills = document.getElementById('teamDetailSkills');
    if (skills) {
      skills.innerHTML = (member.skills || []).map((skill) => `
        <div class="progressbar">
          <span class="progress-label">${skill.label}</span>
          <div class="progress progress-lg progress-percent-bg">
            <div class="progress-bar aos aos-init aos-animate" data-aos="slide-right"
              data-aos-delay="200" data-aos-duration="1000" data-aos-easing="ease-in-out"
              role="progressbar" aria-valuenow="${skill.percent}" aria-valuemin="0" aria-valuemax="100"
              style="width:${skill.percent}%">
            </div>
            <span class="progress-percent">${skill.percent}%</span>
          </div>
        </div>
      `).join('');
    }

    const education = document.getElementById('teamDetailEducation');
    if (education) {
      education.innerHTML = (member.education || []).map((item) => `
        <div class="d-flex justify-content-start">
          <h2>${item.period} :</h2>
          <p>${item.detail}</p>
        </div>
      `).join('');
    }

    const detailBreadcrumb = document.getElementById('teamDetailBreadcrumb');
    if (detailBreadcrumb) detailBreadcrumb.textContent = member.name.toUpperCase();

    const titleBarName = document.querySelector('.pbmit-tbar-title');
    if (titleBarName) titleBarName.textContent = member.name;

    const brandName = window.siteBrand || '';
    document.title = brandName ? `${member.name} – ${brandName}` : member.name;
  }

  window.addEventListener('teamDataLoaded', renderTeamMembers);
  window.addEventListener('siteConfigLoaded', renderTeamMembers);
  renderTeamMembers();
})();
