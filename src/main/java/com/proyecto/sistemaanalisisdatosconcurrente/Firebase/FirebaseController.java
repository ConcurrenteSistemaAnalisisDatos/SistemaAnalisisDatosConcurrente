package com.proyecto.sistemaanalisisdatosconcurrente.Firebase;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class FirebaseController {

    private final FirebaseService firebaseService;

    public FirebaseController(FirebaseService firebaseService) {
        this.firebaseService = firebaseService;
    }

    @PostMapping("/write")
    public String writeData(@RequestParam String path, @RequestParam String data) {
        firebaseService.writeData(path, data);
        return "Data written successfully";
    }

    @GetMapping("/read")
    public String readData(@RequestParam String path) {
        return firebaseService.readData(path).toString();
    }
}