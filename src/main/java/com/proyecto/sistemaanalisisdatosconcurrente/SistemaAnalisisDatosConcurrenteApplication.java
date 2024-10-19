package com.proyecto.sistemaanalisisdatosconcurrente;

import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.proyecto.sistemaanalisisdatosconcurrente.service.FirebaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import javax.annotation.PostConstruct;

@SpringBootApplication
public class SistemaAnalisisDatosConcurrenteApplication {

    @Autowired
    private FirebaseService firebaseService;

    public static void main(String[] args) {
        SpringApplication.run(SistemaAnalisisDatosConcurrenteApplication.class, args);
    }

    @PostConstruct
    public void init() {
        System.out.println("Initializing FirebaseService...");

        // Leer los datos de Firebase
        firebaseService.readData("", new FirebaseService.FirebaseCallback() {
            @Override
            public void onCallback(DataSnapshot dataSnapshot) {
                System.out.println("Data read from Firebase:");
                // Iniciar el procesamiento concurrente una vez que los datos se leen
                // Los datos ya se están procesando concurrentemente en FirebaseService
            }

            @Override
            public void onError(DatabaseError databaseError) {
                System.err.println("Error reading data: " + databaseError.getMessage());
            }
        });
    }
}
