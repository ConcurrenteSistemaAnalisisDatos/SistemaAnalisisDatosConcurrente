package com.proyecto.sistemaanalisisdatosconcurrente;

import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.proyecto.sistemaanalisisdatosconcurrente.Firebase.FirebaseService;
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
        //path vacio para leer todos los datos de la db
        firebaseService.readData("", new FirebaseService.FirebaseCallback() {
            @Override
            public void onCallback(DataSnapshot dataSnapshot) {
                System.out.println("Data read from Firebase:");
                //bucle para escribir todos los datos de la db, demostracion de que lee todos los datos
                //para poder manejarlos como queramos
                for (DataSnapshot child : dataSnapshot.getChildren()) {
                    System.out.println("ID: " + child.child("ID").getValue());
                    System.out.println("ALT: " + child.child("ALT").getValue());
                    System.out.println("AST: " + child.child("AST").getValue());
                    System.out.println("Cholesterol: " + child.child("Cholesterol").getValue());
                    System.out.println("Gtp: " + child.child("Gtp").getValue());
                    System.out.println("HDL: " + child.child("HDL").getValue());
                    System.out.println("LDL: " + child.child("LDL").getValue());
                    System.out.println("Urine protein: " + child.child("Urine protein").getValue());
                    System.out.println("age: " + child.child("age").getValue());
                    System.out.println("dental caries: " + child.child("dental caries").getValue());
                    System.out.println("eyesight(left): " + child.child("eyesight(left)").getValue());
                    System.out.println("eyesight(right): " + child.child("eyesight(right)").getValue());
                    System.out.println("fasting blood sugar: " + child.child("fasting blood sugar").getValue());
                    System.out.println("gender: " + child.child("gender").getValue());
                    System.out.println("hearing(left): " + child.child("hearing(left)").getValue());
                    System.out.println("hearing(right): " + child.child("hearing(right)").getValue());
                    System.out.println("height(cm): " + child.child("height(cm)").getValue());
                    System.out.println("hemoglobin: " + child.child("hemoglobin").getValue());
                    System.out.println("oral: " + child.child("oral").getValue());
                    System.out.println("relaxation: " + child.child("relaxation").getValue());
                    System.out.println("serum creatinine: " + child.child("serum creatinine").getValue());
                    System.out.println("smoking: " + child.child("smoking").getValue());
                    System.out.println("systolic: " + child.child("systolic").getValue());
                }
            }

            @Override
            public void onError(DatabaseError databaseError) {
                System.err.println("Error reading data: " + databaseError.getMessage());
            }
        });
    }
}