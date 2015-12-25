package fr.universite.bordeaux.resources;

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

import fr.universite.bordeaux.entities.User;
import fr.universite.bordeaux.repositories.UserRepository;

@Path("/users")
public class UserResource {
	@EJB
	UserRepository userRepository;

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
			return userRepository.findUserByEmail(user.getEmail());
		}

	}



	@DELETE
	@Path("/deleteUser/{email}")
	
	public void deleteUser(@PathParam("email")String email){
		userRepository.deleteUser(email);
	}
}
