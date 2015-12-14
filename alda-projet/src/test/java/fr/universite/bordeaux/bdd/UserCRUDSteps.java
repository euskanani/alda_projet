package fr.universite.bordeaux.bdd;

import static org.assertj.core.api.Assertions.assertThat;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;

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

public class UserCRUDSteps{
	
	private CloseableHttpClient client;
	private HttpPost httpPost;
	private CloseableHttpResponse response;

	@Given("a user with email $email and password is $password")
	public void givenAUser(String email, String password) throws UnsupportedEncodingException{
		client = HttpClients.createDefault();
		httpPost = new HttpPost("http://localhost:8080/ExerciseJPAWithMysql-1.0-SNAPSHOT/alda/users/addUser");
		 
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
		assertThat(response.getStatusLine().getStatusCode()).isEqualTo(204);
		HttpGet httpGet = new HttpGet("http://localhost:8080/ExerciseJPAWithMysql-1.0-SNAPSHOT/alda/users/"+email);
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
		
		HttpDelete httpDelete = new HttpDelete("http://localhost:8080/ExerciseJPAWithMysql-1.0-SNAPSHOT/alda/users/"+email);
		client.execute(httpDelete);
		client.close();
	}
	
}
