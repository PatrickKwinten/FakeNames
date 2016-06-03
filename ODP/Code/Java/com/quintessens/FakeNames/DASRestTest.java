package com.quintessens.FakeNames;

import java.io.Serializable;
import javax.ws.rs.core.MediaType;

import org.codehaus.jackson.map.ObjectMapper;

import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.WebResource;
import com.sun.jersey.api.client.config.ClientConfig;
import com.sun.jersey.api.client.config.DefaultClientConfig;

public class DASRestTest implements Serializable{

	private static final long serialVersionUID = 1L;
	
    public static Person[] getPersons(String url) {
        Person[] persons = null;
        try {
            ClientConfig config = new DefaultClientConfig();
            Client client = Client.create(config);
            WebResource service = client.resource(url);
            System.out.println("DASREST url:" + url);
            String json = service.accept(MediaType.APPLICATION_JSON).get(String.class);
            //System.out.println("DASREST json:" + json);
            ObjectMapper mapper = new ObjectMapper();
            persons = mapper.readValue(json, Person[].class);
            //System.out.println("DASREST persons length:" + persons.length);
        } catch (Exception e) {
        	System.out.println("catch...");
            e.printStackTrace();
        }
        return persons;
    }    
   
    
}
