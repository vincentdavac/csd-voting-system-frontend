import { useState, useEffect } from 'react';
import {
  XCircle,
  AlignLeft,
  Tickets,
  ClockAlert,
  CheckCircle,
} from 'lucide-react';
import ConfirmationModal from './ConfirmationModal';
import API_BASE_URL from '../../../config/api';
import { useAlert } from '../../../components/Alert/AlertContext';

interface EXHIBITOR {
  id: number;
  image: string;
  title: string;
  description: string;
  program: string;
  qrCode: string;
  hasRated?: boolean;
}

interface CastVoteProps {
  exhibitor: EXHIBITOR;
  remainingVotes: number;
  onClose: () => void;
  onSubmit: (votes: number, rating: number, comment: string) => void;
}

const CastVote = ({
  exhibitor,
  remainingVotes,
  onClose,
  onSubmit,
}: CastVoteProps) => {
  const [votes, setVotes] = useState(0);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  // NEW: Global Settings State
  const [isVotingOpen, setIsVotingOpen] = useState<boolean | null>(null);
  const [scheduleMsg, setScheduleMsg] = useState('Checking voting schedule...');
  const { showAlert } = useAlert();

  // Fetch Voting Status on Mount
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/settings/status`);
        if (res.ok) {
          const data = await res.json();
          setIsVotingOpen(data.is_open);

          if (!data.is_open && data.settings) {
            // Format 18:00 to 6:00 PM for nicer display
            const formatTime = (timeStr: string) => {
              const [hours, minutes] = timeStr.split(':');
              const h = parseInt(hours);
              const ampm = h >= 12 ? 'PM' : 'AM';
              const formattedH = h % 12 || 12;
              return `${formattedH}:${minutes} ${ampm}`;
            };
            setScheduleMsg(
              `Voting is closed. Polls are open daily from ${formatTime(
                data.settings.daily_start_time,
              )} to ${formatTime(data.settings.daily_end_time)}.`,
            );
          }
        }
      } catch (err) {
        console.error('Failed to fetch voting status', err);
        setIsVotingOpen(false); // Failsafe: lock it down if API fails
        setScheduleMsg('Unable to connect to the voting server.');
      }
    };
    fetchStatus();
  }, []);

  const increaseVotes = () => {
    if (votes < remainingVotes) {
      setVotes((prev) => prev + 1);
    }
  };

  const decreaseVotes = () => setVotes((prev) => (prev > 0 ? prev - 1 : 0));

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl rounded-[2.5rem] bg-white dark:bg-[#020d26] shadow-2xl border-4 border-slate-100 dark:border-white/5 p-5 sm:p-8 overflow-y-auto max-h-[95vh] scrollbar-hide">
        {/* Tactical Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/5"
        >
          <XCircle size={28} strokeWidth={1.5} />
        </button>

        {/* Header Section */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">
            Cast Your Vote
          </h2>
        </div>

        {/* VOTING CLOSED BANNER */}
        {isVotingOpen === false && (
          <div className="mb-8 flex items-center gap-4 rounded-2xl bg-red-50 dark:bg-red-500/10 p-4 border-2 border-red-100 dark:border-red-500/20 text-red-600 dark:text-red-400 animate-pulse">
            <ClockAlert size={24} className="flex-shrink-0" />
            <p className="text-xs sm:text-sm font-bold uppercase tracking-tight">
              {scheduleMsg}
            </p>
          </div>
        )}

        {/* Exhibitor Profile Hub */}
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 p-4 rounded-[2rem] bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl border-2 border-blue-600/30 scale-110" />
            <img
              src={exhibitor.image}
              alt={exhibitor.title}
              className="h-24 w-24 sm:h-32 sm:w-32 rounded-2xl object-cover shadow-xl z-10 relative"
            />
          </div>
          <div className="flex-1 text-center sm:text-left min-w-0">
            <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase italic truncate">
              {exhibitor.title}
            </h3>
            <p className="text-blue-600 dark:text-blue-400 text-[10px] font-mono font-black uppercase tracking-widest mb-2">
              {exhibitor.program}
            </p>
            <div className="flex items-start gap-2 text-slate-500 dark:text-slate-400">
              <AlignLeft size={14} className="mt-1 flex-shrink-0" />
              <p className="text-xs font-medium leading-relaxed line-clamp-2">
                {exhibitor.description}
              </p>
            </div>
          </div>
        </div>

        {/* CONTROL CENTER */}
        <div
          className={`space-y-8 ${
            isVotingOpen === false ? 'opacity-40 pointer-events-none' : ''
          }`}
        >
          {/* PEOPLES CHOICE SECTION */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-[1px] flex-1 bg-slate-200 dark:bg-white/10" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                People's Choice
              </span>
              <div className="h-[1px] flex-1 bg-slate-200 dark:bg-white/10" />
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center bg-slate-100 dark:bg-white/5 p-1.5 rounded-2xl border-2 border-slate-200 dark:border-white/10 shadow-inner">
                <button
                  onClick={decreaseVotes}
                  className="w-12 h-12 flex items-center justify-center rounded-xl bg-white dark:bg-[#041130] text-slate-900 dark:text-white shadow-sm hover:bg-blue-600 hover:text-white transition-all font-black text-xl"
                >
                  –
                </button>

                <div className="flex items-center px-6 gap-2">
                  <Tickets size={20} className="text-blue-600" />
                  <input
                    type="number"
                    value={votes === 0 ? '' : votes}
                    placeholder="0"
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (isNaN(val)) setVotes(0);
                      else if (val <= remainingVotes) setVotes(val);
                      else setVotes(remainingVotes);
                    }}
                    className="w-12 bg-transparent text-center text-xl font-black text-slate-900 dark:text-white outline-none"
                  />
                </div>

                <button
                  onClick={increaseVotes}
                  disabled={votes >= remainingVotes}
                  className="w-12 h-12 flex items-center justify-center rounded-xl bg-white dark:bg-[#041130] text-slate-900 dark:text-white shadow-sm hover:bg-blue-600 hover:text-white transition-all font-black text-xl disabled:opacity-30"
                >
                  +
                </button>
              </div>

              {votes >= remainingVotes && remainingVotes > 0 && (
                <p className="text-[10px] font-bold text-red-500 uppercase tracking-tighter">
                  Maximum Allocation Reached ({remainingVotes} available)
                </p>
              )}
            </div>
          </div>

          {/* BOOTH RATING SECTION */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-[1px] flex-1 bg-slate-200 dark:bg-white/10" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                Booth Evaluation
              </span>
              <div className="h-[1px] flex-1 bg-slate-200 dark:bg-white/10" />
            </div>

            {exhibitor.hasRated ? (
              <div className="flex flex-col items-center py-6 bg-blue-600/5 dark:bg-blue-500/5 rounded-3xl border-2 border-dashed border-blue-200 dark:border-blue-500/20">
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-black text-xs uppercase italic">
                  <CheckCircle size={16} /> You’ve already rated this booth.
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Booth evaluation already submitted for this node.
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <button
                      key={i}
                      onClick={() => setRating(i)}
                      onMouseEnter={() => setHoverRating(i)}
                      onMouseLeave={() => setHoverRating(0)}
                      className={`text-4xl transition-all duration-300 transform ${
                        i <= (hoverRating || rating)
                          ? 'text-yellow-400 scale-110'
                          : 'text-slate-200 dark:text-white/10'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <p className="text-xs font-black text-slate-400 uppercase">
                  {rating} / 5 Score
                </p>
              </div>
            )}
          </div>

          {/* FEEDBACK SECTION */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                Leave a Comment(s)
              </span>
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50/50 dark:bg-white/5 dark:border-white/5 p-4 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-blue-600 dark:focus:border-blue-500 transition-all placeholder:text-slate-400"
              placeholder="Help improve the system logic..."
              rows={3}
            />
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="mt-10 flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-4 rounded-2xl border-2 border-slate-100 dark:border-white/5 font-black text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
          >
            Cancel
          </button>

          {/* Execute Submission Button */}
          <button
            disabled={
              isVotingOpen === false ||
              (votes === 0 && rating === 0 && !comment.trim())
            }
            onClick={() => {
              // Optional: Validation check to give feedback before showing the confirm modal
              if (votes === 0 && rating === 0 && !comment.trim()) {
                showAlert(
                  'warning',
                  'Please provide a vote, a rating, or a comment.',
                );
                return;
              }
              setShowConfirm(true);
            }}
            className="flex-[2] bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 dark:disabled:bg-white/5 disabled:text-slate-400 text-white py-4 rounded-2xl shadow-lg shadow-blue-600/20 font-black text-xs uppercase tracking-[0.2em] transition-all active:scale-95"
          >
            <span className="relative z-10">Execute Submission</span>

            {/* Subtle shimmer effect for active state */}
            {!(votes === 0 && rating === 0 && !comment.trim()) && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:animate-[shimmer_2s_infinite] transition-transform" />
            )}
          </button>
        </div>

        {showConfirm && (
          <ConfirmationModal
            message={`Confirming upload of ${votes} vote(s) to system "${exhibitor.title}"?`}
            onCancel={() => setShowConfirm(false)}
            onConfirm={() => {
              onSubmit(votes, rating, comment);
              setShowConfirm(false);
              onClose();
            }}
          />
        )}
      </div>
    </div>
  );
};

export default CastVote;
