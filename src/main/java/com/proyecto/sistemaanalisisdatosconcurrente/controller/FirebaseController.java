package com.proyecto.sistemaanalisisdatosconcurrente.controller;

import com.proyecto.sistemaanalisisdatosconcurrente.service.FirebaseService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class FirebaseController {

    private final FirebaseService firebaseService;

    public FirebaseController(FirebaseService firebaseService) {
        this.firebaseService = firebaseService;
    }

    @GetMapping("/read")
    public void readData(@RequestParam String path, FirebaseService.FirebaseCallback callback) {
        firebaseService.readData(path, callback);
    }
}








