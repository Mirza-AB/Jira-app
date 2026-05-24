import { useState } from 'react';
import { useParams } from 'react-router-dom';
import type { Ticket } from '../types/ticket';
import { Priority } from '../types/ticket';
import { CreateTicketModel } from '../components/CreateTicketModel';
import { IssueDetailModel } from '../components/IssueDetailModel';
import { useTickets } from '../hooks/useTickets';
import { useProjects } from '../hooks/useProjects';
import { useChangeTicketStatus } from '../hooks/useChangeTicketStatus';

const PRIORITY_COLORS: Record<Priority, string> = {
  [Priority.LOW]: 'bg-green-100 text-green-800',
  [Priority.MEDIUM]: 'bg-yellow-100 text-yellow-800',
  [Priority.HIGH]: 'bg-orange-100 text-orange-800',
  [Priority.CRITICAL]: 'bg-red-100 text-red-800',
};

function HomePage() {
  const [showCreateModel, setShowCreateModel] = useState(false);
  const [statusDropdown, setStatusDropdown] = useState<number | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const { projectKey } = useParams<{ projectKey: string }>();
  const key = projectKey || '';

  const { data: ticketsData, isLoading: ticketsLoading, error: ticketsError } = useTickets(key);
  const { data: projects } = useProjects();
  const changeStatus = useChangeTicketStatus();

  const project = projects?.find((p) => p.key === key);
  const statuses = project?.statuses || ['OPEN', 'IN_PROGRESS', 'DONE'];

  const handleStatusChange = (ticketId: number, newStatus: string) => {
    changeStatus.mutate({ id: ticketId, toStatus: newStatus });
    setStatusDropdown(null);
  };

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
                    onClick={() => setSelectedTicket(ticket)}
                    className="bg-white border border-[var(--color-border)] rounded p-3 hover:shadow-sm cursor-pointer transition"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm text-[var(--color-text)] line-clamp-2 flex-1">{ticket.title}</p>
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setStatusDropdown(statusDropdown === ticket.id ? null : ticket.id);
                          }}
                          className="text-xs px-2 py-0.5 rounded bg-[var(--color-bg)] hover:bg-[var(--color-border)] transition"
                        >
                          {ticket.statusName}
                        </button>
                        {statusDropdown === ticket.id && (
                          <>
                            <div
                              className="fixed inset-0 z-10"
                              onClick={(e) => {
                                e.stopPropagation();
                                setStatusDropdown(null);
                              }}
                            />
                            <div className="absolute right-0 mt-1 w-32 bg-white rounded shadow-lg border border-[var(--color-border)] z-20 py-1">
                              {statuses
                                .filter((s) => s !== ticket.statusName)
                                .map((s) => (
                                  <button
                                    key={s}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleStatusChange(ticket.id, s);
                                    }}
                                    className="w-full text-left px-3 py-1.5 text-sm hover:bg-[var(--color-bg)] transition"
                                  >
                                    {s}
                                  </button>
                                ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
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

      {selectedTicket && (
        <IssueDetailModel
          ticket={selectedTicket}
          projectKey={key}
          onClose={() => setSelectedTicket(null)}
        />
      )}
    </>
  );
}

export default HomePage;