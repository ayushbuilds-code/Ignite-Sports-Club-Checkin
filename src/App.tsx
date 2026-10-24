import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Trophy, 
  Users, 
  PlusCircle, 
  RefreshCw,
  AlertCircle
} from 'lucide-react';

import { Team, ActivityLog, TournamentSettings, CheckInStats } from './types';
import { dbService } from './services/db';
import { exportAttendanceCSV } from './utils/csv';
import { triggerCheckInConfetti, playCheckInAudioChime } from './utils/feedback';

// Components
import { Header } from './components/Header';
import { StatsOverview } from './components/StatsOverview';
import { TeamCard } from './components/TeamCard';
import { TeamRow } from './components/TeamRow';
import { ActivityFeed } from './components/ActivityFeed';
import { QuickDeskMode } from './components/QuickDeskMode';
import { CameraModal } from './components/CameraModal';
import { ManualCheckInModal } from './components/ManualCheckInModal';
import { UndoCheckInModal } from './components/UndoCheckInModal';
import { TeamFormModal } from './components/TeamFormModal';
import { DeleteTeamModal } from './components/DeleteTeamModal';
import { CsvImportModal } from './components/CsvImportModal';
import { BackupModal } from './components/BackupModal';
import { ResetDemoModal } from './components/ResetDemoModal';
import { TournamentSettingsModal } from './components/TournamentSettingsModal';
import { StageScreenModal } from './components/StageScreenModal';
import { PrintAttendanceSheet } from './components/PrintAttendanceSheet';
import { PhotoViewModal } from './components/PhotoViewModal';
import { ToastContainer, ToastMessage } from './components/Toast';
import { TacticalBackground } from './components/TacticalBackground';

