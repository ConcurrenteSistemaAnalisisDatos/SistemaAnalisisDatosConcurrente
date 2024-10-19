package com.proyecto.sistemaanalisisdatosconcurrente.processor;

import com.google.firebase.database.DataSnapshot;

import java.util.List;
import java.util.concurrent.RecursiveTask;
import java.util.ArrayList;

public class DataProcessor extends RecursiveTask<List<DataSnapshot>> {

    private static final int THRESHOLD = 10;
    private List<DataSnapshot> data;

    public DataProcessor(List<DataSnapshot> data) {
        this.data = data;
    }

    @Override
    protected List<DataSnapshot> compute() {
        // Si el conjunto de datos es lo suficientemente pequeño, lo procesamos directamente
        if (data.size() <= THRESHOLD) {
            return process(data);
        } else {
            // De lo contrario, lo dividimos en tareas más pequeñas
            int mid = data.size() / 2;
            DataProcessor firstHalf = new DataProcessor(data.subList(0, mid));
            DataProcessor secondHalf = new DataProcessor(data.subList(mid, data.size()));

            // Ejecutar las dos tareas en paralelo
            firstHalf.fork();
            List<DataSnapshot> secondResult = secondHalf.compute();
            List<DataSnapshot> firstResult = firstHalf.join();

            // Unimos los resultados
            firstResult.addAll(secondResult);
            return firstResult;
        }
    }

    // Procesamos los datos reales de Firebase
    private List<DataSnapshot> process(List<DataSnapshot> data) {
        List<DataSnapshot> processedData = new ArrayList<>();

        double totalCreatinine = 0;
        int count = 0;

        for (DataSnapshot snapshot : data) {
            // Leer los campos que necesitas del DataSnapshot
            Long id = (Long) snapshot.child("ID").getValue();
            String gender = (String) snapshot.child("gender").getValue();
            Long age = (Long) snapshot.child("age").getValue();
            Long smoking = (Long) snapshot.child("smoking").getValue();

            // Aquí manejamos la creatinina, chequeamos si es Long o Double
            Object serumCreatinineObj = snapshot.child("serum creatinine").getValue();
            Double serumCreatinine = null;

            if (serumCreatinineObj instanceof Long) {
                serumCreatinine = ((Long) serumCreatinineObj).doubleValue();  // Convertir de Long a Double
            } else if (serumCreatinineObj instanceof Double) {
                serumCreatinine = (Double) serumCreatinineObj;  // Ya es Double
            }

            // Ejemplo de procesamiento: Filtrar fumadores y calcular la media de creatinina
            if (smoking != null && smoking == 1) { // Filtro: solo fumadores
                System.out.println("Processing data for smoker ID: " + id + " Age: " + age + " Gender: " + gender);
                if (serumCreatinine != null) {
                    totalCreatinine += serumCreatinine;
                    count++;
                }
            }

            // Puedes hacer cualquier otro tipo de procesamiento aquí

            // Guardar el snapshot procesado
            processedData.add(snapshot);
        }

        // Mostrar resultado final del procesamiento
        if (count > 0) {
            double averageCreatinine = totalCreatinine / count;
            System.out.println("Average Serum Creatinine for Smokers: " + averageCreatinine);
        } else {
            System.out.println("No smoker data available for processing.");
        }

        return processedData;
    }

}
