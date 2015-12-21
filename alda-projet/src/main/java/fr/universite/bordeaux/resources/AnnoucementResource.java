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


	@GET
	@Path("/{email}")
	@Produces({MediaType.APPLICATION_JSON})
	public List<Announcement> getAnnouncementsByUser(@PathParam("email")String email){
		User user = userRepository.findUserByEmail(email);
		return announcementRepository.findAnnouncementsByUser(user);
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
	
	@DELETE
	@Path("/deleteAnnouncement/{email}")
	
	public void deleteUser(@PathParam("email")String email){
		announcementRepository.deleteAnnouncement(email);
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
		
		System.out.println(announce.getName());
	    byte[] image;
		try {
			image = IOUtils.toByteArray(stream);
			System.out.println(image);
			announce.setImg1(image);
			announce.setCreatedDate(new Date());
			announce.setUser(userRepository.findUserByEmail(announce.getMailAnnonceur()));
			announcementRepository.addAnnouncement(announce);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return Response.status(200).entity("done").build();

	}

}


