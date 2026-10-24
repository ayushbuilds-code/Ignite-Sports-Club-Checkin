export type CheckInStatus = 'Pending' | 'Present';
export type CheckInMethod = 'photo' | 'manual';

export interface Team {
  id: string;                    // e.g. "IGN-01"
  name: string;                  // e.g. "Total Gaming Esports"
  leaderName: string;            // e.g. "Ajay Sharma"
  leaderPhone?: string;          // e.g. "+91 9876543210"
  leaderIgId?: string;           // In-game UID / IGN
  players: string[];             // Roster names
  rosterSize: number;            // Total players including sub
  slotNumber: number;            // Slot / Table allocation (1-12+)
  status: CheckInStatus;         // 'Pending' or 'Present'
  photoUrl?: string;             // Base64 Data URL stored locally in IndexedDB
  checkInTimestamp?: string;     // ISO timestamp
  checkInMethod?: CheckInMethod; // 'photo' or 'manual'
  consentObtained: boolean;      // Leader consented to attendance photo
  isSample?: boolean;            // Clearly marks seeded demo data
  notes?: string;                // Table / seat notes
  group?: string;                // Group A, Group B, Finals
}

export type ActivityAction =
  | 'CHECK_IN'
  | 'UNDO_CHECK_IN'
  | 'ADD_TEAM'
  | 'EDIT_TEAM'
  | 'DELETE_TEAM'
  | 'PHOTO_DELETED'
  | 'CSV_IMPORT'
  | 'DEMO_RESET';

export interface ActivityLog {
  id: string;
  teamId: string;
  teamName: string;
  leaderName: string;
  action: ActivityAction;
  method?: CheckInMethod;
  timestamp: string;
  details?: string;
  photoUrl?: string;
}

export interface TournamentSettings {
  id: string;                    // 'tournament_config'
  tournamentName: string;        // "Ignite Club Championship — Battle Royale"
  game: string;                  // "Free Fire Esports"
  format: string;                // "Squad Battle Royale (12 Teams / Lobby)"
  roomId: string;                // Custom Room ID
  roomPassword: string;          // Room Password
  matchNumber: number;           // Match 1 / Match 2
  scheduledTime: string;         // "Today 02:00 PM"
  venue: string;                 // "Ignite Arena / Main Stage"
  organizer: string;             // "Ignite Club Admin Desk"
  totalSlots: number;            // 12
}

export interface CheckInStats {
  total: number;
  present: number;
  pending: number;
  percentage: number;
  photoVerifiedCount: number;
  manualCount: number;
}
