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
import javax.ws.rs.core.Response;

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

/*
	@POST
	@Path("/addAnnonce")
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	public Response  addAnnouncement((List<Attachment> attachments, @Context HttpServletRequest request) {
		for (Attachment attachment : attachments) {
			DataHandler handler = attachment.getDataHandler();
			try {
				InputStream stream = handler.getInputStream();
				MultivaluedMap<String, String> map = attachment.getHeaders();
				System.out.println("fileName Here" + getFileName(map));
				OutputStream out = new FileOutputStream(new File("C:/uploads/" + getFileName(map)));

				int read = 0;
				byte[] bytes = new byte[1024];
				while ((read = stream.read(bytes)) != -1) {
					out.write(bytes, 0, read);
				}
				stream.close();
				out.flush();
				out.close();
			} catch (Exception e) {
				e.printStackTrace();
			}
		}

		return Response.ok("file uploaded").build();
	}
*/



}



/*
 * File file = new File("images/extjsfirstlook.jpg");
        byte[] bFile = new byte[(int) file.length()];

        try {
         FileInputStream fileInputStream = new FileInputStream(file);
         fileInputStream.read(bFile);
         fileInputStream.close();
        } catch (Exception e) {
         e.printStackTrace();
        }

        Book book = new Book();
        book.setName("Ext JS 4 First Look");
        book.setImage(bFile);

        bookDAO.saveBook(book);
 */
