package com.adnan.jiraclone.dto;

import lombok.Data;

import java.util.Set;

@Data
public class ProjectDTO {
    private Long id;
    private String key;
    private String name;
    private String description;
    private Set<String> statuses;
}
