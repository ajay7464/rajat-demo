(function () {
  const defaultTeamMembers = [
    {
      name: 'Michael Daniel',
      role: 'Co-Founder',
      image: 'images/team/team-01.jpg',
      socials: [
        { name: 'facebook', url: '#', icon: 'pbmit-base-icon-facebook-squared' },
        { name: 'twitter', url: '#', icon: 'pbmit-base-icon-twitter' },
        { name: 'instagram', url: '#', icon: 'pbmit-base-icon-instagram' },
        { name: 'youtube', url: '#', icon: 'pbmit-base-icon-youtube-play' }
      ]
    },
    {
      name: 'Richard Edward',
      role: 'Financial Lawyer',
      image: 'images/team/team-02.jpg',
      socials: [
        { name: 'facebook', url: '#', icon: 'pbmit-base-icon-facebook-squared' },
        { name: 'twitter', url: '#', icon: 'pbmit-base-icon-twitter' },
        { name: 'instagram', url: '#', icon: 'pbmit-base-icon-instagram' },
        { name: 'youtube', url: '#', icon: 'pbmit-base-icon-youtube-play' }
      ]
    },
    {
      name: 'Eliana Ivy',
      role: 'Family Lawyer',
      image: 'images/team/team-03.jpg',
      socials: [
        { name: 'facebook', url: '#', icon: 'pbmit-base-icon-facebook-squared' },
        { name: 'twitter', url: '#', icon: 'pbmit-base-icon-twitter' },
        { name: 'instagram', url: '#', icon: 'pbmit-base-icon-instagram' },
        { name: 'youtube', url: '#', icon: 'pbmit-base-icon-youtube-play' }
      ]
    },
    {
      name: 'Bradley Cody',
      role: 'Civil Lawyer',
      image: 'images/team/team-04.jpg',
      socials: [
        { name: 'facebook', url: '#', icon: 'pbmit-base-icon-facebook-squared' },
        { name: 'twitter', url: '#', icon: 'pbmit-base-icon-twitter' },
        { name: 'instagram', url: '#', icon: 'pbmit-base-icon-instagram' },
        { name: 'youtube', url: '#', icon: 'pbmit-base-icon-youtube-play' }
      ]
    },
    {
      name: 'Catalina Sage',
      role: 'Criminal Lawyer',
      image: 'images/team/team-05.jpg',
      socials: [
        { name: 'facebook', url: '#', icon: 'pbmit-base-icon-facebook-squared' },
        { name: 'twitter', url: '#', icon: 'pbmit-base-icon-twitter' },
        { name: 'instagram', url: '#', icon: 'pbmit-base-icon-instagram' },
        { name: 'youtube', url: '#', icon: 'pbmit-base-icon-youtube-play' }
      ]
    },
    {
      name: 'Raelyn Esme',
      role: 'General Lawyer',
      image: 'images/team/team-06.jpg',
      socials: [
        { name: 'facebook', url: '#', icon: 'pbmit-base-icon-facebook-squared' },
        { name: 'twitter', url: '#', icon: 'pbmit-base-icon-twitter' },
        { name: 'instagram', url: '#', icon: 'pbmit-base-icon-instagram' },
        { name: 'youtube', url: '#', icon: 'pbmit-base-icon-youtube-play' }
      ]
    }
  ];

  const GOOGLE_DRIVE_LINK = 'https://docs.google.com/spreadsheets/d/1SyXXqMb8WDMV2_zLAKgN63mCM4m7HqIIrQ9MmH09Vz0/edit?usp=sharing';
  const GOOGLE_SHEET_INDEX = 0;

  function normalizeKey(value) {
    return String(value || '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');
  }

  function normalizeText(value) {
    return String(value ?? '').trim();
  }

  function getGoogleDriveDownloadUrl(link) {
    if (!link) return null;

    const value = link.trim();
    const spreadsheetMatch = value.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    if (spreadsheetMatch) {
      return `https://docs.google.com/spreadsheets/d/${spreadsheetMatch[1]}/export?format=xlsx`;
    }

    const driveFileMatch = value.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (driveFileMatch) {
      return `https://drive.google.com/uc?export=download&id=${driveFileMatch[1]}`;
    }

    return value;
  }

  function buildSocialItem(name, url, iconMap) {
    if (!name || !url) return null;

    const safeName = String(name).trim().toLowerCase();
    const icon = iconMap[safeName] || 'pbmit-base-icon-link';

    return {
      name: safeName,
      url: String(url).trim(),
      icon
    };
  }

  function extractSocials(row, headerMap) {
    const socialConfig = {
      facebook: 'pbmit-base-icon-facebook-squared',
      twitter: 'pbmit-base-icon-twitter',
      instagram: 'pbmit-base-icon-instagram',
      youtube: 'pbmit-base-icon-youtube-play',
      linkedin: 'pbmit-base-icon-linkedin',
      skype: 'pbmit-base-icon-skype'
    };

    const socials = [];

    Object.keys(socialConfig).forEach((socialName) => {
      const directValue = row[headerMap[`${socialName}_url`] || headerMap[`${socialName}_link`] || headerMap[socialName]];
      const urlValue = normalizeText(directValue || '');
      if (urlValue) {
        socials.push(buildSocialItem(socialName, urlValue, socialConfig));
      }
    });

    return socials;
  }

  function buildTeamMembersFromRows(rows) {
    if (!rows || rows.length === 0) {
      return [];
    }

    const headers = rows[0].map((header) => normalizeKey(header));
    const columnMap = {};

    headers.forEach((header, index) => {
      columnMap[header] = index;
    });

    return rows.slice(1)
      .filter((row) => row && row.some((cell) => normalizeText(cell) !== ''))
      .map((row) => {
        const getValue = (keys) => {
          for (const key of keys) {
            const index = columnMap[key];
            if (index !== undefined && row[index] !== undefined && row[index] !== null) {
              return normalizeText(row[index]);
            }
          }
          return '';
        };

        const name = getValue(['name', 'full_name', 'member_name', 'team_member_name']);
        const role = getValue(['role', 'position', 'designation', 'title']);
        const image = getValue(['image', 'photo', 'profile_image', 'avatar', 'image_url']);

        const rowByKey = {};
        headers.forEach((header, index) => {
          rowByKey[header] = row[index];
        });

        const socials = extractSocials(rowByKey, columnMap).filter(Boolean);

        if (!name) {
          return null;
        }

        return {
          name,
          role: role || 'Team Member',
          image: image || 'images/team/default-team.jpg',
          socials: socials.length ? socials : [
            { name: 'facebook', url: '#', icon: 'pbmit-base-icon-facebook-squared' },
            { name: 'twitter', url: '#', icon: 'pbmit-base-icon-twitter' },
            { name: 'instagram', url: '#', icon: 'pbmit-base-icon-instagram' },
            { name: 'youtube', url: '#', icon: 'pbmit-base-icon-youtube-play' }
          ]
        };
      })
      .filter(Boolean);
  }

  function parseWorkbookToTeamMembers(workbook) {
    if (!workbook || !workbook.SheetNames || workbook.SheetNames.length === 0) {
      return [];
    }

    const sheetIndex = Number(window.googleDriveSheetIndex ?? GOOGLE_SHEET_INDEX);
    const safeSheetIndex = Number.isFinite(sheetIndex) && sheetIndex >= 0 ? sheetIndex : 0;
    const selectedSheetName = workbook.SheetNames[safeSheetIndex] || workbook.SheetNames[0];
    const selectedSheet = workbook.Sheets[selectedSheetName];

    if (!selectedSheet) {
      return [];
    }

    const rows = XLSX.utils.sheet_to_json(selectedSheet, { header: 1, defval: '' });
    return buildTeamMembersFromRows(rows);
  }

  async function loadFromGoogleDrive(link) {
    if (!link || link === 'PASTE_YOUR_GOOGLE_DRIVE_LINK_HERE') {
      window.teamMembers = defaultTeamMembers;
      window.dispatchEvent(new CustomEvent('teamDataLoaded', { detail: window.teamMembers }));
      return;
    }

    const downloadUrl = getGoogleDriveDownloadUrl(link);
    if (!downloadUrl) {
      window.teamMembers = defaultTeamMembers;
      window.dispatchEvent(new CustomEvent('teamDataLoaded', { detail: window.teamMembers }));
      return;
    }

    try {
      if (!window.XLSX) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
        script.onload = async () => {
          await loadFromGoogleDrive(link);
        };
        document.head.appendChild(script);
        return;
      }

      const response = await fetch(downloadUrl, { method: 'GET' });
      if (!response.ok) {
        throw new Error('Unable to download Excel file from Google Drive');
      }

      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const parsedMembers = parseWorkbookToTeamMembers(workbook);

      window.teamMembers = parsedMembers.length ? parsedMembers : defaultTeamMembers;
      window.dispatchEvent(new CustomEvent('teamDataLoaded', { detail: window.teamMembers }));
    } catch (error) {
      console.warn('Google Drive team data failed to load. Using fallback team data.', error);
      window.teamMembers = defaultTeamMembers;
      window.dispatchEvent(new CustomEvent('teamDataLoaded', { detail: window.teamMembers }));
    }
  }

  window.googleDriveExcelLink = GOOGLE_DRIVE_LINK;
  window.googleDriveSheetIndex = GOOGLE_SHEET_INDEX;
  window.teamMembers = defaultTeamMembers;
  window.loadTeamMembersFromGoogleDrive = loadFromGoogleDrive;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      window.loadTeamMembersFromGoogleDrive(window.googleDriveExcelLink);
    });
  } else {
    window.loadTeamMembersFromGoogleDrive(window.googleDriveExcelLink);
  }
})();

