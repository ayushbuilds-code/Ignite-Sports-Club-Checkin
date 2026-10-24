import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Camera, 
  RefreshCw, 
  Check, 
  X, 
  ShieldCheck, 
  User, 
  VideoOff, 
  SwitchCamera,
  Info
} from 'lucide-react';
import { Team } from '../types';

interface CameraModalProps {
  team: Team;
  isOpen: boolean;
  onClose: () => void;
  onConfirmPhotoCheckIn: (teamId: string, photoDataUrl: string, consentObtained: boolean) => void;
  onSwitchToManualCheckIn: (team: Team) => void;
}

export const CameraModal: React.FC<CameraModalProps> = ({
  team,
  isOpen,
  onClose,
  onConfirmPhotoCheckIn,
  onSwitchToManualCheckIn,
}) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [availableDevices, setAvailableDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [consentObtained, setConsentObtained] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Helper to safely stop all tracks on the current stream
  const stopCurrentStream = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
      });
      setStream(null);
    }
  }, [stream]);

  // Request camera and enumerate devices
  const startCamera = useCallback(async (deviceId?: string) => {
    setIsInitializing(true);
    setCameraError(null);

    // Stop existing stream first
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('Camera API (getUserMedia) is not supported in this browser or context.');
      setIsInitializing(false);
      return;
    }

    try {
      const constraints: MediaStreamConstraints = {
        video: deviceId
          ? { deviceId: { exact: deviceId } }
          : {
              facingMode: 'user',
              width: { ideal: 1280 },
              height: { ideal: 720 },
            },
        audio: false,
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play().catch(() => {});
      }

      // Enumerate available video inputs
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInputs = devices.filter((d) => d.kind === 'videoinput');
        setAvailableDevices(videoInputs);
        if (!selectedDeviceId && videoInputs.length > 0) {
          const currentTrack = mediaStream.getVideoTracks()[0];
          const settings = currentTrack.getSettings();
          if (settings.deviceId) {
            setSelectedDeviceId(settings.deviceId);
          }
        }
      } catch {
        // Enumerate fallback
      }

      setIsInitializing(false);
    } catch (err: unknown) {
      const error = err as Error;
      let errorMsg = 'Could not access camera.';
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        errorMsg = 'Camera permission was denied. Please allow camera access in your browser address bar.';
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        errorMsg = 'No camera device was detected on this computer or tablet.';
      } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        errorMsg = 'Camera is currently in use by another application (e.g. Zoom or OBS).';
      } else {
        errorMsg = error.message || 'Camera initialization error.';
      }

      setCameraError(errorMsg);
      setIsInitializing(false);
    }
  }, [selectedDeviceId, stream]);

  // Launch camera when modal opens
  useEffect(() => {
    if (isOpen) {
      setCapturedPhoto(null);
      setConsentObtained(true);
      startCamera();
    } else {
      stopCurrentStream();
    }

    return () => {
      stopCurrentStream();
    };
  }, [isOpen]);

  // Capture video frame to canvas
  const handleCapturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    const width = video.videoWidth || 640;
    const height = video.videoHeight || 480;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw the current video frame
    ctx.drawImage(video, 0, 0, width, height);

    // Add subtle tournament watermark to the captured image
    ctx.fillStyle = 'rgba(7, 8, 15, 0.75)';
    ctx.fillRect(0, height - 36, width, 36);
    ctx.font = 'bold 14px Rajdhani, sans-serif';
    ctx.fillStyle = '#a855f7';
    ctx.fillText(`IGNITE TOURNAMENT • ${team.id} - ${team.name.toUpperCase()}`, 12, height - 13);
    ctx.font = '12px JetBrains Mono, monospace';
    ctx.fillStyle = '#38bdf8';
    ctx.textAlign = 'right';
    ctx.fillText(new Date().toLocaleTimeString(), width - 12, height - 13);

    // Convert to high-quality JPEG Data URL
    const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
    setCapturedPhoto(dataUrl);

    // Pause video to freeze
    video.pause();
  };

  // Retake photo: discard captured frame and resume video
  const handleRetakePhoto = () => {
    setCapturedPhoto(null);
    if (videoRef.current && stream) {
      videoRef.current.play().catch(() => {});
    } else {
      startCamera(selectedDeviceId);
    }
  };

  // Final confirmation to check in
  const handleConfirm = () => {
    if (!capturedPhoto) return;
    setIsSaving(true);
    // Stop camera tracks immediately
    stopCurrentStream();
    onConfirmPhotoCheckIn(team.id, capturedPhoto, consentObtained);
    setIsSaving(false);
    onClose();
  };

  // Safe close
  const handleModalClose = () => {
    stopCurrentStream();
    onClose();
  };

  // Device switcher
  const handleDeviceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newId = e.target.value;
    setSelectedDeviceId(newId);
    setCapturedPhoto(null);
    startCamera(newId);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="cyber-panel-glow rounded-3xl w-full max-w-2xl overflow-hidden border border-purple-500/30 flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-purple-500/20 bg-[#0c0f1f]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300">
              <Camera className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-black text-lg text-white">
                  Leader Photo Check-In
                </h3>
                <span className="text-xs px-2 py-0.5 rounded-full font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Slot #{team.slotNumber}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Team: <span className="text-purple-300 font-semibold">{team.name}</span> ({team.id}) • Leader: <span className="text-emerald-300 font-semibold">{team.leaderName}</span>
              </p>
            </div>
          </div>

          <button
            onClick={handleModalClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Camera Viewport / Captured Image */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          
          {/* Camera Viewfinder Area */}
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border-2 border-purple-500/30 shadow-inner flex items-center justify-center">
            
            {/* Live Video Feed (Hidden when photo captured) */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                capturedPhoto ? 'hidden' : 'block'
              }`}
            />

            {/* Hidden canvas for capturing frame */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Captured Photo Preview */}
            {capturedPhoto && (
              <div className="relative w-full h-full">
                <img
                  src={capturedPhoto}
                  alt="Captured Leader Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-emerald-500/90 text-black text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg">
                  <Check className="w-3.5 h-3.5" />
                  <span>PHOTO CAPTURED</span>
                </div>
              </div>
            )}

            {/* Viewfinder Target Overlay (during live video) */}
            {!capturedPhoto && !cameraError && !isInitializing && (
              <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                {/* Framing guides */}
                <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-full border-2 border-dashed border-cyan-400/50 flex items-center justify-center relative">
                  <div className="absolute -top-3 px-2 bg-slate-900/90 text-[11px] font-mono text-cyan-300 rounded border border-cyan-500/30">
                    ALIGN LEADER'S FACE
                  </div>
                </div>

                {/* Scanline line */}
                <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-40 animate-scanline" />
              </div>
            )}

            {/* Loading Spinner */}
            {isInitializing && !cameraError && (
              <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center text-slate-300 gap-3">
                <RefreshCw className="w-8 h-8 text-purple-400 animate-spin" />
                <span className="text-xs font-mono tracking-wider">REQUESTING CAMERA PERMISSION...</span>
              </div>
            )}

            {/* Camera Error State */}
            {cameraError && (
              <div className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center text-center p-6 gap-3">
                <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mb-1">
                  <VideoOff className="w-6 h-6" />
                </div>
                <h4 className="font-heading text-rose-400 font-bold text-base">Camera Unavailable</h4>
                <p className="text-xs text-slate-300 max-w-md">{cameraError}</p>
                <div className="flex flex-wrap items-center gap-3 mt-3">
                  <button
                    onClick={() => startCamera(selectedDeviceId)}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Retry Camera</span>
                  </button>
                  <button
                    onClick={() => {
                      stopCurrentStream();
                      onClose();
                      onSwitchToManualCheckIn(team);
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    <span>Proceed with Manual Check-In</span>
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Camera Controls & Device Switcher */}
          {!cameraError && (
            <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0a0d18] p-3 rounded-xl border border-slate-800 text-xs text-slate-400">
              
              {/* Device Selector */}
              {availableDevices.length > 1 && (
                <div className="flex items-center gap-2">
                  <SwitchCamera className="w-4 h-4 text-purple-400" />
                  <select
                    value={selectedDeviceId}
                    onChange={handleDeviceChange}
                    aria-label="Select camera device"
                    className="bg-slate-900 text-slate-200 border border-slate-700 rounded-lg px-2 py-1 text-xs focus:outline-none"
                  >
                    {availableDevices.map((d, idx) => (
                      <option key={d.deviceId} value={d.deviceId}>
                        {d.label || `Camera ${idx + 1}`}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Attendance Documentation Notice */}
              <div className="flex items-center gap-1.5 text-slate-400">
                <Info className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Attendance photo is stored locally on this device only. No biometric scanning.</span>
              </div>
            </div>
          )}

          {/* Leader Consent Checkbox */}
          <div className="flex items-start gap-3 bg-purple-950/20 border border-purple-500/30 rounded-xl p-3.5">
            <input
              type="checkbox"
              id="leader-consent"
              checked={consentObtained}
              onChange={(e) => setConsentObtained(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded text-purple-600 focus:ring-purple-500 bg-slate-900 border-slate-700 cursor-pointer"
            />
            <label htmlFor="leader-consent" className="text-xs text-slate-200 cursor-pointer leading-relaxed">
              <span className="font-semibold text-white">Team Leader Consent Confirmed:</span>{' '}
              Leader <span className="text-purple-300 font-bold">{team.leaderName}</span> has consented to having this live photograph captured and stored in the tournament attendance record.
            </label>
          </div>

          {/* Confirmation Box (when photo captured) */}
          {capturedPhoto && (
            <div className="cyber-panel-green rounded-xl p-4 border border-emerald-500/30">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h4 className="font-heading font-bold text-sm text-emerald-300">
                  Confirm Team Identity & Attendance
                </h4>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 block">Team Name:</span>
                  <span className="font-bold text-white">{team.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Team ID:</span>
                  <span className="font-mono font-bold text-purple-300">{team.id}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Leader:</span>
                  <span className="font-bold text-cyan-300">{team.leaderName}</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 bg-[#0c0f1f] border-t border-purple-500/20 flex flex-wrap items-center justify-between gap-3">
          
          <button
            onClick={handleModalClose}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs sm:text-sm font-semibold transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center gap-3">
            
            {/* If live video, show "Capture Photo" */}
            {!capturedPhoto ? (
              <button
                onClick={handleCapturePhoto}
                disabled={!!cameraError || isInitializing}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white text-xs sm:text-sm font-bold shadow-lg shadow-purple-600/30 flex items-center gap-2 transition-all transform active:scale-95"
              >
                <Camera className="w-4 h-4" />
                <span>Capture Photo</span>
              </button>
            ) : (
              <>
                {/* Retake */}
                <button
                  onClick={handleRetakePhoto}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Retake</span>
                </button>

                {/* Confirm Check-in */}
                <button
                  onClick={handleConfirm}
                  disabled={isSaving || !consentObtained}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white text-xs sm:text-sm font-bold shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all transform active:scale-95"
                >
                  <Check className="w-4 h-4" />
                  <span>Confirm Check-In</span>
                </button>
              </>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
