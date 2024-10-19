package com.proyecto.sistemaanalisisdatosconcurrente.handler;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

@Component
public class DataWebSocketHandler extends TextWebSocketHandler {

    private final Set<WebSocketSession> sessions = Collections.synchronizedSet(new HashSet<>());
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        sessions.add(session);
        System.out.println("New WebSocket connection established: " + session.getId());
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        sessions.remove(session);
        System.out.println("WebSocket connection closed: " + session.getId());
    }

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        System.out.println("Received message from client: " + message.getPayload());
    }

    // Método para enviar datos procesados a todos los clientes conectados
    public void sendProcessedData(Object data) {
        String jsonData = "";
        try {
            jsonData = objectMapper.writeValueAsString(data); // Convertir los datos a JSON
        } catch (Exception e) {
            System.err.println("Error converting data to JSON: " + e.getMessage());
        }

        synchronized (sessions) {
            for (WebSocketSession session : sessions) {
                try {
                    session.sendMessage(new TextMessage(jsonData));
                    System.out.println("Sent processed data to client: " + session.getId());
                } catch (Exception e) {
                    System.err.println("Error sending data to client: " + e.getMessage());
                }
            }
        }
    }
}

