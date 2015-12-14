package fr.universite.bordeaux.resources;

import java.util.Date;
import java.util.List;

import javax.ejb.EJB;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

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
    @Produces({MediaType.APPLICATION_JSON})
    public List<Announcement> getAnnouncementsByUser(){
        User user = userRepository.findUserByEmail("test@gmail.com");
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
}
