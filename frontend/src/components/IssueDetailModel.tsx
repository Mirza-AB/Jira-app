import { useState } from 'react';
import type { Ticket } from '../types/ticket';
import { Priority } from '../types/ticket';
import { ticketApi } from '../lib/api';

interface IssueDetailModelProps {
  ticket: Ticket;
  projectKey: string;
  onClose: () => void;
}

interface Comment {
  id: number;
  content: string;
  author: { username: string };
  createdAt: string;
}

const PRIORITY_COLORS: Record<Priority, string> = {
  [Priority.LOW]: 'bg-green-100 text-green-800',
  [Priority.MEDIUM]: 'bg-yellow-100 text-yellow-800',
  [Priority.HIGH]: 'bg-orange-100 text-orange-800',
  [Priority.CRITICAL]: 'bg-red-100 text-red-800',
};

export const IssueDetailModel = ({ ticket, projectKey, onClose }: IssueDetailModelProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentError, setCommentError] = useState('');

  const loadComments = async () => {
    if (comments.length > 0) return;
    setLoadingComments(true);
    try {
      const data = await ticketApi.getComments(ticket.id);
      setComments(data);
    } catch {
      setCommentError('Failed to load comments');
    } finally {
      setLoadingComments(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    setSubmittingComment(true);
    setCommentError('');
    try {
      const comment = await ticketApi.addComment(ticket.id, newComment.trim());
      setComments((prev) => [...prev, comment]);
      setNewComment('');
    } catch {
      setCommentError('Failed to add comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-[var(--color-border)] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-[var(--color-text-muted)]">
              {projectKey}-{ticket.id}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded ${PRIORITY_COLORS[ticket.priority]}`}>
              {ticket.priority}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <h2 className="text-xl font-semibold text-[var(--color-text)] mb-4">{ticket.title}</h2>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-xs font-medium text-[var(--color-text-muted)] uppercase">Status</label>
              <p className="text-sm text-[var(--color-text)] mt-1">{ticket.statusName}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--color-text-muted)] uppercase">Priority</label>
              <p className="text-sm text-[var(--color-text)] mt-1">{ticket.priority}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--color-text-muted)] uppercase">Assignee</label>
              <p className="text-sm text-[var(--color-text)] mt-1">
                {ticket.assigneeUsername || 'Unassigned'}
              </p>
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--color-text-muted)] uppercase">Reporter</label>
              <p className="text-sm text-[var(--color-text)] mt-1">{ticket.reporterUsername}</p>
            </div>
          </div>

          {ticket.description && (
            <div className="mb-6">
              <label className="text-xs font-medium text-[var(--color-text-muted)] uppercase block mb-2">
                Description
              </label>
              <p className="text-sm text-[var(--color-text)] whitespace-pre-wrap">{ticket.description}</p>
            </div>
          )}

          <div className="border-t border-[var(--color-border)] pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-[var(--color-text)]">Comments</h3>
              <button
                onClick={loadComments}
                className="text-xs text-[var(--color-primary)] hover:underline"
              >
                {comments.length === 0 ? 'Load comments' : `${comments.length} comment${comments.length !== 1 ? 's' : ''}`}
              </button>
            </div>

            {loadingComments && <p className="text-sm text-[var(--color-text-muted)]">Loading...</p>}

            {commentError && (
              <div className="text-sm text-[var(--color-danger)] mb-4">{commentError}</div>
            )}

            <div className="space-y-4 mb-4">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-[var(--color-bg)] rounded p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-[var(--color-primary)] text-white text-xs flex items-center justify-center">
                      {comment.author.username[0].toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-[var(--color-text)]">
                      {comment.author.username}
                    </span>
                    <span className="text-xs text-[var(--color-text-muted)]">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--color-text)] pl-8">{comment.content}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 px-3 py-2 border border-[var(--color-border)] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none"
                rows={2}
              />
              <button
                onClick={handleAddComment}
                disabled={submittingComment || !newComment.trim()}
                className="px-4 py-2 text-sm font-medium bg-[var(--color-primary)] text-white rounded hover:bg-[var(--color-primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed self-end"
              >
                {submittingComment ? '...' : 'Post'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};