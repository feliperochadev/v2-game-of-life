package com.feliperocha.gameoflife.configurations

import org.springframework.context.annotation.Configuration
import org.springframework.messaging.simp.config.MessageBrokerRegistry
import org.springframework.web.socket.config.annotation.AbstractWebSocketMessageBrokerConfigurer
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker
import org.springframework.web.socket.config.annotation.StompEndpointRegistry

@Configuration
@EnableWebSocketMessageBroker
class WebSocketConfig extends AbstractWebSocketMessageBrokerConfigurer  {

    @Override
    void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/gameoflife-websocket").withSockJS()
    }

    @Override
    void configureMessageBroker(MessageBrokerRegistry config)
    {
        config.enableSimpleBroker("/v2/game-of-life")
        config.setApplicationDestinationPrefixes("/v2/game-of-life")
    }
}
