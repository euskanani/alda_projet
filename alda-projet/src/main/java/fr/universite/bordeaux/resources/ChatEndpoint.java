package fr.universite.bordeaux.resources;

import java.io.IOException;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.enterprise.context.ApplicationScoped;
import javax.websocket.EncodeException;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;

import fr.universite.bordeaux.chatSocket.ChatMessage;
import fr.universite.bordeaux.chatSocket.ChatMessageDecoder;
import fr.universite.bordeaux.chatSocket.ChatMessageEncoder;

@ServerEndpoint(value = "/chat/{email}", encoders = ChatMessageEncoder.class, decoders = ChatMessageDecoder.class)
public class ChatEndpoint {
	private final Logger log = Logger.getLogger(getClass().getName());

	@OnOpen
	public void open(final Session session, @PathParam("email") final String email) {
		log.info("session openend and bound to user: " + email);
		session.getUserProperties().put("email", email);
	}

	@OnMessage
	public void onMessage(final Session session, final ChatMessage chatMessage) {
		String email = (String) session.getUserProperties().get("email");
		System.out.println("SENDING MESSAGE FROM BACKEND");
		try {
			for (Session s : session.getOpenSessions()) {
				if (s.isOpen()
						&& email.equals(s.getUserProperties().get("email"))) {
					s.getBasicRemote().sendObject(chatMessage);
				}
			}
		} catch (IOException | EncodeException e) {
			log.log(Level.WARNING, "onMessage failed", e);
		}
	}
}
