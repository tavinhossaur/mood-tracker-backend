package com.ifsp.mood_tracker.controllers;

import org.springframework.web.bind.annotation.RestController;

import com.ifsp.mood_tracker.models.Student;
import com.ifsp.mood_tracker.repositories.StudentRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
public class MainController {

    @Autowired
    StudentRepository studentRepository;

    @PostMapping("/addStudent")
    public ResponseEntity<String> addStudent(@RequestBody Student student) {
        studentRepository.save(student);
        return ResponseEntity.status(201).body("Student added to the database.");
    }

    @GetMapping("/ping")
    public ResponseEntity<String> ping() {
        return ResponseEntity.ok("pong");
    }
}
