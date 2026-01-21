package com.adnan.jiraclone.repository;

import com.adnan.jiraclone.model.Ticket;
import com.adnan.jiraclone.model.Project;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    Page<Ticket> findByProject(Project project, Pageable pageable);
}
