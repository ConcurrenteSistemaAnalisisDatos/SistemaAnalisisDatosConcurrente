package com.proyecto.sistemaanalisisdatosconcurrente.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;

@Configuration
public class FirebaseConfig {

    @Bean
    public FirebaseApp initializeFirebase() throws IOException {
        // Intenta cargar el archivo desde el classpath
        InputStream serviceAccount = getClass().getClassLoader().getResourceAsStream("serviceKeyJava.json");

        if (serviceAccount == null) {
            throw new FileNotFoundException("Firebase service key file not found. Please ensure 'serviceKeyJava.json' is in the resources folder.");
        }

        FirebaseOptions options = new FirebaseOptions.Builder()
                .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                .setDatabaseUrl("https://concurrente-3a0d3-default-rtdb.firebaseio.com") // Usa tu URL de Firebase
                .build();

        return FirebaseApp.initializeApp(options);
    }
}
