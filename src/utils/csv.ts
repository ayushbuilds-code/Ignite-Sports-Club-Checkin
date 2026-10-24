import { Team } from '../types';

/**
 * Generates an attendance register CSV from the current team list
 */
export function exportAttendanceCSV(teams: Team[]): void {
  const headers = [
    'Slot Number',
    'Team ID',
    'Team Name',
    'Leader Name',
    'Leader Contact',
    'Leader In-Game ID',
    'Roster Size',
    'Players',
    'Attendance Status',
    'Check-In Timestamp',
    'Verification Method',
    'Leader Consent',
    'Table Notes',
  ];

  const rows = teams.map((t) => [
    t.slotNumber,
    `"${t.id.replace(/"/g, '""')}"`,
    `"${t.name.replace(/"/g, '""')}"`,
    `"${t.leaderName.replace(/"/g, '""')}"`,
    `"${(t.leaderPhone || '').replace(/"/g, '""')}"`,
    `"${(t.leaderIgId || '').replace(/"/g, '""')}"`,
    t.rosterSize,
    `"${t.players.join(', ').replace(/"/g, '""')}"`,
    t.status,
    t.checkInTimestamp ? `"${new Date(t.checkInTimestamp).toLocaleString()}"` : '"N/A"',
    t.checkInMethod ? (t.checkInMethod === 'photo' ? 'Photo Verified' : 'Manual Verified') : 'Pending',
    t.consentObtained ? 'Yes' : 'No',
    `"${(t.notes || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const dateStr = new Date().toISOString().slice(0, 10);
  link.setAttribute('href', url);
  link.setAttribute('download', `Ignite_Club_Tournament_Attendance_${dateStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Downloads a sample CSV template for team registration
 */
export function downloadSampleCSVTemplate(): void {
  const csvContent = `Team ID,Team Name,Leader Name,Leader Phone,In Game ID,Slot,Players,Notes
IGN-13,HyperStrike,Vikram Malhotra,9876511223,HS_VikramOP,13,Vikram (IGN: HS_VikramOP • UID: 1839581450);Shadow;Reaper;Nova,Table B1
IGN-14,Aces High,Priya Deshmukh,9822144556,AH_QueenPriya,14,Priya (Leader);Ace;Blaze;Thunder,Table B2`;

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'Ignite_Team_Import_Template.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export interface CSVParseResult {
  validTeams: Team[];
  errors: string[];
  warnings: string[];
}

/**
 * Parses and validates CSV content for team import
 */
export function parseTeamsCSV(csvText: string, existingTeams: Team[]): CSVParseResult {
  const lines = csvText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const errors: string[] = [];
  const warnings: string[] = [];
  const validTeams: Team[] = [];

  if (lines.length < 2) {
    errors.push('CSV file is empty or does not have a data row.');
    return { validTeams, errors, warnings };
  }

  // Parse header
  const headerCols = parseCSVLine(lines[0]).map((h) => h.toLowerCase().trim());

  // Determine column indexes
  const colIndex = {
    id: headerCols.findIndex((h) => h.includes('id') || h.includes('code') || h.includes('team_id')),
    name: headerCols.findIndex((h) => h.includes('team name') || h === 'name' || h.includes('team')),
    leader: headerCols.findIndex((h) => h.includes('leader') || h.includes('captain') || h.includes('igl')),
    phone: headerCols.findIndex((h) => h.includes('phone') || h.includes('contact') || h.includes('mobile')),
    igid: headerCols.findIndex((h) => h.includes('ingame') || h.includes('game id') || h.includes('ign') || h.includes('uid')),
    slot: headerCols.findIndex((h) => h.includes('slot') || h.includes('table')),
    players: headerCols.findIndex((h) => h.includes('players') || h.includes('roster') || h.includes('members')),
    notes: headerCols.findIndex((h) => h.includes('notes') || h.includes('group') || h.includes('table')),
  };

  if (colIndex.id === -1 || colIndex.name === -1 || colIndex.leader === -1) {
    errors.push('Missing required column headers: Team ID, Team Name, and Leader Name are required.');
    return { validTeams, errors, warnings };
  }

  const existingIds = new Set(existingTeams.map((t) => t.id.toLowerCase().trim()));
  const batchIds = new Set<string>();

  let nextSlot = Math.max(...existingTeams.map((t) => t.slotNumber || 0), 0) + 1;

  for (let i = 1; i < lines.length; i++) {
    const row = parseCSVLine(lines[i]);
    if (row.length === 0 || (row.length === 1 && !row[0])) continue;

    const rowNum = i + 1;
    const id = (row[colIndex.id] || '').trim();
    const name = (row[colIndex.name] || '').trim();
    const leaderName = (row[colIndex.leader] || '').trim();
    const phone = colIndex.phone !== -1 ? (row[colIndex.phone] || '').trim() : '';
    const igid = colIndex.igid !== -1 ? (row[colIndex.igid] || '').trim() : '';
    const slotRaw = colIndex.slot !== -1 ? parseInt((row[colIndex.slot] || '').trim(), 10) : NaN;
    const playersRaw = colIndex.players !== -1 ? (row[colIndex.players] || '').trim() : '';
    const notes = colIndex.notes !== -1 ? (row[colIndex.notes] || '').trim() : '';

    if (!id) {
      errors.push(`Row ${rowNum}: Team ID is empty.`);
      continue;
    }
    if (!name) {
      errors.push(`Row ${rowNum}: Team Name is empty for ID "${id}".`);
      continue;
    }
    if (!leaderName) {
      errors.push(`Row ${rowNum}: Leader Name is empty for "${name}".`);
      continue;
    }

    const lowerId = id.toLowerCase();
    if (batchIds.has(lowerId)) {
      errors.push(`Row ${rowNum}: Duplicate Team ID "${id}" appears more than once in this CSV.`);
      continue;
    }
    if (existingIds.has(lowerId)) {
      warnings.push(`Row ${rowNum}: Team ID "${id}" already exists in dashboard. It will update existing info if confirmed.`);
    }

    batchIds.add(lowerId);

    // Parse players
    let playersList: string[] = [];
    if (playersRaw) {
      // Split by semicolon, comma, or slash
      playersList = playersRaw
        .split(/[;,/]/)
        .map((p) => p.trim())
        .filter((p) => p.length > 0);
    }
    if (playersList.length === 0) {
      playersList = [`${leaderName} (Leader)`];
    }

    const assignedSlot = !isNaN(slotRaw) && slotRaw > 0 ? slotRaw : nextSlot++;

    const newTeam: Team = {
      id,
      name,
      leaderName,
      leaderPhone: phone || undefined,
      leaderIgId: igid || undefined,
      players: playersList,
      rosterSize: Math.max(playersList.length, 4),
      slotNumber: assignedSlot,
      status: 'Pending',
      consentObtained: false,
      isSample: false,
      notes: notes || undefined,
    };

    validTeams.push(newTeam);
  }

  return { validTeams, errors, warnings };
}

/**
 * Simple CSV line parser handling quoted fields
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (insideQuotes && line[i + 1] === '"') {
        current += '"';
        i++; // skip escaped quote
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

/**
 * Downloads a captured leader photo to user's disk
 */
export function downloadLeaderPhoto(team: Team): void {
  if (!team.photoUrl) return;

  const link = document.createElement('a');
  link.href = team.photoUrl;
  const sanitizedName = team.name.replace(/[^a-zA-Z0-9_-]/g, '_');
  link.download = `${team.id}_${sanitizedName}_leader_verified.jpg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
