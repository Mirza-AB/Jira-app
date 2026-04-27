package com.adnan.jiraclone.repository;

import com.adnan.jiraclone.model.Comment;
import com.adnan.jiraclone.model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByTicketOrderByCreatedAtAsc(Ticket ticket);
}
