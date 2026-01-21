package com.adnan.jiraclone.service;

import com.adnan.jiraclone.dto.TicketDTO;
import com.adnan.jiraclone.model.*;
import com.adnan.jiraclone.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.NoSuchElementException;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final ProjectRepository projectRepository;
    private final StatusRepository statusRepository;
    private final UserRepository userRepository;
    private final TransitionRepository transitionRepository;
    private final ProjectMemberRepository memberRepository;

    public TicketService(TicketRepository ticketRepository, ProjectRepository projectRepository, StatusRepository statusRepository, UserRepository userRepository, TransitionRepository transitionRepository, ProjectMemberRepository memberRepository) {
        this.ticketRepository = ticketRepository;
        this.projectRepository = projectRepository;
        this.statusRepository = statusRepository;
        this.userRepository = userRepository;
        this.transitionRepository = transitionRepository;
        this.memberRepository = memberRepository;
    }

    @Transactional
    public Ticket create(TicketDTO dto, String reporterUsername) {
        Project project = projectRepository.findByKey(dto.getProjectKey()).orElseThrow(() -> new NoSuchElementException("Project not found"));
        User reporter = userRepository.findByUsername(reporterUsername).orElseThrow(() -> new NoSuchElementException("Reporter not found"));
        Status status = statusRepository.findByProjectId(project.getId()).stream().findFirst().orElseThrow(() -> new IllegalStateException("No statuses defined"));

        User assignee = null;
        if (dto.getAssigneeUsername() != null) {
            assignee = userRepository.findByUsername(dto.getAssigneeUsername()).orElseThrow(() -> new NoSuchElementException("Assignee not found"));
        }

        Ticket t = Ticket.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .project(project)
                .reporter(reporter)
                .assignee(assignee)
                .status(status)
                .priority(dto.getPriority())
                .build();
        return ticketRepository.save(t);
    }

    public Page<Ticket> list(String projectKey, Pageable pageable) {
        Project project = projectRepository.findByKey(projectKey).orElseThrow(() -> new NoSuchElementException("Project not found"));
        return ticketRepository.findByProject(project, pageable);
    }

    @Transactional
    public Ticket changeStatus(Long ticketId, String username, String toStatusName) {
        Ticket ticket = ticketRepository.findById(ticketId).orElseThrow(() -> new NoSuchElementException("Ticket not found"));
        Project project = ticket.getProject();
        Status to = statusRepository.findByProjectId(project.getId()).stream().filter(s -> s.getName().equals(toStatusName)).findFirst().orElseThrow(() -> new NoSuchElementException("Status not found"));
        Status from = ticket.getStatus();

        boolean allowed = transitionRepository.findByProjectId(project.getId()).stream()
                .anyMatch(tr -> tr.getFrom().getId().equals(from.getId()) && tr.getTo().getId().equals(to.getId()));
        if (!allowed) {
            throw new IllegalStateException("Transition not allowed for project");
        }

        User user = userRepository.findByUsername(username).orElseThrow(() -> new NoSuchElementException("User not found"));
        ProjectMember member = memberRepository.findByProjectAndUser(project, user).orElseThrow(() -> new IllegalStateException("User is not a project member"));
        if (!canPerformTransition(member.getRole(), from.getName(), to.getName())) {
            throw new SecurityException("User role cannot perform this transition");
        }

        ticket.setStatus(to);
        return ticketRepository.save(ticket);
    }

    private boolean canPerformTransition(ProjectRole role, String from, String to) {
        if (role == ProjectRole.ADMIN) return true;
        if (role == ProjectRole.MANAGER && to.equals("DONE")) return true;
        if (role == ProjectRole.DEVELOPER && to.equals("IN_PROGRESS")) return true;
        return false;
    }
}
