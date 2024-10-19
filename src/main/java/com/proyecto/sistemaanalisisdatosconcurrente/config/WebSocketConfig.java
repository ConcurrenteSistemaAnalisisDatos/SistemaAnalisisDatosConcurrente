package com.proyecto.sistemaanalisisdatosconcurrente.config;

import com.proyecto.sistemaanalisisdatosconcurrente.handler.DataWebSocketHandler;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    private final DataWebSocketHandler dataWebSocketHandler;

    public WebSocketConfig(DataWebSocketHandler dataWebSocketHandler) {
        this.dataWebSocketHandler = dataWebSocketHandler;
    }

    // Método
    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(dataWebSocketHandler, "/data").setAllowedOrigins("*");
    }
}
