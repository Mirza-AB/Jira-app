package com.adnan.jiraclone.controller;

import com.adnan.jiraclone.dto.TicketDTO;
import com.adnan.jiraclone.service.TicketService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @PostMapping
    public ResponseEntity<TicketDTO> create(@RequestBody @Valid TicketDTO dto, @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(ticketService.create(dto, user.getUsername()));
    }

    @GetMapping
    public ResponseEntity<Page<TicketDTO>> list(@RequestParam String projectKey, Pageable pageable) {
        return ResponseEntity.ok(ticketService.list(projectKey, pageable));
    }

    @PostMapping("/{id}/status")
    public ResponseEntity<TicketDTO> changeStatus(@PathVariable Long id, @RequestParam String toStatus, @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(ticketService.changeStatus(id, user.getUsername(), toStatus));
    }
}
