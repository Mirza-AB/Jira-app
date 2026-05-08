package com.adnan.jiraclone.dto;

import com.adnan.jiraclone.model.Priority;
import lombok.Data;
import jakarta.validation.constraints.NotBlank;

import java.time.OffsetDateTime;

@Data
public class TicketDTO {
    private Long id;
    @NotBlank
    private String title;
    private String description;
    private String projectKey;
    private String statusName;
    private String assigneeUsername;
    private String reporterUsername;
    private Priority priority = Priority.MEDIUM;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}
