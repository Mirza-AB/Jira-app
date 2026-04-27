package com.adnan.jiraclone.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "transitions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transition {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "from_status_id")
    private Status from;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "to_status_id")
    private Status to;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    private Project project;
}
