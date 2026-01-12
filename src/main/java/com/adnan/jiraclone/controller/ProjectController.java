package com.adnan.jiraclone.controller;

import com.adnan.jiraclone.dto.ProjectDTO;
import com.adnan.jiraclone.model.ProjectRole;
import com.adnan.jiraclone.model.Project;
import com.adnan.jiraclone.service.ProjectService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @PostMapping
    public ResponseEntity<Project> createProject(@RequestBody @Valid ProjectDTO dto) {
        return ResponseEntity.ok(projectService.createProject(dto));
    }

    @PostMapping("/{key}/members")
    public ResponseEntity<Void> addMember(@PathVariable String key, @RequestBody String username, @RequestParam ProjectRole role) {
        projectService.addMember(key, username, role);
        return ResponseEntity.ok().build();
    }
}
