package com.agenticui.backend.controller;

import com.agenticui.backend.entity.GenerationHistory;
import com.agenticui.backend.repository.GenerationHistoryRepository;
import com.agenticui.backend.repository.UserRepository;
import com.agenticui.backend.dto.GenerationRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/history")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class HistoryController {

    private final GenerationHistoryRepository historyRepository;
    private final UserRepository userRepository;

    @PostMapping("/save")
    public ResponseEntity<GenerationHistory> save(@RequestBody GenerationRequest request) {
        GenerationHistory history = new GenerationHistory();
        history.setPrompt(request.getPrompt());
        history.setSchema(request.getSchema() != null ? request.getSchema() : request.getPrompt());
        userRepository.findById(request.getUserId()).ifPresent(history::setUser);
        return ResponseEntity.ok(historyRepository.save(history));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<GenerationHistory>> getUserHistory(@PathVariable Long userId) {
        return ResponseEntity.ok(historyRepository.findByUserIdOrderByCreatedAtDesc(userId));
    }
}
