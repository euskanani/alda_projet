package fr.universite.bordeaux.resources;

import java.util.Date;
import java.util.List;

import javax.ejb.EJB;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

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

	@POST
	@Path("/addUser")
	@Consumes("application/json")
	@Produces({MediaType.APPLICATION_JSON})
	public User  addUser(User user){
		user.setDateInscription(new Date());
		userRepository.addUser(user);
		return userRepository.findUserByEmail(user.getEmail());
	}
	
	
	@POST
	@Path("/updateUser")
	@Consumes("application/json")
	@Produces({MediaType.APPLICATION_JSON})
	public User  updateUser(User user){
		userRepository.updateUser(user);
		return userRepository.findUserByEmail(user.getEmail());
	}


	@POST
	@Path("/login")
	@Consumes("application/json")
	@Produces({MediaType.APPLICATION_JSON})
	public User  loginUser(User user){
		if(!(userRepository.findUserByEmail(user.getEmail()).getPassword()).equals(user.getPassword())){
			return null;
		} else {
			return userRepository.findUserByEmail(user.getEmail());
		}

	}



	@DELETE
	@Path("/{email}")
	public void deleteUser(@PathParam("email")String email){
		userRepository.deleteUser(email);
	}
}
