package com.agenticui.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "generation_history")
@Data
@NoArgsConstructor
public class GenerationHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false)
    private String prompt;

    @Column(columnDefinition = "TEXT")
    private String schema;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
