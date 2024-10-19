package com.proyecto.sistemaanalisisdatosconcurrente.Firebase;

import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.FirebaseApp;
import com.google.firebase.database.ValueEventListener;
import com.proyecto.sistemaanalisisdatosconcurrente.DataProcessor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ForkJoinPool;

@Service
public class FirebaseService {

    private final DatabaseReference databaseReference;
    private final ForkJoinPool forkJoinPool;

    public FirebaseService(FirebaseApp firebaseApp) {
        FirebaseDatabase database = FirebaseDatabase.getInstance(firebaseApp);
        this.databaseReference = database.getReference();
        this.forkJoinPool = new ForkJoinPool();  // Utilizamos ForkJoinPool para procesamiento concurrente
    }

    public void writeData(String path, Object data) {
        databaseReference.child(path).setValueAsync(data);
    }

    public void readData(String path, FirebaseCallback callback) {
        databaseReference.child(path).addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot dataSnapshot) {
                List<DataSnapshot> dataList = new ArrayList<>();
                for (DataSnapshot child : dataSnapshot.getChildren()) {
                    dataList.add(child);
                }
                // Procesar los datos concurrentemente usando ForkJoinPool
                DataProcessor processor = new DataProcessor(dataList);
                forkJoinPool.execute(() -> {
                    List<DataSnapshot> processedData = forkJoinPool.invoke(processor);
                    System.out.println("Data processing completed.");
                    callback.onCallback(dataSnapshot);
                });
            }

            @Override
            public void onCancelled(DatabaseError databaseError) {
                callback.onError(databaseError);
            }
        });
    }

    public interface FirebaseCallback {
        void onCallback(DataSnapshot dataSnapshot);
        void onError(DatabaseError databaseError);
    }
}
