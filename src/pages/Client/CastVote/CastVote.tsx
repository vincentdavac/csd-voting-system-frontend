import { useState } from 'react';
import {
  XCircle,
  BookOpen,
  AlignLeft,
  GraduationCap,
  QrCode,
  Tickets,
} from 'lucide-react';
import ConfirmationModal from './ConfirmationModal';

interface EXHIBITOR {
  image: string;
  title: string;
  description: string;
  program: string;
  qrCode: string;
}

interface CastVoteProps {
  exhibitor: EXHIBITOR;
  onClose: () => void;
  onSubmit: (votes: number, rating: number, comment: string) => void;
}

const CastVote = ({ exhibitor, onClose, onSubmit }: CastVoteProps) => {
  const [votes, setVotes] = useState(0);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  const increaseVotes = () => setVotes((prev) => prev + 1);
  const decreaseVotes = () => setVotes((prev) => (prev > 0 ? prev - 1 : 0));
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-boxdark shadow-2xl p-6 overflow-y-auto max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition"
        >
          <XCircle size={24} />
        </button>

        <h2 className="mb-6 text-2xl font-semibold text-black dark:text-white text-center">
          Cast Your Vote
        </h2>

        {/* Exhibitor Image */}
        <div className="flex justify-center mb-4">
          <img
            src={exhibitor.image}
            alt={exhibitor.title}
            className="h-28 w-28 rounded-lg border-2 border-strokedark dark:border-strokedark object-cover shadow-md"
          />
        </div>

        {/* Exhibitor Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Title */}
          <div className="flex items-start gap-3 rounded-lg border p-4 shadow-sm bg-gray-50 dark:bg-gray-800">
            <BookOpen
              size={20}
              className="text-gray-500 dark:text-gray-400 mt-1 flex-shrink-0"
            />
            <div className="flex-1 min-w-0 text-gray-700 dark:text-gray-300 font-medium break-words overflow-hidden">
              {exhibitor.title}
            </div>
          </div>

          {/* Program */}
          <div className="flex items-start gap-3 rounded-lg border p-4 shadow-sm bg-gray-50 dark:bg-gray-800">
            <GraduationCap
              size={20}
              className="text-gray-500 dark:text-gray-400 mt-1 flex-shrink-0"
            />
            <div className="flex-1 min-w-0 text-gray-700 dark:text-gray-300 font-medium break-words overflow-hidden">
              {exhibitor.program}
            </div>
          </div>

          {/* Description */}
          <div className="flex items-start gap-3 rounded-lg border p-4 shadow-sm bg-gray-50 dark:bg-gray-800 md:col-span-2">
            <AlignLeft
              size={20}
              className="text-gray-500 dark:text-gray-400 mt-1 flex-shrink-0"
            />
            <div className="flex-1 min-w-0 text-gray-700 dark:text-gray-300 font-medium break-words overflow-hidden">
              {exhibitor.description}
            </div>
          </div>

          {/* QR Code */}
          <div className="flex items-start gap-3 rounded-lg border p-4 shadow-sm bg-gray-50 dark:bg-gray-800 md:col-span-2">
            <QrCode
              size={20}
              className="text-gray-500 dark:text-gray-400 mt-1 flex-shrink-0"
            />
            <div className="flex-1 min-w-0 text-gray-700 dark:text-gray-300 font-medium break-words overflow-hidden">
              {exhibitor.qrCode}
            </div>
          </div>
        </div>

        {/* Voting Controls */}
        <div className="mt-6 space-y-4">
          {/* Vote Tickets */}
          <div className="text-center text-gray-700 dark:text-gray-300 mb-1">
            Your vote counts for{' '}
            <span className="font-semibold">People's Choice Award</span>
          </div>
          <div className="flex justify-center items-center gap-4 mt-2">
            {/* Decrease button */}
            <button
              onClick={decreaseVotes}
              className="bg-gray-200 dark:bg-gray-700 rounded px-3 py-1 hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              –
            </button>

            {/* Ticket icon + value */}
            <div className="flex items-center gap-2 px-3 py-1 rounded bg-gray-100 dark:bg-gray-800">
              <Tickets size={20} className="text-gray-500 dark:text-gray-400" />
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                {votes}
              </span>
            </div>

            {/* Increase button */}
            <button
              onClick={increaseVotes}
              className="bg-gray-200 dark:bg-gray-700 rounded px-3 py-1 hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              +
            </button>
          </div>

          {/* 5-Star Rating */}
          <div className="text-center text-gray-700 dark:text-gray-300 mt-2 mb-1">
            Rate the booth for{' '}
            <span className="font-semibold">Best Booth Award</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-3xl">
            {Array.from({ length: 5 }, (_, i) => i + 1).map((i) => (
              <button
                key={i}
                type="button"
                onClick={() => setRating(i)}
                onMouseEnter={() => setHoverRating(i)}
                onMouseLeave={() => setHoverRating(0)}
                className={`transition-colors ${
                  i <= (hoverRating || rating)
                    ? 'text-yellow-400'
                    : 'text-gray-300 dark:text-gray-500'
                }`}
              >
                ★
              </button>
            ))}
          </div>

          {/* Rating Value */}
          <div className="text-center text-gray-500 dark:text-gray-400">
            {rating} / 5
          </div>
          {/* Comment Box */}
          <div className="text-gray-700 dark:text-gray-300 mb-1 text-sm">
            Leave a comment to help the exhibitor improve their system
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-primary dark:border-strokedark dark:bg-boxdark dark:text-white"
            placeholder="Write a comment..."
            rows={4}
          />
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="flex items-center gap-2 rounded-lg border px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <XCircle size={18} /> Cancel
          </button>

          <button
            onClick={() => setShowConfirm(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            Submit Vote
          </button>
        </div>
      </div>

      {showConfirm && (
        <ConfirmationModal
          message={`Are you sure you want to cast ${votes} vote(s) for "${exhibitor.title}"?`}
          onCancel={() => setShowConfirm(false)}
          onConfirm={() => {
            onSubmit(votes, rating, comment);
            setShowConfirm(false);
            onClose();
          }}
        />
      )}
    </div>
  );
};

export default CastVote;
