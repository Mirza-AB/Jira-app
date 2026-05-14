import { useState } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useProjects } from '../hooks/useProjects';
import type { Project } from '../types/project';

function AppShell() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { projectKey } = useParams<{ projectKey: string }>();
  const [menuOpen, setMenuOpen] = useState(false);
  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);
  const { data: projects = [] } = useProjects();

  const currentProject = projects.find((p) => p.key === projectKey);

  const handleSwitchProject = (project: Project) => {
    localStorage.setItem('selectedProject', JSON.stringify(project));
    navigate(`/p/${project.key}`);
    setProjectDropdownOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-[var(--color-bg)]">
      {/* Sidebar */}
      <aside className="w-64 bg-[var(--color-text)] text-white flex flex-col shrink-0">
        <div className="p-4 border-b border-white/10">
          <h1 className="text-lg font-semibold">Jira Clone</h1>
        </div>

        <nav className="flex-1 p-3">
          <ul className="space-y-1">
            <li>
              <a
                href="/"
                className="flex items-center gap-3 px-3 py-2 rounded text-sm hover:bg-white/10 transition"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2 0v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Your work
              </a>
            </li>
            <li>
              <a
                href="/"
                className="flex items-center gap-3 px-3 py-2 rounded text-sm hover:bg-white/10 transition"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Projects
              </a>
            </li>
            <li>
              <a
                href="/"
                className="flex items-center gap-3 px-3 py-2 rounded text-sm hover:bg-white/10 transition"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                </svg>
                Filters
              </a>
            </li>
          </ul>
        </nav>

        <div className="p-3 border-t border-white/10">
          <a
            href="/"
            className="flex items-center gap-3 px-3 py-2 rounded text-sm hover:bg-white/10 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </a>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-14 bg-white border-b border-[var(--color-border)] flex items-center justify-between px-5 shrink-0">
          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setProjectDropdownOpen(!projectDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded hover:bg-[var(--color-bg)] transition text-sm"
              >
                <span className="font-medium text-[var(--color-text)]">
                  {currentProject?.key || projectKey || 'Select project'}
                </span>
                <svg className="w-4 h-4 text-[var(--color-text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {projectDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setProjectDropdownOpen(false)}
                  />
                  <div className="absolute left-0 top-full mt-1 w-64 bg-white rounded-lg shadow-lg border border-[var(--color-border)] z-20 py-2 max-h-80 overflow-y-auto">
                    {projects.map((project) => (
                      <button
                        key={project.key}
                        onClick={() => handleSwitchProject(project)}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-[var(--color-bg)] transition ${
                          project.key === projectKey ? 'bg-[var(--color-bg)] font-medium' : ''
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-[var(--color-text)]">{project.key}</span>
                          <span className="text-[var(--color-text-muted)]">-</span>
                          <span className="text-[var(--color-text-muted)] truncate">{project.name}</span>
                        </div>
                      </button>
                    ))}
                    <div className="border-t border-[var(--color-border)] mt-2 pt-2">
                      <button
                        onClick={() => {
                          setProjectDropdownOpen(false);
                          navigate('/projects/select');
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-[var(--color-primary)] hover:bg-[var(--color-bg)] transition"
                      >
                        + Manage projects
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--color-primary)] text-white text-sm font-medium hover:bg-[var(--color-primary-hover)] transition"
            >
              U
            </button>

            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-[var(--color-border)] z-20 py-2">
                  <div className="px-4 py-2 border-b border-[var(--color-border)]">
                    <p className="text-sm font-medium text-[var(--color-text)]">User</p>
                    <p className="text-xs text-[var(--color-text-muted)]">user@example.com</p>
                  </div>
                  <a
                    href="/"
                    className="block px-4 py-2 text-sm text-[var(--color-text)] hover:bg-[var(--color-bg)]"
                  >
                    Profile
                  </a>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-[var(--color-danger)] hover:bg-[var(--color-bg)]"
                  >
                    Log out
                  </button>
                </div>
              </>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppShell;
