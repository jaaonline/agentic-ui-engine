package com.agenticui.backend.dto;

import lombok.Data;

@Data
public class GenerationRequest {
    private String prompt;
    private String schema;
    private Long userId;
}
