package com.adnan.jiraclone.repository;

import com.adnan.jiraclone.model.ProjectMember;
import com.adnan.jiraclone.model.Project;
import com.adnan.jiraclone.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProjectMemberRepository extends JpaRepository<ProjectMember, Long> {
    Optional<ProjectMember> findByProjectAndUser(Project project, User user);
}
