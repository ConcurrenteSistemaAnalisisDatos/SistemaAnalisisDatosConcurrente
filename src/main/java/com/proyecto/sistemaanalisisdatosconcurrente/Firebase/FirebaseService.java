package com.proyecto.sistemaanalisisdatosconcurrente.Firebase;

import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.FirebaseApp;
import com.google.firebase.database.ValueEventListener;
import org.springframework.stereotype.Service;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.ThreadFactory;

@Service
public class FirebaseService {

    private final DatabaseReference databaseReference;
    private final ExecutorService executorService;

    public FirebaseService(FirebaseApp firebaseApp) {
        FirebaseDatabase database = FirebaseDatabase.getInstance(firebaseApp);
        this.databaseReference = database.getReference();
        this.executorService = Executors.newSingleThreadExecutor(new CustomThreadFactory());
    }

    public void writeData(String path, Object data) {
        databaseReference.child(path).setValueAsync(data);
    }

    public void readData(String path, FirebaseCallback callback) {
        executorService.execute(() -> {
            System.out.println("Thread Name: " + Thread.currentThread().getName());
            databaseReference.child(path).addListenerForSingleValueEvent(new ValueEventListener() {
                @Override
                public void onDataChange(DataSnapshot dataSnapshot) {
                    callback.onCallback(dataSnapshot);
                }

                @Override
                public void onCancelled(DatabaseError databaseError) {
                    callback.onError(databaseError);
                }
            });
        });
    }

    public interface FirebaseCallback {
        void onCallback(DataSnapshot dataSnapshot);
        void onError(DatabaseError databaseError);
    }

    private static class CustomThreadFactory implements ThreadFactory {
        @Override
        public Thread newThread(Runnable r) {
            Thread thread = new Thread(r);
            System.out.println("Creating new thread: " + thread.getName());
            return thread;
        }
    }
}