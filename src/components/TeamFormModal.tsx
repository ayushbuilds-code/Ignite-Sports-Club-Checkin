import React, { useState, useEffect } from 'react';
import { PlusCircle, Edit3, X, Save, AlertCircle } from 'lucide-react';
import { Team } from '../types';

interface TeamFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveTeam: (team: Team) => void;
  initialTeam?: Team | null;
  existingTeams: Team[];
}

export const TeamFormModal: React.FC<TeamFormModalProps> = ({
  isOpen,
  onClose,
  onSaveTeam,
  initialTeam,
  existingTeams,
}) => {
  const isEditing = !!initialTeam;

  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [leaderName, setLeaderName] = useState('');
  const [leaderPhone, setLeaderPhone] = useState('');
  const [leaderIgId, setLeaderIgId] = useState('');
  const [slotNumber, setSlotNumber] = useState<number>(1);
  const [playersText, setPlayersText] = useState('');
  const [notes, setNotes] = useState('');
  const [group, setGroup] = useState('Group A');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialTeam) {
      setId(initialTeam.id);
      setName(initialTeam.name);
      setLeaderName(initialTeam.leaderName);
      setLeaderPhone(initialTeam.leaderPhone || '');
      setLeaderIgId(initialTeam.leaderIgId || '');
      setSlotNumber(initialTeam.slotNumber);
      setPlayersText(initialTeam.players.join('\n'));
      setNotes(initialTeam.notes || '');
      setGroup(initialTeam.group || 'Group A');
      setError(null);
    } else {
      // Auto suggest next ID & slot
      const nextNum = existingTeams.length + 1;
      const formattedNum = nextNum < 10 ? `0${nextNum}` : `${nextNum}`;
      setId(`IGN-${formattedNum}`);
      setName('');
      setLeaderName('');
      setLeaderPhone('');
      setLeaderIgId('');
      setSlotNumber(nextNum);
      setPlayersText('');
      setNotes('');
      setGroup('Group A');
      setError(null);
    }
  }, [initialTeam, isOpen, existingTeams]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedId = id.trim().toUpperCase();
    const trimmedName = name.trim();
    const trimmedLeader = leaderName.trim();

    if (!trimmedId) {
      setError('Team ID is required.');
      return;
    }
    if (!trimmedName) {
      setError('Team Name is required.');
      return;
    }
    if (!trimmedLeader) {
      setError('Team Leader Name is required.');
      return;
    }

    // Check duplicate ID if creating new or renaming
    if (!isEditing || (initialTeam && initialTeam.id !== trimmedId)) {
      const isDuplicate = existingTeams.some(
        (t) => t.id.toLowerCase() === trimmedId.toLowerCase()
      );
      if (isDuplicate) {
        setError(`A team with ID "${trimmedId}" already exists. Please choose a unique ID.`);
        return;
      }
    }

    // Parse players
    const parsedPlayers = playersText
      .split(/[\n,]/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    if (parsedPlayers.length === 0) {
      parsedPlayers.push(`${trimmedLeader} (Leader)`);
    }

    const teamToSave: Team = {
      id: trimmedId,
      name: trimmedName,
      leaderName: trimmedLeader,
      leaderPhone: leaderPhone.trim() || undefined,
      leaderIgId: leaderIgId.trim() || undefined,
      slotNumber: Number(slotNumber) || 1,
      players: parsedPlayers,
      rosterSize: Math.max(parsedPlayers.length, 4),
      status: initialTeam ? initialTeam.status : 'Pending',
      photoUrl: initialTeam?.photoUrl,
      checkInTimestamp: initialTeam?.checkInTimestamp,
      checkInMethod: initialTeam?.checkInMethod,
      consentObtained: initialTeam?.consentObtained || false,
      isSample: false,
      notes: notes.trim() || undefined,
      group: group.trim() || undefined,
    };

    onSaveTeam(teamToSave);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="cyber-panel rounded-3xl w-full max-w-xl overflow-hidden border border-purple-500/30 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-purple-500/20 bg-[#0c0f1f]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300">
              {isEditing ? <Edit3 className="w-5 h-5 text-purple-400" /> : <PlusCircle className="w-5 h-5 text-purple-400" />}
            </div>
            <div>
              <h3 className="font-heading font-black text-lg text-white">
                {isEditing ? `Edit Team: ${initialTeam?.name}` : 'Register New Tournament Team'}
              </h3>
              <p className="text-xs text-slate-400">
                {isEditing ? 'Update roster and registration details' : 'Add team to tournament attendance lobby'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Team ID *
              </label>
              <input
                type="text"
                required
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="e.g. IGN-13"
                className="w-full bg-[#090b16] border border-slate-700 rounded-xl px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Assigned Slot / Table # *
              </label>
              <input
                type="number"
                min="1"
                max="99"
                required
                value={slotNumber}
                onChange={(e) => setSlotNumber(parseInt(e.target.value, 10))}
                className="w-full bg-[#090b16] border border-slate-700 rounded-xl px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Team Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. HyperStrike Esports"
              className="w-full bg-[#090b16] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Team Leader / Captain Name *
              </label>
              <input
                type="text"
                required
                value={leaderName}
                onChange={(e) => setLeaderName(e.target.value)}
                placeholder="e.g. Vikram Malhotra"
                className="w-full bg-[#090b16] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Leader Phone / WhatsApp
              </label>
              <input
                type="text"
                value={leaderPhone}
                onChange={(e) => setLeaderPhone(e.target.value)}
                placeholder="e.g. +91 98765 43210"
                className="w-full bg-[#090b16] border border-slate-700 rounded-xl px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Leader In-Game ID / UID
              </label>
              <input
                type="text"
                value={leaderIgId}
                onChange={(e) => setLeaderIgId(e.target.value)}
                placeholder="e.g. HS_VikramOP"
                className="w-full bg-[#090b16] border border-slate-700 rounded-xl px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Group / Division
              </label>
              <select
                value={group}
                onChange={(e) => setGroup(e.target.value)}
                className="w-full bg-[#090b16] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500 cursor-pointer"
              >
                <option value="Group A">Group A</option>
                <option value="Group B">Group B</option>
                <option value="Grand Finals">Grand Finals</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Roster Players (One per line or comma-separated)
            </label>
            <textarea
              rows={3}
              value={playersText}
              onChange={(e) => setPlayersText(e.target.value)}
              placeholder="Vikram (IGL)&#10;Shadow (Rusher)&#10;Reaper (Sniper)&#10;Nova (Support)"
              className="w-full bg-[#090b16] border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Desk Notes / Table Details (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Table B4 • Near projector"
              className="w-full bg-[#090b16] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-purple-600/30 flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{isEditing ? 'Save Changes' : 'Register Team'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
