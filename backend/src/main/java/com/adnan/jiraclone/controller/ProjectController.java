package com.adnan.jiraclone.controller;

import com.adnan.jiraclone.dto.ProjectDTO;
import com.adnan.jiraclone.model.ProjectRole;
import com.adnan.jiraclone.service.ProjectService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping
    public ResponseEntity<List<ProjectDTO>> list() {
        return ResponseEntity.ok(projectService.listProjects());
    }

    @PostMapping
    public ResponseEntity<ProjectDTO> createProject(@RequestBody @Valid ProjectDTO dto, @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(projectService.createProject(dto, user.getUsername()));
    }

    @PostMapping("/{key}/members")
    public ResponseEntity<Void> addMember(@PathVariable String key, @RequestBody String username, @RequestParam ProjectRole role) {
        projectService.addMember(key, username, role);
        return ResponseEntity.ok().build();
    }
}
