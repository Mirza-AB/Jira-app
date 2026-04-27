package com.adnan.jiraclone.dto;

import com.adnan.jiraclone.model.Priority;
import lombok.Data;
import jakarta.validation.constraints.NotBlank;

@Data
public class TicketDTO {
    private Long id;
    @NotBlank
    private String title;
    private String description;
    private String projectKey;
    private String statusName;
    private String assigneeUsername;
    private Priority priority = Priority.MEDIUM;
}
