import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProjects } from "../hooks/useProjects";
import { CreateProjectModel } from "../components/CreateProjectModel";
import type { Project } from "../types/project";

interface ProjectSelectPageProps {
  onSelectProject: (project: Project) => void;
}

export const ProjectSelectPage = ({
  onSelectProject,
}: ProjectSelectPageProps) => {
  const { data: projects, isLoading, error } = useProjects();
  const [showCreateModel, setShowCreateModel] = useState(false);
  const navigate = useNavigate();

  const handleSelectProject = (project: Project) => {
    localStorage.setItem("selectedProject", JSON.stringify(project));
    onSelectProject(project);
    navigate("/");
  };

  const handleProjectCreated = (project: Project) => {
    handleSelectProject(project);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
        <p className="text-[var(--color-text-muted)]">Loading projects...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[var(--color-danger)] mb-4">
            Failed to load projects.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[var(--color-primary)] text-white rounded hover:bg-[var(--color-primary-hover)]"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const projectList: Project[] = projects || [];

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center p-6">
      <div className="bg-white rounded-lg shadow-sm border border-[var(--color-border)] w-full max-w-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-[var(--color-text)] mb-2">
            Jira Clone
          </h1>
          <p className="text-[var(--color-text-muted)]">
            {projectList.length === 0
              ? "No projects yet. Create your first project to get started."
              : "Select a project to continue."}
          </p>
        </div>

        {projectList.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-medium text-[var(--color-text)] mb-3">
              Your projects
            </h2>
            <div className="space-y-2">
              {projectList.map((project) => (
                <button
                  key={project.key}
                  onClick={() => handleSelectProject(project)}
                  className="w-full text-left p-4 border border-[var(--color-border)] rounded-lg hover:border-[var(--color-primary)] hover:bg-[var(--color-bg)] transition"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-[var(--color-text)]">
                        {project.name}
                      </p>
                      <p className="text-sm text-[var(--color-text-muted)]">
                        {project.key}
                      </p>
                    </div>
                    <div className="text-[var(--color-text-muted)]">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-center">
          <button
            onClick={() => setShowCreateModel(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded font-medium hover:bg-[var(--color-primary-hover)]"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
            {projectList.length === 0
              ? "Create your first project"
              : "Create new project"}
          </button>
        </div>
      </div>

      {showCreateModel && (
        <CreateProjectModel
          onClose={() => setShowCreateModel(false)}
          onCreated={handleProjectCreated}
        />
      )}
    </div>
  );
};
