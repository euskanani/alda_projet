package fr.universite.bordeaux;

import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import javax.ws.rs.ApplicationPath;
import javax.ws.rs.core.Application;

import org.glassfish.jersey.media.sse.SseFeature;

import fr.universite.bordeaux.resources.AnnoucementResource;
import fr.universite.bordeaux.resources.UserResource;
//import fr.universite.bordeaux.sseresources.SseResource;


@ApplicationPath("alda")
public class ApplicationConfig extends Application{
    @Override
    public Set<Class<?>> getClasses() {
        
        Set<Class<?>> resources = new java.util.HashSet<>();
        
        System.out.println("REST configuration starting: getClasses()");            
        
        //features
        //this will register Jackson JSON providers
        resources.add(org.glassfish.jersey.jackson.JacksonFeature.class);

        //instead let's do it manually:
        resources.add(UserResource.class);
        resources.add(AnnoucementResource.class);
        //resources.add(SseResource.class);
        //==> we could also choose packages, see below getProperties()
        
        System.out.println("REST configuration ended successfully.");
        
        return resources;
    }
    

	@Override
	public Set<Object> getSingletons() {
		//return Collections.emptySet();
		Set<Object> singletons=new HashSet<>();
		singletons.add(new SseFeature());
		return singletons;
	}
    
    @Override
    public Map<String, Object> getProperties() {
        Map<String, Object> properties = new HashMap<>();
        
        //in Jersey WADL generation is enabled by default, but we don't 
        //want to expose too much information about our apis.
        //therefore we want to disable wadl (http://localhost:8080/service/application.wadl should return http 404)
        //see https://jersey.java.net/nonav/documentation/latest/user-guide.html#d0e9020 for details
        properties.put("jersey.config.server.wadl.disableWadl", true);
        
        //we could also use something like this instead of adding each of our resources
        //explicitly in getClasses():
        //properties.put("jersey.config.server.provider.packages", "com.nabisoft.tutorials.mavenstruts.service");
        
        
        return properties;
    }    
}