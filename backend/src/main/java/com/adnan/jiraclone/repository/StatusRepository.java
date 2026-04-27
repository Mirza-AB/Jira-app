package com.adnan.jiraclone.repository;

import com.adnan.jiraclone.model.Status;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StatusRepository extends JpaRepository<Status, Long> {
    List<Status> findByProjectId(Long projectId);
}
