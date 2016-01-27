package fr.universite.bordeaux.bdd;

import static org.assertj.core.api.Assertions.assertThat;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;

import javax.ws.rs.PathParam;

import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpDelete;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.jbehave.core.annotations.Given;
import org.jbehave.core.annotations.Then;
import org.jbehave.core.annotations.When;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import fr.universite.bordeaux.entities.Announcement;
import fr.universite.bordeaux.repositories.AnnoucementRepository;
import fr.universite.bordeaux.repositories.AnnouncementRepository;

public class UserCRUDSteps{
	
	private CloseableHttpClient client;
	private HttpPost httpPost;
	private CloseableHttpResponse response;

	@Given("a user with email $email and password is $password")
	public void givenAUser(String email, String password) throws UnsupportedEncodingException{
		client = HttpClients.createDefault();
		httpPost = new HttpPost("http://localhost:8080/alda-projet/alda/users/addUser");
		 
	    String json = "{\"email\":\""+email+"\",\"password\":\""+password+"\"}";
	    StringEntity entity = new StringEntity(json);
	    httpPost.setEntity(entity);
	    httpPost.setHeader("Content-type", "application/json");
	}
	
	@When("I add user")
	public void addUser() throws ClientProtocolException, IOException{
		response = client.execute(httpPost);
	}
	
	@Then("a user with email $email should be added into the database")
	public void checkIfUserAdded(String email) throws IOException{
		//assertThat(response.getStatusLine().getStatusCode()).isEqualTo(204);
		HttpGet httpGet = new HttpGet("http://localhost:8080/alda-projet/alda/users/"+email);
		response = client.execute(httpGet);
		BufferedReader rd = new BufferedReader(new InputStreamReader(response.getEntity().getContent()));

		StringBuffer result = new StringBuffer();
		String line = "";
		while ((line = rd.readLine()) != null) {
		    result.append(line);
		}

		ObjectMapper mapper = new ObjectMapper();
		JsonNode actualObj = mapper.readTree(result.toString());
		String retrievedEmail = actualObj.get("email").textValue();
		assertThat(retrievedEmail).isEqualTo(email);
		
		HttpDelete httpDelete = new HttpDelete("http://localhost:8080/alda-projet/alda/users/deleteUser/"+email);
		client.execute(httpDelete);
		client.close();
	}
	
	
	/*--------------------show my announcement after login------------------------*/
	
	@Given(" user with email $email and password is $password")
	public void givenAUserLogin(String email, String password) throws UnsupportedEncodingException{
		client = HttpClients.createDefault();
		httpPost = new HttpPost("http://localhost:8080/alda-projet/alda/users/login");
		 
	    String json = "{\"email\":\""+email+"\",\"password\":\""+password+"\"}";
	    StringEntity entity = new StringEntity(json);
	    httpPost.setEntity(entity);
	    httpPost.setHeader("Content-type", "application/json");
	}
	

	@When("I'm login")
	public void UserLogin() throws ClientProtocolException, IOException{
		response = client.execute(httpPost);
	}
	
	
	@Then("a user with email $email will see their own announcement")
	public void checkIfGetAnnouncement(String email) throws IOException{
		//assertThat(response.getStatusLine().getStatusCode()).isEqualTo(204);
		HttpGet httpGet = new HttpGet("http://localhost:8080/alda-projet/alda/announcements/"+email);
		response = client.execute(httpGet);
		BufferedReader rd = new BufferedReader(new InputStreamReader(response.getEntity().getContent()));

		StringBuffer result = new StringBuffer();
		String line = "";
		while ((line = rd.readLine()) != null) {
		    result.append(line);
		}

		
		
	}
	
	
	/*----------------------------add a new announcement--------------------------------------------*/
	
	
	
	@Then("a user with email $email will add an announcement")
	public void checkIfAddAnnouncement(@PathParam("announcement")String  announcement) throws IOException{
		//assertThat(response.getStatusLine().getStatusCode()).isEqualTo(204);
		HttpPost httpPost = new HttpPost("http://localhost:8080/alda-projet/alda/announcements/createAnnouncement/"+announcement);
		response = client.execute(httpPost);
		BufferedReader rd = new BufferedReader(new InputStreamReader(response.getEntity().getContent()));

		StringBuffer result = new StringBuffer();
		String line = "";
		while ((line = rd.readLine()) != null) {
		    result.append(line);
		}
	
	}
	
	
	
	
}
