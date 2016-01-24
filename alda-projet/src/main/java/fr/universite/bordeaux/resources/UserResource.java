package fr.universite.bordeaux.resources;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;




import java.util.Properties;

import javax.annotation.Resource;
import javax.ejb.EJB;
import javax.mail.Authenticator;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import javax.servlet.ServletContext;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import fr.universite.bordeaux.entities.User;
import fr.universite.bordeaux.repositories.UserRepository;

@Path("/users")
public class UserResource {
	@EJB
	UserRepository userRepository;
	
	@Context
	ServletContext connectedUsers;
	
	//@Resource(name = "mail/Default")//, type = javax.mail.Session.class)
	//Session session;

	@GET
	@Produces({MediaType.APPLICATION_JSON})
	public List<User> getAllUsers(){
		return userRepository.getAllTheUsers();
	}

	@GET
	@Path("/{email}")
	@Produces({MediaType.APPLICATION_JSON})
	public User getUserByMail(@PathParam("email")String email){
		return userRepository.findUserByEmail(email);
	} 

	@GET
	@Path("/getById/{id}")
	@Produces({MediaType.APPLICATION_JSON})
	public User getUserById(@PathParam("id")String id){
		return userRepository.findUserById(id);
	}


	@POST
	@Path("/addUser")
	@Consumes("application/json")
	@Produces({MediaType.APPLICATION_JSON})
	public Response  addUser(User user){
		user.setDateInscription(new Date());		
		if(userRepository.emailAlreadyExists(user.getEmail())){
			return null ;
		}else {
			userRepository.addUser(user);
			return Response.status(200).entity(userRepository.findUserByEmail(user.getEmail())).build(); 
		}
	}


	@PUT
	@Path("/updateUser")
	@Consumes("application/json")
	@Produces({MediaType.APPLICATION_JSON})
	//@Produces("text/plain")
	public User  updateUser(User user){
		userRepository.updateUser(user);
		return userRepository.findUserByEmail(user.getEmail());
	}


	@POST
	@Path("/login")
	@Consumes("application/json")
	@Produces({MediaType.APPLICATION_JSON})
	public User  loginUser(User user){
		if(userRepository.findUserByEmail(user.getEmail())==null){
			return null;
		}else if(!(userRepository.findUserByEmail(user.getEmail()).getPassword()).equals(user.getPassword())){
			return null;
		} else {
			System.out.println("I m gonna connect");
			List<String> usersMail=(List<String>) connectedUsers.getAttribute("connectedUsers");
			if(usersMail==null){
				System.out.println("no user connected yet");
				List<String> contextmails=new ArrayList<String>();
				contextmails.add(user.getEmail());
				connectedUsers.setAttribute("connectedUsers", contextmails);
			}else {
				System.out.println("users connected exist");
				usersMail.add(user.getEmail());
				connectedUsers.removeAttribute("connectedUsers");
				connectedUsers.setAttribute("connectedUsers", usersMail);
			    @SuppressWarnings("unchecked")
				List<String> toPrint = (List<String>) connectedUsers.getAttribute("connectedUsers");
			    for(String email :toPrint){
			    	System.out.println("users connected are :"+email);
			    }
			}
			return userRepository.findUserByEmail(user.getEmail());
		}

	}
	
	
	@SuppressWarnings("unchecked")
	@GET
	@Path("/connectedUsers")
	@Produces({MediaType.APPLICATION_JSON})
	public List<String> getConnectedUsers(){
		List<String> toSend = (List<String>) connectedUsers.getAttribute("connectedUsers");
		return toSend;
	}
	
	
	
	@POST
	@Path("logout/{email}")
	@Produces(MediaType.TEXT_PLAIN)
	@Consumes("*/*")
	public Response logout(@PathParam("email")String email){
		System.out.println(email);
		System.out.println("I m going away, don t leave text message");
		
		@SuppressWarnings("unchecked")
		List<String> usersMail=(List<String>) connectedUsers.getAttribute("connectedUsers");
		for(int i = 0; i < usersMail.size();i++){
		    if(usersMail.get(i).equals(email)){
		       usersMail.remove(i--);
		    }
		}
		connectedUsers.removeAttribute("connectedUsers");
		connectedUsers.setAttribute("connectedUsers", usersMail);
		
		System.out.println("users connected are :");
	    @SuppressWarnings("unchecked")
		List<String> toPrint = (List<String>) connectedUsers.getAttribute("connectedUsers");
	    for(String emai :toPrint){
	    	System.out.println(emai);
	    }
	    
	    return Response.status(200).entity("user deconnected").build();
	} 



	@DELETE
	@Path("/deleteUser/{email}")

	public void deleteUser(@PathParam("email")String email){
		userRepository.deleteUser(email);
	}


	@POST
	@Path("resetPassword/{email}")
	@Produces(MediaType.TEXT_PLAIN)
	@Consumes("*/*")
	public Response resetPassword(@PathParam("email")String email) throws AddressException, MessagingException {
		
		boolean isvalid = EmailValidator(email);
		if(isvalid == true){
			
            //Create some properties and get the default Session
            final Properties props = new Properties();
            props.put("mail.transport.protocol", "smtp");
			props.put("mail.smtp.host", "smtp.gmail.com");
			props.put("mail.smtp.socketFactory.class","javax.net.ssl.SSLSocketFactory");
			props.put("mail.smtp.port", "465");
			props.put("mail.smtp.auth", "true");
			props.put("mail.imap.ssl.enable", "true");

            final Session session = Session.getInstance(props, new Authenticator() {
                @Override
                protected PasswordAuthentication getPasswordAuthentication() {
                    return new PasswordAuthentication("kenetienne15@gmail.com", "Madagascar8");
                }
            });

            //Set this just to see some internal logging
            session.setDebug(true);
			
			Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress("kenetienne15@gmail.com"));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(email));
			message.setSubject("resetting password..");
			String emailBody = "votre mot de passe est : " +userRepository.findUserByEmail(email).getPassword()+"\n   Suivez ce lien http://localhost:8080/alda-projet/index.html#/connexion  pour vous connecter.\n\nCordialement, \n\nAldaMarket Admin";
			message.setText(emailBody);

            Transport.send(message);
            
			return Response.status(200).entity("email envoye").build();

		}else {
			return Response.status(404).entity("email non valide").build();
		}
	} 



	// verification de la validité de l'adresse email
	private boolean EmailValidator(String email) {
		boolean isValid = false;
		try {

			//
			// Create InternetAddress object and validated the supplied
			// address which is this case is an email address.
			InternetAddress internetAddress = new InternetAddress(email);
			internetAddress.validate();
			isValid = true;
		} catch (AddressException e) {
			System.out.println("You are in catch block -- Exception Occurred for: " + email);
		}
		return isValid;
	}
}
