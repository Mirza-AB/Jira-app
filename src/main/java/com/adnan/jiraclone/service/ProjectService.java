package com.adnan.jiraclone.service;

import com.adnan.jiraclone.dto.ProjectDTO;
import com.adnan.jiraclone.model.*;
import com.adnan.jiraclone.repository.ProjectMemberRepository;
import com.adnan.jiraclone.repository.ProjectRepository;
import com.adnan.jiraclone.repository.StatusRepository;
import com.adnan.jiraclone.repository.TransitionRepository;
import com.adnan.jiraclone.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final StatusRepository statusRepository;
    private final TransitionRepository transitionRepository;
    private final UserRepository userRepository;
    private final ProjectMemberRepository memberRepository;

    public ProjectService(ProjectRepository projectRepository, StatusRepository statusRepository, TransitionRepository transitionRepository, UserRepository userRepository, ProjectMemberRepository memberRepository) {
        this.projectRepository = projectRepository;
        this.statusRepository = statusRepository;
        this.transitionRepository = transitionRepository;
        this.userRepository = userRepository;
        this.memberRepository = memberRepository;
    }

    @Transactional
    public Project createProject(ProjectDTO dto) {
        if (projectRepository.findByKey(dto.getKey()).isPresent()) {
            throw new IllegalArgumentException("Project key already exists");
        }
        Project project = Project.builder()
                .key(dto.getKey())
                .name(dto.getName())
                .description(dto.getDescription())
                .build();
        Project savedProject = projectRepository.save(project);

        Set<Status> statuses = Optional.ofNullable(dto.getStatuses()).orElse(Set.of("OPEN","IN_PROGRESS","DONE"))
                .stream().map(name -> {
                    Status s = Status.builder().name(name).project(savedProject).build();
                    return statusRepository.save(s);
                }).collect(Collectors.toSet());
        savedProject.setAllowedStatuses(statuses);

        Map<String, Status> byName = statuses.stream().collect(Collectors.toMap(Status::getName, s -> s));
        if (byName.containsKey("OPEN") && byName.containsKey("IN_PROGRESS")) {
            Transition t1 = Transition.builder().from(byName.get("OPEN")).to(byName.get("IN_PROGRESS")).project(project).build();
            transitionRepository.save(t1);
        }
        if (byName.containsKey("IN_PROGRESS") && byName.containsKey("DONE")) {
            Transition t2 = Transition.builder().from(byName.get("IN_PROGRESS")).to(byName.get("DONE")).project(project).build();
            transitionRepository.save(t2);
        }

        return projectRepository.save(savedProject);
    }

    public void addMember(String projectKey, String username, ProjectRole role) {
        Project project = projectRepository.findByKey(projectKey).orElseThrow(() -> new NoSuchElementException("Project not found"));
        User user = userRepository.findByUsername(username).orElseThrow(() -> new NoSuchElementException("User not found"));

        if (memberRepository.findByProjectAndUser(project, user).isPresent()) {
            throw new IllegalArgumentException("User already a member");
        }
        ProjectMember member = ProjectMember.builder().project(project).user(user).role(role).build();
        memberRepository.save(member);
    }
}