export function App() {
  // --- Persistent & Core State ---
  const [teams, setTeams] = useState<Team[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [settings, setSettings] = useState<TournamentSettings | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dbError, setDbError] = useState<string | null>(null);

  // --- UI & Filter State ---
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PRESENT' | 'PENDING'>('ALL');
  const [sortBy, setSortBy] = useState<'slot' | 'name' | 'id' | 'checkInTime'>('slot');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [quickDeskMode, setQuickDeskMode] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    return localStorage.getItem('ignite_sound_enabled') !== 'false';
  });

  // --- Modals State ---
  const [cameraTeam, setCameraTeam] = useState<Team | null>(null);
  const [manualCheckInTeam, setManualCheckInTeam] = useState<Team | null>(null);
  const [undoCheckInTeam, setUndoCheckInTeam] = useState<Team | null>(null);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [isAddTeamOpen, setIsAddTeamOpen] = useState<boolean>(false);
  const [deleteTeam, setDeleteTeam] = useState<Team | null>(null);
  const [isImportCsvOpen, setIsImportCsvOpen] = useState<boolean>(false);
  const [isBackupOpen, setIsBackupOpen] = useState<boolean>(false);
  const [isResetDemoOpen, setIsResetDemoOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isStageScreenOpen, setIsStageScreenOpen] = useState<boolean>(false);
  const [isPrintSheetOpen, setIsPrintSheetOpen] = useState<boolean>(false);
  const [viewingPhoto, setViewingPhoto] = useState<{ url: string; title: string; teamId?: string } | null>(null);

  // --- Toasts State ---
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: ToastMessage['type'], title: string, message?: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // --- Initial Data Load ---
  const loadDatabaseData = useCallback(async () => {
    setIsLoading(true);
    setDbError(null);
    try {
      await dbService.initialize();
      let fetchedTeams = await dbService.getAllTeams();

      // If database is empty or still contains old demo teams, immediately seed official registered teams
      if (
        fetchedTeams.length === 0 ||
        fetchedTeams.some((t) => t.name.toLowerCase().includes('total gaming'))
      ) {
        await dbService.resetToDemoData();
        fetchedTeams = await dbService.getAllTeams();
      }

      const [fetchedLogs, fetchedSettings] = await Promise.all([
        dbService.getAllActivityLogs(),
        dbService.getSettings(),
      ]);
      setTeams(fetchedTeams);
      setActivityLogs(fetchedLogs);
      setSettings(fetchedSettings);
    } catch (err: unknown) {
      const error = err as Error;
      setDbError(error.message || 'Failed to initialize tournament database.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDatabaseData();
  }, [loadDatabaseData]);

  // Toggle Sound Preference
  const handleToggleSound = () => {
    const nextVal = !soundEnabled;
    setSoundEnabled(nextVal);
    localStorage.setItem('ignite_sound_enabled', String(nextVal));
    if (nextVal) {
      playCheckInAudioChime();
      addToast('info', 'Sound FX Enabled', 'Tournament chimes will play on check-ins.');
    } else {
      addToast('info', 'Sound FX Muted');
    }
  };

  // --- Live Computed Stats ---
  const stats: CheckInStats = useMemo(() => {
    const total = teams.length;
    const present = teams.filter((t) => t.status === 'Present').length;
    const pending = total - present;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
    const photoVerifiedCount = teams.filter(
      (t) => t.status === 'Present' && t.checkInMethod === 'photo'
    ).length;
    const manualCount = teams.filter(
      (t) => t.status === 'Present' && t.checkInMethod === 'manual'
    ).length;

    return {
      total,
      present,
      pending,
      percentage,
      photoVerifiedCount,
      manualCount,
    };
  }, [teams]);

  // --- Filtered and Sorted Teams ---
  const displayedTeams = useMemo(() => {
    let result = [...teams];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.id.toLowerCase().includes(q) ||
          t.leaderName.toLowerCase().includes(q) ||
          (t.leaderPhone && t.leaderPhone.toLowerCase().includes(q)) ||
          t.slotNumber.toString() === q
      );
    }

    // Status filter
    if (statusFilter === 'PRESENT') {
      result = result.filter((t) => t.status === 'Present');
    } else if (statusFilter === 'PENDING') {
      result = result.filter((t) => t.status === 'Pending');
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'slot') {
        return a.slotNumber - b.slotNumber;
      }
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'id') {
        return a.id.localeCompare(b.id);
      }
      if (sortBy === 'checkInTime') {
        const timeA = a.checkInTimestamp ? new Date(a.checkInTimestamp).getTime() : 0;
        const timeB = b.checkInTimestamp ? new Date(b.checkInTimestamp).getTime() : 0;
        return timeB - timeA;
      }
      return 0;
    });

    return result;
  }, [teams, searchQuery, statusFilter, sortBy]);

  // --- Check-In Handlers ---
  const handleConfirmPhotoCheckIn = async (
    teamId: string,
    photoDataUrl: string,
    consentObtained: boolean
  ) => {
    const existingTeam = teams.find((t) => t.id === teamId);
    if (!existingTeam) return;

    const now = new Date().toISOString();
    const updatedTeam: Team = {
      ...existingTeam,
      status: 'Present',
      photoUrl: photoDataUrl,
      checkInTimestamp: now,
      checkInMethod: 'photo',
      consentObtained,
    };

    try {
      await dbService.saveTeam(updatedTeam);

      // Create activity log
      const newLog: ActivityLog = {
        id: `act-${Date.now()}`,
        teamId: updatedTeam.id,
        teamName: updatedTeam.name,
        leaderName: updatedTeam.leaderName,
        action: 'CHECK_IN',
        method: 'photo',
        timestamp: now,
        details: `Photo verified attendance at registration desk (Slot #${updatedTeam.slotNumber})`,
        photoUrl: photoDataUrl,
      };
      await dbService.addActivityLog(newLog);

      // Update state
      setTeams((prev) => prev.map((t) => (t.id === teamId ? updatedTeam : t)));
      setActivityLogs((prev) => [newLog, ...prev]);

      // Feedback
      triggerCheckInConfetti();
      if (soundEnabled) {
        playCheckInAudioChime();
      }

      addToast(
        'success',
        'Check-In Confirmed!',
        `${updatedTeam.name} marked Present with verified leader photo.`
      );
    } catch (err: unknown) {
      const error = err as Error;
      addToast('error', 'Check-In Save Failed', error.message);
    }
  };

  const handleConfirmManualCheckIn = async (teamId: string, manualNote?: string) => {
    const existingTeam = teams.find((t) => t.id === teamId);
    if (!existingTeam) return;

    const now = new Date().toISOString();
    const updatedTeam: Team = {
      ...existingTeam,
      status: 'Present',
      checkInTimestamp: now,
      checkInMethod: 'manual',
      consentObtained: true,
      notes: manualNote ? `${existingTeam.notes || ''} [Manual: ${manualNote}]`.trim() : existingTeam.notes,
    };

    try {
      await dbService.saveTeam(updatedTeam);

      const newLog: ActivityLog = {
        id: `act-${Date.now()}`,
        teamId: updatedTeam.id,
        teamName: updatedTeam.name,
        leaderName: updatedTeam.leaderName,
        action: 'CHECK_IN',
        method: 'manual',
        timestamp: now,
        details: manualNote || 'Manual attendance verification (No photo captured)',
      };
      await dbService.addActivityLog(newLog);

      setTeams((prev) => prev.map((t) => (t.id === teamId ? updatedTeam : t)));
      setActivityLogs((prev) => [newLog, ...prev]);

      if (soundEnabled) {
        playCheckInAudioChime();
      }

      addToast(
        'warning',
        'Manual Check-In Confirmed',
        `${updatedTeam.name} marked Present (Manual / No Photo).`
      );
    } catch (err: unknown) {
      const error = err as Error;
      addToast('error', 'Manual Check-In Failed', error.message);
    }
  };

  const handleConfirmUndoCheckIn = async (teamId: string) => {
    const existingTeam = teams.find((t) => t.id === teamId);
    if (!existingTeam) return;

    const updatedTeam: Team = {
      ...existingTeam,
      status: 'Pending',
      photoUrl: undefined,
      checkInTimestamp: undefined,
      checkInMethod: undefined,
      consentObtained: false,
    };

    try {
      await dbService.saveTeam(updatedTeam);

      const newLog: ActivityLog = {
        id: `act-${Date.now()}`,
        teamId: updatedTeam.id,
        teamName: updatedTeam.name,
        leaderName: updatedTeam.leaderName,
        action: 'UNDO_CHECK_IN',
        timestamp: new Date().toISOString(),
        details: 'Attendance reverted to Pending by tournament organizer.',
      };
      await dbService.addActivityLog(newLog);

      setTeams((prev) => prev.map((t) => (t.id === teamId ? updatedTeam : t)));
      setActivityLogs((prev) => [newLog, ...prev]);

      addToast('info', 'Check-In Undone', `${updatedTeam.name} is now Pending.`);
    } catch (err: unknown) {
      const error = err as Error;
      addToast('error', 'Undo Failed', error.message);
    }
  };

  // --- Team CRUD ---
  const handleSaveTeam = async (teamToSave: Team) => {
    const isEditing = teams.some((t) => t.id === teamToSave.id);

    try {
      await dbService.saveTeam(teamToSave);

      const newLog: ActivityLog = {
        id: `act-${Date.now()}`,
        teamId: teamToSave.id,
        teamName: teamToSave.name,
        leaderName: teamToSave.leaderName,
        action: isEditing ? 'EDIT_TEAM' : 'ADD_TEAM',
        timestamp: new Date().toISOString(),
        details: isEditing
          ? `Updated roster details for ${teamToSave.name}`
          : `New team registered in Slot #${teamToSave.slotNumber}`,
      };
      await dbService.addActivityLog(newLog);

      setTeams((prev) => {
        if (isEditing) {
          return prev.map((t) => (t.id === teamToSave.id ? teamToSave : t));
        } else {
          return [...prev, teamToSave];
        }
      });
      setActivityLogs((prev) => [newLog, ...prev]);

      addToast(
        'success',
        isEditing ? 'Team Updated' : 'Team Registered',
        `${teamToSave.name} (${teamToSave.id}) saved to tournament lobby.`
      );
    } catch (err: unknown) {
      const error = err as Error;
      addToast('error', 'Could not save team', error.message);
    }
  };

  const handleConfirmDeleteTeam = async (teamId: string) => {
    const teamToDelete = teams.find((t) => t.id === teamId);
    if (!teamToDelete) return;

    try {
      await dbService.deleteTeam(teamId);

      const newLog: ActivityLog = {
        id: `act-${Date.now()}`,
        teamId: teamToDelete.id,
        teamName: teamToDelete.name,
        leaderName: teamToDelete.leaderName,
        action: 'DELETE_TEAM',
        timestamp: new Date().toISOString(),
        details: `Deleted from tournament registry`,
      };
      await dbService.addActivityLog(newLog);

      setTeams((prev) => prev.filter((t) => t.id !== teamId));
      setActivityLogs((prev) => [newLog, ...prev]);

      addToast('info', 'Team Deleted', `${teamToDelete.name} removed from roster.`);
    } catch (err: unknown) {
      const error = err as Error;
      addToast('error', 'Delete Failed', error.message);
    }
  };

  // --- CSV Import / Export ---
  const handleCommitCsvImport = async (importedTeams: Team[]) => {
    try {
      await dbService.bulkSaveTeams(importedTeams);

      const newLog: ActivityLog = {
        id: `act-${Date.now()}`,
        teamId: 'CSV',
        teamName: 'Bulk Import',
        leaderName: 'Admin',
        action: 'CSV_IMPORT',
        timestamp: new Date().toISOString(),
        details: `Imported ${importedTeams.length} registered teams via CSV`,
      };
      await dbService.addActivityLog(newLog);

      // Re-load to preserve slot ordering
      const freshTeams = await dbService.getAllTeams();
      setTeams(freshTeams);
      setActivityLogs((prev) => [newLog, ...prev]);

      addToast(
        'success',
        'CSV Import Complete',
        `${importedTeams.length} teams added/updated in the dashboard.`
      );
    } catch (err: unknown) {
      const error = err as Error;
      addToast('error', 'CSV Import Failed', error.message);
    }
  };

  const handleExportAttendanceCsv = () => {
    try {
      exportAttendanceCSV(teams);
      addToast('success', 'Attendance Exported', 'Downloaded tournament attendance register CSV.');
    } catch (err: unknown) {
      const error = err as Error;
      addToast('error', 'Export Failed', error.message);
    }
  };

  // --- Reset Demo Data ---
  const handleConfirmResetDemo = async () => {
    try {
      await dbService.resetToDemoData();
      await loadDatabaseData();
      addToast('success', 'Demo Reset Successful', 'Restored 12 sample teams and default match settings.');
    } catch (err: unknown) {
      const error = err as Error;
      addToast('error', 'Reset Failed', error.message);
    }
  };

  // --- Save Tournament Settings ---
  const handleSaveTournamentSettings = async (newSettings: TournamentSettings) => {
    try {
      await dbService.saveSettings(newSettings);
      setSettings(newSettings);
      addToast('success', 'Tournament Updated', 'Room credentials and match settings saved.');
    } catch (err: unknown) {
      const error = err as Error;
      addToast('error', 'Save Settings Failed', error.message);
    }
  };

  // Delete individual photo
  const handleDeletePhoto = async () => {
    if (!viewingPhoto || !viewingPhoto.teamId) return;
    const teamId = viewingPhoto.teamId;
    const t = teams.find((team) => team.id === teamId);
    if (!t) return;

    const updated: Team = {
      ...t,
      photoUrl: undefined,
      checkInMethod: 'manual', // Switch to manual since photo is removed
    };

    try {
      await dbService.saveTeam(updated);
      setTeams((prev) => prev.map((item) => (item.id === teamId ? updated : item)));
      addToast('info', 'Photo Removed', `Leader photo deleted for ${t.name}.`);
    } catch (err: unknown) {
      const error = err as Error;
      addToast('error', 'Failed to delete photo', error.message);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#06070c] flex flex-col items-center justify-center text-slate-300 gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center animate-pulse">
            <Trophy className="w-8 h-8 text-purple-400" />
          </div>
          <RefreshCw className="w-6 h-6 text-cyan-400 animate-spin absolute -bottom-2 -right-2" />
        </div>
        <div className="text-center space-y-1">
          <h2 className="font-heading font-black text-xl text-white">IGNITE CLUB CHECK-IN</h2>
          <p className="text-xs text-slate-400 font-mono">Initializing IndexedDB Tournament Database...</p>
        </div>
      </div>
    );
  }

  if (dbError) {
    return (
      <div className="min-h-screen bg-[#06070c] flex items-center justify-center p-4">
        <div className="cyber-panel rounded-3xl p-8 max-w-md text-center border-rose-500/40 space-y-4">
          <AlertCircle className="w-12 h-12 text-rose-400 mx-auto" />
          <h2 className="font-heading font-black text-xl text-white">Database Error</h2>
          <p className="text-xs text-slate-300">{dbError}</p>
          <button
            onClick={loadDatabaseData}
            className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#05070a] selection:bg-purple-500/30 relative">
      {/* Tactical Cyber Grid Background & Clockwise Rotating Ignite Sports Club Logo */}
      <TacticalBackground />

      <div className="relative z-10 flex flex-col flex-1">
        {/* App Header */}
        {settings && (
          <Header
            settings={settings}
            soundEnabled={soundEnabled}
            onToggleSound={handleToggleSound}
            onOpenAddTeam={() => setIsAddTeamOpen(true)}
            onOpenImportCsv={() => setIsImportCsvOpen(true)}
            onExportCsv={handleExportAttendanceCsv}
            onOpenBackup={() => setIsBackupOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenResetDemo={() => setIsResetDemoOpen(true)}
            onOpenStageScreen={() => setIsStageScreenOpen(true)}
            onPrint={() => setIsPrintSheetOpen(true)}
            quickDeskMode={quickDeskMode}
            onToggleQuickDeskMode={() => setQuickDeskMode(!quickDeskMode)}
          />
        )}

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full space-y-6">
        
        {/* Statistics & Filter Controls */}
        <StatsOverview
          stats={stats}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {/* Quick Speed Desk Mode (When toggled on) */}
        {quickDeskMode && (
          <QuickDeskMode
            teams={teams}
            onOpenCheckIn={(team) => setCameraTeam(team)}
            onOpenManualCheckIn={(team) => setManualCheckInTeam(team)}
            onOpenUndoCheckIn={(team) => setUndoCheckInTeam(team)}
            onViewPhoto={(url, title) => setViewingPhoto({ url, title })}
          />
        )}

        {/* Tournament Grid / Table & Activity Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Main Teams List (2 columns on large screen) */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* Header / Counter */}
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold px-1">
              <span>
                Showing {displayedTeams.length} of {teams.length} tournament teams
              </span>
              {statusFilter !== 'ALL' && (
                <span className="text-purple-400">
                  Filtered by: <strong>{statusFilter}</strong>
                </span>
              )}
            </div>

            {/* Empty State */}
            {displayedTeams.length === 0 ? (
              <div className="cyber-panel rounded-2xl p-12 text-center border-slate-800 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mx-auto">
                  <Users className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-heading font-black text-lg text-white">No Teams Found</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                    {searchQuery
                      ? `No registered teams matched your search "${searchQuery}".`
                      : 'No teams are registered for this filter view.'}
                  </p>
                </div>
                <div className="flex justify-center gap-3 pt-2">
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                    >
                      Clear Search
                    </button>
                  )}
                  <button
                    onClick={() => setIsAddTeamOpen(true)}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Register Team</span>
                  </button>
                </div>
              </div>
            ) : viewMode === 'cards' ? (
              /* Cards View */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {displayedTeams.map((team) => (
                  <TeamCard
                    key={team.id}
                    team={team}
                    onOpenCheckIn={(t) => setCameraTeam(t)}
                    onOpenManualCheckIn={(t) => setManualCheckInTeam(t)}
                    onOpenUndoCheckIn={(t) => setUndoCheckInTeam(t)}
                    onEditTeam={(t) => setEditingTeam(t)}
                    onDeleteTeam={(t) => setDeleteTeam(t)}
                    onViewPhoto={(url, title) => setViewingPhoto({ url, title, teamId: team.id })}
                  />
                ))}
              </div>
            ) : (
              /* Table View */
              <div className="cyber-panel rounded-2xl overflow-hidden border border-slate-800">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#090b16] text-slate-400 uppercase font-bold text-[11px] border-b border-slate-800">
                      <tr>
                        <th className="py-3 px-4 text-center w-16">Slot</th>
                        <th className="py-3 px-4 w-24">Team ID</th>
                        <th className="py-3 px-4">Team Name & Roster</th>
                        <th className="py-3 px-4">Leader / Captain</th>
                        <th className="py-3 px-4 w-28">Status</th>
                        <th className="py-3 px-4 w-32">Verification</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayedTeams.map((team) => (
                        <TeamRow
                          key={team.id}
                          team={team}
                          onOpenCheckIn={(t) => setCameraTeam(t)}
                          onOpenManualCheckIn={(t) => setManualCheckInTeam(t)}
                          onOpenUndoCheckIn={(t) => setUndoCheckInTeam(t)}
                          onEditTeam={(t) => setEditingTeam(t)}
                          onDeleteTeam={(t) => setDeleteTeam(t)}
                          onViewPhoto={(url, title) => setViewingPhoto({ url, title, teamId: team.id })}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>

          {/* Activity Feed Sidebar (1 column on large screen) */}
          <div className="lg:col-span-1 sticky top-28">
            <ActivityFeed
              logs={activityLogs}
              teams={teams}
              onOpenUndoCheckIn={(t) => setUndoCheckInTeam(t)}
            />
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="no-print bg-[#080911]/80 backdrop-blur-sm border-t border-slate-800/80 py-6 mt-12 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-heading font-black text-slate-300 tracking-wider">IGNITE CLUB</span>
            <span>•</span>
            <span>Esports Tournament Attendance & Match Control System</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
            <span>100% Offline Local IndexedDB</span>
            <span>•</span>
            <button
              onClick={() => setIsBackupOpen(true)}
              className="text-purple-400 hover:underline"
            >
              Storage & Backup
            </button>
            <span>•</span>
            <button
              onClick={() => setIsResetDemoOpen(true)}
              className="text-rose-400 hover:underline"
            >
              Reset Demo
            </button>
          </div>
        </div>
      </footer>
      </div>

      {/* --- MODALS --- */}

      {/* 1. Camera Check-In Modal */}
      {cameraTeam && (
        <CameraModal
          team={cameraTeam}
          isOpen={!!cameraTeam}
          onClose={() => setCameraTeam(null)}
          onConfirmPhotoCheckIn={handleConfirmPhotoCheckIn}
          onSwitchToManualCheckIn={(team) => {
            setCameraTeam(null);
            setManualCheckInTeam(team);
          }}
        />
      )}

      {/* 2. Manual Check-In Modal */}
      <ManualCheckInModal
        team={manualCheckInTeam}
        isOpen={!!manualCheckInTeam}
        onClose={() => setManualCheckInTeam(null)}
        onConfirmManualCheckIn={handleConfirmManualCheckIn}
      />

      {/* 3. Undo Check-In Modal */}
      <UndoCheckInModal
        team={undoCheckInTeam}
        isOpen={!!undoCheckInTeam}
        onClose={() => setUndoCheckInTeam(null)}
        onConfirmUndo={handleConfirmUndoCheckIn}
      />

      {/* 4. Add Team Form Modal */}
      <TeamFormModal
        isOpen={isAddTeamOpen}
        onClose={() => setIsAddTeamOpen(false)}
        onSaveTeam={handleSaveTeam}
        existingTeams={teams}
      />

      {/* 5. Edit Team Form Modal */}
      {editingTeam && (
        <TeamFormModal
          isOpen={!!editingTeam}
          onClose={() => setEditingTeam(null)}
          onSaveTeam={handleSaveTeam}
          initialTeam={editingTeam}
          existingTeams={teams}
        />
      )}

      {/* 6. Delete Team Modal */}
      <DeleteTeamModal
        team={deleteTeam}
        isOpen={!!deleteTeam}
        onClose={() => setDeleteTeam(null)}
        onConfirmDelete={handleConfirmDeleteTeam}
      />

      {/* 7. CSV Import Modal */}
      <CsvImportModal
        isOpen={isImportCsvOpen}
        onClose={() => setIsImportCsvOpen(false)}
        existingTeams={teams}
        onCommitImport={handleCommitCsvImport}
      />

      {/* 8. IndexedDB Backup & Restore Modal */}
      <BackupModal
        isOpen={isBackupOpen}
        onClose={() => setIsBackupOpen(false)}
        onBackupRestored={loadDatabaseData}
      />

      {/* 9. Reset Demo Data Modal */}
      <ResetDemoModal
        isOpen={isResetDemoOpen}
        onClose={() => setIsResetDemoOpen(false)}
        onConfirmReset={handleConfirmResetDemo}
      />

      {/* 10. Tournament Settings Modal */}
      {settings && (
        <TournamentSettingsModal
          settings={settings}
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          onSaveSettings={handleSaveTournamentSettings}
        />
      )}

      {/* 11. Fullscreen Stage Screen / Projector View */}
      {settings && (
        <StageScreenModal
          isOpen={isStageScreenOpen}
          onClose={() => setIsStageScreenOpen(false)}
          teams={teams}
          settings={settings}
          stats={stats}
        />
      )}

      {/* 12. Printable Attendance Sheet */}
      {settings && (
        <PrintAttendanceSheet
          isOpen={isPrintSheetOpen}
          onClose={() => setIsPrintSheetOpen(false)}
          teams={teams}
          settings={settings}
          stats={stats}
        />
      )}

      {/* 13. Leader Photo Viewer Modal */}
      {viewingPhoto && (
        <PhotoViewModal
          photoUrl={viewingPhoto.url}
          title={viewingPhoto.title}
          isOpen={!!viewingPhoto}
          onClose={() => setViewingPhoto(null)}
          onDeletePhoto={viewingPhoto.teamId ? handleDeletePhoto : undefined}
        />
      )}

      {/* Global Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

    </div>
  );
}

export default App;
