package com.proyecto.sistemaanalisisdatosconcurrente.Firebase;

import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import org.springframework.stereotype.Service;

@Service
public class FirebaseService {

    private final DatabaseReference databaseReference;

    public FirebaseService() {
        FirebaseDatabase database = FirebaseDatabase.getInstance();
        this.databaseReference = database.getReference();
    }

    public void writeData(String path, Object data) {
        databaseReference.child(path).setValueAsync(data);
    }

    public DatabaseReference readData(String path) {
        return databaseReference.child(path);
    }
}