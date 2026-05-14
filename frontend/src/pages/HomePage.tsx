import { useState } from 'react';
import { useParams } from 'react-router-dom';
import type { Ticket } from '../types/ticket';
import { Priority } from '../types/ticket';
import { CreateTicketModel } from '../components/CreateTicketModel';
import { useTickets } from '../hooks/useTickets';
import { useProjects } from '../hooks/useProjects';

const PRIORITY_COLORS: Record<Priority, string> = {
  [Priority.LOW]: 'bg-green-100 text-green-800',
  [Priority.MEDIUM]: 'bg-yellow-100 text-yellow-800',
  [Priority.HIGH]: 'bg-orange-100 text-orange-800',
  [Priority.CRITICAL]: 'bg-red-100 text-red-800',
};

function HomePage() {
  const [showCreateModel, setShowCreateModel] = useState(false);
  const { projectKey } = useParams<{ projectKey: string }>();
  const key = projectKey || '';

  const { data: ticketsData, isLoading: ticketsLoading, error: ticketsError } = useTickets(key);
  const { data: projects } = useProjects();

  const project = projects?.find((p) => p.key === key);
  const statuses = project?.statuses || ['OPEN', 'IN_PROGRESS', 'DONE'];

  if (!projectKey) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[calc(100vh-64px)]">
        <p className="text-[var(--color-text-muted)]">No project selected.</p>
      </div>
    );
  }

  if (ticketsLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[calc(100vh-64px)]">
        <p className="text-[var(--color-text-muted)]">Loading tickets...</p>
      </div>
    );
  }

  if (ticketsError) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[calc(100vh-64px)]">
        <p className="text-[var(--color-danger)]">Failed to load tickets. Please try again.</p>
      </div>
    );
  }

  const tickets: Ticket[] = ticketsData?.content || [];

  const ticketsByStatus = (status: string) =>
    tickets.filter((t) => t.statusName === status);

  return (
    <>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-[var(--color-text)]">{key}</h1>
            <p className="text-sm text-[var(--color-text-muted)]">{key}</p>
          </div>
          <button
            onClick={() => setShowCreateModel(true)}
            className="bg-[var(--color-primary)] text-white px-4 py-2 rounded text-sm font-medium hover:bg-[var(--color-primary-hover)]"
          >
            + Create issue
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 min-h-[calc(100vh-160px)]">
          {statuses.map((status) => (
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

      {showCreateModel && (
        <CreateTicketModel
          projectKey={key}
          onClose={() => setShowCreateModel(false)}
        />
      )}
    </>
  );
}

export default HomePage;