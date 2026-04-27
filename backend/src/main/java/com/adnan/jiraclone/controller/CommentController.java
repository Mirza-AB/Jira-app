package com.adnan.jiraclone.controller;

import com.adnan.jiraclone.model.Comment;
import com.adnan.jiraclone.model.Ticket;
import com.adnan.jiraclone.model.User;
import com.adnan.jiraclone.repository.CommentRepository;
import com.adnan.jiraclone.repository.TicketRepository;
import com.adnan.jiraclone.repository.UserRepository;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    private final CommentRepository commentRepository;
    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;

    public CommentController(CommentRepository commentRepository, TicketRepository ticketRepository, UserRepository userRepository) {
        this.commentRepository = commentRepository;
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
    }

    @PostMapping("/{ticketId}")
    public ResponseEntity<Comment> add(@PathVariable Long ticketId, @RequestBody @NotBlank String content, @AuthenticationPrincipal UserDetails user) {
        Ticket ticket = ticketRepository.findById(ticketId).orElseThrow();
        User author = userRepository.findByUsername(user.getUsername()).orElseThrow();
        Comment comment = Comment.builder().ticket(ticket).author(author).content(content).build();
        return ResponseEntity.ok(commentRepository.save(comment));
    }

    @GetMapping("/{ticketId}")
    public ResponseEntity<List<Comment>> list(@PathVariable Long ticketId) {
        Ticket ticket = ticketRepository.findById(ticketId).orElseThrow();
        return ResponseEntity.ok(commentRepository.findByTicketOrderByCreatedAtAsc(ticket));
    }
}
