package com.adnan.jiraclone.repository;

import com.adnan.jiraclone.model.Transition;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransitionRepository extends JpaRepository<Transition, Long> {
    List<Transition> findByProjectId(Long projectId);
}
