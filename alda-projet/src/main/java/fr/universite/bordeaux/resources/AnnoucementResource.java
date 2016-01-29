package fr.universite.bordeaux.resources;


import java.io.IOException;
import java.io.InputStream;
//import java.io.IOException;
//import java.io.InputStream;
import java.util.Date;
import java.util.List;

import javax.ejb.EJB;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.commons.io.IOUtils;
//import org.glassfish.jersey.media.sse.EventOutput;
//import org.glassfish.jersey.media.sse.OutboundEvent;
//import org.glassfish.jersey.media.sse.SseBroadcaster;
//import org.glassfish.jersey.media.sse.SseFeature;

import org.glassfish.jersey.media.sse.EventOutput;
import org.glassfish.jersey.media.sse.OutboundEvent;
import org.glassfish.jersey.media.sse.SseBroadcaster;
import org.glassfish.jersey.media.sse.SseFeature;

import com.google.gson.Gson;

import fr.universite.bordeaux.entities.Announcement;
import fr.universite.bordeaux.entities.User;
import fr.universite.bordeaux.repositories.AnnoucementRepository;
import fr.universite.bordeaux.repositories.UserRepository;

@Path("/announcements")
public class AnnoucementResource {
	@EJB
	AnnoucementRepository announcementRepository;
	@EJB
	UserRepository userRepository;



	private final SseBroadcaster BROADCASTER = new SseBroadcaster();

	@GET
	@Path("/announcementEvent")
	@Produces(SseFeature.SERVER_SENT_EVENTS)
	public EventOutput announcementsEvents() {
		final EventOutput eventOutput = new EventOutput();
		BROADCASTER.add(eventOutput);
		OutboundEvent.Builder eventBuilder = new OutboundEvent.Builder();
		OutboundEvent event = eventBuilder.name("event")
				.comment("")
				.build();
		BROADCASTER.broadcast(event);
		return eventOutput;
	}


	@GET
	@Path("/{email}")
	@Produces({MediaType.APPLICATION_JSON})
	public List<Announcement> getAnnouncementsByUser(@PathParam("email")String email){
		User user = userRepository.findUserByEmail(email);
		return announcementRepository.findAnnouncementsByUser(user);
	}

	@GET
	@Path("/getAnnouncementById/{id}")
	@Produces({MediaType.APPLICATION_JSON})
	public Announcement getAnnonucementById(@PathParam("id")String id){
		return announcementRepository.findAnnouncementById(id);
		//return userRepository.findUserById(id);
	}


	@POST
	@Path("/addAnnouncement")
	@Consumes("application/json")
	public void  addUser(Announcement announcement){
		User user = userRepository.findUserByEmail("test@gmail.com");
		announcement.setCreatedDate(new Date());
		announcement.setUser(user);
		announcementRepository.addAnnouncement(announcement);
	}

	@GET
	@Produces({MediaType.APPLICATION_JSON})
	public List<Announcement> getAllAnnouncements(){
		return announcementRepository.getAllTheAnnouncements();
	}

	@PUT
	@Path("/updateAnnouncement")
	@Consumes("application/json")
	@Produces({MediaType.APPLICATION_JSON})
	//@Produces("text/plain")
	public void  updateAnnouncement(Announcement announcement, String email){
		announcementRepository.updateAnnouncement(announcement);
	}
	
	@PUT
	@Path("/isSold")
	@Consumes("application/json")
	@Produces({MediaType.APPLICATION_JSON})
	public void isSold(Announcement announcement, String email){
		announcement.setStatusVendu("VENDU");
		announcementRepository.updateAnnouncement(announcement);
	}




	@DELETE
	@Path("{id}")

	public void deleteUser(@PathParam("id")int id){
		announcementRepository.deleteAnnouncement(id);
	}

	/*
	//resource without image
	@POST
	@Path("/createAnnouncement")
	@Consumes("application/json")
	public void  createAnnouncement(Announcement announcement) {  
	    System.out.println("model = " + announcement.getDescription());
	    announcement.setCreatedDate(new Date());
	    User user = userRepository.findUserByEmail(announcement.getMailAnnonceur());
	    announcement.setUser(user);
	    announcementRepository.addAnnouncement(announcement);
	} */


	//resource avec image
	@POST
	@Path("/createAnnouncement/{announcement}")
	@Produces(MediaType.TEXT_PLAIN)
	@Consumes("*/*")
	public Response createAnnouncement(
			InputStream stream ,
			@PathParam("announcement")String  announcement){

		Gson gson = new Gson(); 
		final Announcement announce = gson.fromJson(announcement, Announcement.class);

		System.out.println(announce.getPrixMobilier());
		byte[] image;
		try {
			image = IOUtils.toByteArray(stream);
			System.out.println(image);
			announce.setImg1(image);
			announce.setCreatedDate(new Date());
			announce.setStatusVendu("DISPONIBLE");  
			announce.setUser(userRepository.findUserByEmail(announce.getMailAnnonceur()));
			announcementRepository.addAnnouncement(announce);

			  // broadcast  l'emplacement pour envoyer les criteres de recherche aux personnes concernée  
			System.out.println("je vais envoyer une notification :"+announce.getEmplacement());
			OutboundEvent.Builder eventBuilder = new OutboundEvent.Builder();
			OutboundEvent event = eventBuilder.name("emplacement")
					.mediaType(MediaType.TEXT_PLAIN_TYPE)
					.data(String.class,announce.getEmplacement())
					.build();
			BROADCASTER.broadcast(event);

		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return Response.status(200).entity("done").build();

	}

}




