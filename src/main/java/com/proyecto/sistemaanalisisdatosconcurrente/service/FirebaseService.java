package com.proyecto.sistemaanalisisdatosconcurrente.service;

import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.FirebaseApp;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;
import com.proyecto.sistemaanalisisdatosconcurrente.handler.DataWebSocketHandler;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ForkJoinPool;

@Service
public class FirebaseService {

    private final DatabaseReference databaseReference;
    private final ForkJoinPool forkJoinPool;
    private final DataWebSocketHandler webSocketHandler;

    public FirebaseService(FirebaseApp firebaseApp, DataWebSocketHandler webSocketHandler) {
        FirebaseDatabase database = FirebaseDatabase.getInstance(firebaseApp);
        this.databaseReference = database.getReference();
        this.forkJoinPool = new ForkJoinPool();
        this.webSocketHandler = webSocketHandler;
    }

    public void readData(String path, FirebaseCallback callback) {
        databaseReference.child(path).addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot dataSnapshot) {
                List<Map<String, Object>> processedDataList = new ArrayList<>();

                // Verificar cuántos hijos tiene el dataSnapshot
                System.out.println("Total children in DataSnapshot: " + dataSnapshot.getChildrenCount());

                for (DataSnapshot child : dataSnapshot.getChildren()) {
                    Map<String, Object> processedData = new HashMap<>();

                    // Imprimir cada child para depurar
                    System.out.println("Processing child DataSnapshot: " + child.toString());

                    // Extraer los datos necesarios con verificación de nulos
                    Object id = child.child("ID").getValue();
                    Object age = child.child("age").getValue();
                    Object gender = child.child("gender").getValue();
                    Object serumCreatinine = child.child("serum creatinine").getValue();
                    Object smoking = child.child("smoking").getValue();

                    // Validar que los datos no sean nulos antes de procesarlos
                    if (id == null || age == null || gender == null || serumCreatinine == null || smoking == null) {
                        System.out.println("Missing data in snapshot: " + child.toString());
                        continue;  // Saltar este nodo si falta algún dato importante
                    }

                    // Agregar datos procesados al mapa
                    processedData.put("ID", id);
                    processedData.put("age", age);
                    processedData.put("gender", gender);
                    processedData.put("serum creatinine", serumCreatinine);
                    processedData.put("smoking", smoking);

                    // Imprimir el mapa de datos procesados para depuración
                    System.out.println("Processed data: " + processedData);

                    // Añadir al listado de datos procesados
                    processedDataList.add(processedData);
                }

                // Enviar los datos procesados a través del WebSocket
                forkJoinPool.execute(() -> {
                    System.out.println("Data processing completed. Sending data through WebSocket.");
                    webSocketHandler.sendProcessedData(processedDataList);
                });

                // Llamar al callback con el dataSnapshot original (si es necesario para otros propósitos)
                callback.onCallback(dataSnapshot);
            }

            @Override
            public void onCancelled(DatabaseError databaseError) {
                // Manejo de errores en caso de que ocurra un problema al leer de Firebase
                System.err.println("Error reading data from Firebase: " + databaseError.getMessage());
                callback.onError(databaseError);
            }
        });
    }

    // Definir la interfaz FirebaseCallback para manejar los callbacks
    public interface FirebaseCallback {
        void onCallback(DataSnapshot dataSnapshot);
        void onError(DatabaseError databaseError);
    }
}
