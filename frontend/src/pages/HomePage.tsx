import { useQuery } from '@tanstack/react-query';
import { ticketApi } from '../lib/api';
import type { Ticket } from '../types/ticket';

const STATUSES = ['Open', 'In Progress', 'Complete'];
const PROJECT_KEY = '100';

const PRIORITY_COLORS: Record<string, string> = {
  LOW: 'bg-green-100 text-green-800',
  MEDIUM: 'bg-yellow-100 text-yellow-800',
  HIGH: 'bg-orange-100 text-orange-800',
  CRITICAL: 'bg-red-100 text-red-800',
};

function HomePage() {
  console.log('[HomePage] Rendering, PROJECT_KEY:', PROJECT_KEY);
  const { data, isLoading, error } = useQuery({
    queryKey: ['tickets', PROJECT_KEY],
    queryFn: () => ticketApi.list(PROJECT_KEY),
  });

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[calc(100vh-64px)]">
        <p className="text-[var(--color-text-muted)]">Loading tickets...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[calc(100vh-64px)]">
        <p className="text-[var(--color-danger)]">Failed to load tickets. Please try again.</p>
      </div>
    );
  }

  const tickets: Ticket[] = data?.content || [];

  const ticketsByStatus = (status: string) =>
    tickets.filter((t) => t.statusName === status);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-[var(--color-text)]">Demo Project</h1>
          <p className="text-sm text-[var(--color-text-muted)]">{PROJECT_KEY}</p>
        </div>
        <button className="bg-[var(--color-primary)] text-white px-4 py-2 rounded text-sm font-medium hover:bg-[var(--color-primary-hover)]">
          + Create issue
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 min-h-[calc(100vh-160px)]">
        {STATUSES.map((status) => (
          <div key={status} className="bg-white rounded-lg border border-[var(--color-border)] flex flex-col">
            <div className="px-3 py-2 border-b border-[var(--color-border)] flex items-center justify-between">
              <h3 className="text-sm font-medium text-[var(--color-text)]">{status}</h3>
              <span className="text-xs text-[var(--color-text-muted)] bg-[var(--color-bg)] px-2 py-0.5 rounded-full">
                {ticketsByStatus(status).length}
              </span>
            </div>
            <div className="p-2 space-y-2 overflow-y-auto flex-1">
              {ticketsByStatus(status).map((ticket) => (
                <div
                  key={ticket.id}
                  className="bg-white border border-[var(--color-border)] rounded p-3 hover:shadow-sm cursor-pointer transition"
                >
                  <p className="text-sm text-[var(--color-text)] mb-2 line-clamp-2">{ticket.title}</p>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-2 py-0.5 rounded ${PRIORITY_COLORS[ticket.priority]}`}>
                      {ticket.priority}
                    </span>
                    {ticket.assigneeUsername && (
                      <div className="w-6 h-6 rounded-full bg-[var(--color-primary)] text-white text-xs flex items-center justify-center">
                        {ticket.assigneeUsername[0].toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
