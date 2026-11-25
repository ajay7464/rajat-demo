(function () {
  const TEAM_JSON_URL = 'js/data/team_members.json';
  const GOOGLE_DRIVE_LINK = 'https://docs.google.com/spreadsheets/d/1D_s-kgEhZ_9YggPgRRYa4u4Iyn6xdu_ZJJnMnV7ux-A/edit?usp=sharing';
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

        const sno = getValue(['sno', 's_no', 'serial_no', 'serial_number', 'id']);
        const name = getValue(['name', 'full_name', 'member_name', 'team_member_name']);
        const role = getValue(['role', 'position', 'designation', 'title']);
        const image = getValue(['image', 'photo', 'profile_image', 'avatar', 'image_url']);
        const client = getValue(['client']);
        const phone = getValue(['phone', 'mobile', 'telephone']);
        const email = getValue(['email', 'email_address']);
        const personalInfo = getValue(['personal_info', 'personal_info_1', 'description', 'bio']);
        const practiceArea = getValue(['practice_area', 'practice_area_percent']);
        const successCase = getValue(['success_case', 'success_case_percent']);

        if (!name) {
          return null;
        }

        return {
          sno: sno || '',
          name,
          role: role || 'Team Member',
          image: image || 'images/team/default-team.jpg',
          client: client || '',
          phone: phone || '',
          email: email || '',
          personal_info: personalInfo ? [personalInfo] : [],
          skills: [
            { label: 'PRACTICE AREA', percent: Number(practiceArea) || 80 },
            { label: 'SUCCESS CASE', percent: Number(successCase) || 92 }
          ],
          education: [],
          socials: extractSocials(row, columnMap).filter(Boolean)
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
      return;
    }

    const downloadUrl = getGoogleDriveDownloadUrl(link);
    if (!downloadUrl) {
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
      const jsonMembers = window.teamMembers || [];
      const mergedMembers = parsedMembers.map((parsedMember) => {
        const jsonMember = jsonMembers.find((item) =>
          String(item.sno) === String(parsedMember.sno)
        );
        if (!jsonMember) return parsedMember;

        return {
          ...jsonMember,
          ...parsedMember,
          name: parsedMember.name || jsonMember.name,
          role: parsedMember.role || jsonMember.role,
          image: parsedMember.image || jsonMember.image,
          client: parsedMember.client || jsonMember.client,
          phone: parsedMember.phone || jsonMember.phone,
          email: parsedMember.email || jsonMember.email,
          personal_info: parsedMember.personal_info?.length ? parsedMember.personal_info : jsonMember.personal_info,
          skills: (parsedMember.skills?.[0]?.percent && parsedMember.skills[0].percent !== 80)
            ? parsedMember.skills
            : jsonMember.skills,
          education: jsonMember.education || [],
          socials: parsedMember.socials.length ? parsedMember.socials : jsonMember.socials
        };
      });

      window.teamMembers = mergedMembers.length ? mergedMembers : jsonMembers;
      window.dispatchEvent(new CustomEvent('teamDataLoaded', { detail: window.teamMembers }));
    } catch (error) {
      console.warn('Google Drive team data failed to load. JSON team data remains available.', error);
    }
  }

  async function loadTeamDataFromJson() {
    try {
      const response = await fetch(TEAM_JSON_URL);
      if (!response.ok) {
        throw new Error('Unable to load team JSON');
      }

      const members = await response.json();
      if (Array.isArray(members) && members.length) {
        window.teamMembers = members;
        window.dispatchEvent(new CustomEvent('teamDataLoaded', { detail: members }));
        return members;
      }
    } catch (error) {
      console.warn('Team JSON failed to load.', error);
    }

    window.teamMembers = [];
    window.dispatchEvent(new CustomEvent('teamDataLoaded', { detail: [] }));
    return [];
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

  window.googleDriveExcelLink = GOOGLE_DRIVE_LINK;
  window.googleDriveSheetIndex = GOOGLE_SHEET_INDEX;
  window.teamMembers = [];
  window.loadTeamMembersFromGoogleDrive = loadFromGoogleDrive;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', async function () {
      await loadTeamDataFromJson();
      await window.loadTeamMembersFromGoogleDrive(window.googleDriveExcelLink);
    });
  } else {
    (async function () {
      await loadTeamDataFromJson();
      await window.loadTeamMembersFromGoogleDrive(window.googleDriveExcelLink);
    })();
  }
})();

