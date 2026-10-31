import React, { useState } from 'react';
import { ADMIN_TELEGRAM, CHANNEL_TELEGRAM } from '../lib/constants';

interface LockModalProps {
  serverName: string;
  onUnlock: (password: string) => Promise<{ success: boolean; message: string }>;
  onBack: () => void;
  adminTelegram?: string;
  channelTelegram?: string;
}

export const LockModal: React.FC<LockModalProps> = ({
  serverName,
  onUnlock,
  onBack,
  adminTelegram = ADMIN_TELEGRAM,
  channelTelegram = CHANNEL_TELEGRAM,
}) => {
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const openTelegramChannel = () => {
    try {
      window.open(channelTelegram, '_blank');
    } catch {
      // Ignore popup restrictions
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPassword = password.trim();
    if (!cleanPassword || isChecking) return;

    // "Hack login হওয়ার আগে telegram a nia jabe"
    // Trigger opening Telegram channel before/during the verification process
    openTelegramChannel();

    setIsChecking(true);
    setErrorMessage('Checking…');

    const result = await onUnlock(cleanPassword);
    setIsChecking(false);

    if (!result.success) {
      setErrorMessage(result.message || 'Wrong password');
      setIsShaking(true);
      setTimeout(() => {
        setIsShaking(false);
      }, 500);
      setPassword('');
    } else {
      setErrorMessage('');
    }
  };

  return (
    <div className="animate-fade-up">
      {/* Top Header */}
      <div className="flex items-center gap-3 px-1 pt-3.5 pb-2.5">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to servers"
          className="w-10 h-10 rounded-[14px] border border-[rgba(168,85,247,0.2)] bg-[rgba(14,20,40,0.8)] backdrop-blur-md flex items-center justify-center cursor-pointer text-[#F1F5FF] text-lg transition-all hover:border-[#00E5FF]/40 hover:bg-[rgba(22,32,60,0.9)] hover:shadow-[0_0_15px_rgba(0,229,255,0.2)] active:scale-95"
        >
          ←
        </button>
        <div className="flex-1">
          <div className="text-[17px] font-black text-[#F1F5FF] tracking-tight">
            Security Gate
          </div>
          <div className="text-[11px] text-[#00E5FF] font-mono">{serverName}</div>
        </div>
      </div>

      {/* Lock Screen Body */}
      <div className="max-w-[440px] mx-auto min-h-[56vh] flex flex-col items-center justify-center px-2 py-4 relative z-[1]">
        {/* Terminal Header Icon */}
        <div className="text-center mb-6">
          <div className="relative inline-block mb-3">
            <div className="w-18 h-18 rounded-[24px] bg-gradient-to-br from-[rgba(168,85,247,0.2)] to-[rgba(0,229,255,0.2)] border border-[rgba(0,229,255,0.4)] flex items-center justify-center text-4xl shadow-[0_0_25px_rgba(0,229,255,0.3)] animate-vip-breathe">
              🔒
            </div>
          </div>
          <h1 className="text-2xl font-black text-[#F1F5FF] mb-1 tracking-tight">
            Access Authorization
          </h1>
          <p className="text-xs text-[#00E5FF] font-mono font-bold tracking-wide mb-1">
            {serverName}
          </p>
          <p className="text-xs text-[#94A3B8] max-w-[300px] mx-auto mt-1 leading-relaxed">
            হ্যাক লগইন করার আগে টেলিগ্রাম চ্যানেলে জয়েন করুন এবং লাইভ অ্যাক্টিভেশন পাসওয়ার্ড সংগ্রহ করুন।
          </p>
        </div>

        {/* Step 1: Join Telegram Notice & Button */}
        <div className="w-full max-w-[340px] mb-4 p-3.5 rounded-[18px] bg-gradient-to-r from-[rgba(37,99,235,0.12)] to-[rgba(0,229,255,0.08)] border border-[rgba(0,229,255,0.3)] text-center shadow-[0_0_20px_rgba(0,229,255,0.12)]">
          <div className="text-[10px] text-[#00E5FF] font-mono font-extrabold uppercase tracking-wider mb-1 flex items-center justify-center gap-1.5">
            <span>📢</span>
            <span>Step 1: Join Telegram First</span>
          </div>
          <p className="text-[11px] text-[#94A3B8] mb-2.5">
            পাসওয়ার্ড পেতে প্রথমে চ্যানেলে যুক্ত হন:
          </p>
          <a
            href={channelTelegram}
            target="_blank"
            rel="noopener noreferrer"
            onClick={openTelegramChannel}
            className="w-full py-2.5 px-3 rounded-xl font-black text-xs bg-gradient-to-r from-[#2563EB] to-[#00E5FF] text-[#050510] hover:brightness-110 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(0,229,255,0.35)] active:scale-98"
          >
            <span className="text-sm">✈️</span>
            <span>Join Telegram Channel</span>
            <span className="font-mono text-sm">↗</span>
          </a>
        </div>

        {/* Step 2: Enter Password to Login */}
        <form
          onSubmit={handleSubmit}
          className={`w-full max-w-[340px] ${isShaking ? 'animate-shake' : ''}`}
        >
          <div className="text-[10px] text-[#94A3B8] font-mono uppercase tracking-wider mb-2 text-center font-bold">
            Step 2: Enter Server Password
          </div>

          <input
            id="pg-pass"
            type="password"
            placeholder="Enter Server Password"
            value={password}
            disabled={isChecking}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrorMessage('');
            }}
            autoFocus
            className="w-full h-12 px-4 mb-3 text-center rounded-[14px] bg-[rgba(11,16,32,0.85)] border border-[rgba(0,229,255,0.3)] focus:border-[#00E5FF] focus:outline-none focus:ring-2 focus:ring-[rgba(0,229,255,0.3)] text-[#F1F5FF] font-mono text-base transition-all placeholder:text-[#64748B] disabled:opacity-50 shadow-inner"
          />

          {errorMessage && (
            <p
              id="pg-msg"
              className={`text-xs text-center mb-3 font-bold animate-fade-up ${
                errorMessage === 'Checking…'
                  ? 'text-[#00E5FF] font-mono'
                  : 'text-[#FF3864]'
              }`}
            >
              {errorMessage === 'Checking…'
                ? '⏳ Checking PassGate verification…'
                : `❌ ${errorMessage} — Redirecting to Telegram...`}
            </p>
          )}

          <button
            id="pg-btn"
            type="submit"
            disabled={isChecking}
            className="w-full py-3 rounded-[14px] font-black text-sm bg-gradient-to-r from-[rgba(168,85,247,0.3)] via-[rgba(37,99,235,0.3)] to-[rgba(0,229,255,0.3)] text-[#00E5FF] border border-[rgba(0,229,255,0.45)] hover:border-[#00E5FF] hover:bg-[rgba(0,229,255,0.15)] transition-all cursor-pointer shadow-[0_0_18px_rgba(0,229,255,0.22)] active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isChecking ? (
              <>
                <span className="w-4 h-4 border-2 border-[#00E5FF] border-t-transparent rounded-full animate-spin" />
                <span className="font-mono">Opening Telegram & Verifying…</span>
              </>
            ) : (
              <>
                <span>🔓</span>
                <span>Unlock Server</span>
              </>
            )}
          </button>
        </form>

        {/* Telegram Direct Contacts */}
        <div className="flex gap-2.5 mt-5 w-full max-w-[340px]">
          <a
            href={adminTelegram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2.5 rounded-xl text-center text-[11px] font-black bg-[rgba(168,85,247,0.12)] text-[#A855F7] border border-[rgba(168,85,247,0.3)] hover:bg-[rgba(168,85,247,0.2)] transition-all flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span>📞</span>
            <span>Contact Admin</span>
          </a>
          <a
            href={channelTelegram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2.5 rounded-xl text-center text-[11px] font-black bg-[rgba(37,99,235,0.12)] text-[#00E5FF] border border-[rgba(0,229,255,0.3)] hover:bg-[rgba(37,99,235,0.2)] transition-all flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span>✈️</span>
            <span>Telegram Group</span>
          </a>
        </div>
      </div>
    </div>
  );
};
