package com.adnan.jiraclone.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Builder.Default
    private boolean globalAdmin = false;

    @Column(name = "authority")
    private Set<String> authorities = new HashSet<>();

    @Builder.Default
    private int failedLoginAttempts = 0;

    private Instant lockoutUntil;

    @Builder.Default
    private boolean accountLocked = false;
}
