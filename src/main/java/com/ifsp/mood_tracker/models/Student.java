package com.ifsp.mood_tracker.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Document
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class Student {
    @Id
    private Integer id;
    private String name;
    private String age;
}
