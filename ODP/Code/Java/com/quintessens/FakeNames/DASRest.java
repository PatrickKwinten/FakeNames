package com.quintessens.FakeNames;

import javax.ws.rs.core.MediaType;
import org.codehaus.jackson.map.ObjectMapper;
import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.WebResource;
import com.sun.jersey.api.client.config.ClientConfig;
import com.sun.jersey.api.client.config.DefaultClientConfig;

import com.quintessens.FakeNames.Person;

public class DASRest {
	//private static Person[] persons;

	//public Person[] persons;

    public static Person[] getPersons(String url) {
        Person[] persons = null;
        try {
        	System.out.println("getPersons");
            ClientConfig config = new DefaultClientConfig();
            Client client = Client.create(config);
            WebResource service = client.resource(url);            
            String json = service.accept(MediaType.APPLICATION_JSON).get(String.class);           
            ObjectMapper mapper = new ObjectMapper();
            persons = mapper.readValue(json, Person[].class);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return persons;
    }
    
    public static Person getMorePersons(String url) {
        //Person[] morepersons = null;
        Person morepersons = null;
        try {
            ClientConfig config = new DefaultClientConfig();
            Client client = Client.create(config);
            WebResource service = client.resource(url);
           // System.out.println("getMorePersons url: " + url);
            String json = service.accept(MediaType.APPLICATION_JSON).get(String.class);            
            ObjectMapper mapper = new ObjectMapper();
            morepersons = mapper.readValue(json, Person.class);
            //System.out.println("getMorePersons json: " + json);
        } catch (Exception e) {
            e.printStackTrace();
        }
       // System.out.println("getMorePersons morepersons: " + morepersons);
        return morepersons;      
    }
    
    public static Person[] getPersons2(String url) {
        Person[] persons = null;
        try {
        	System.out.println("getPersons2");
            ClientConfig config = new DefaultClientConfig();
            Client client = Client.create(config);
            WebResource service = client.resource(url);       
            System.out.println("url:" + url);
            String json = service.accept(MediaType.APPLICATION_JSON).get(String.class);   
            System.out.println("json:" + json);
            ObjectMapper mapper = new ObjectMapper();
            persons = mapper.readValue(json, Person[].class);
            System.out.println("try");
        } catch (Exception e) {
        	System.out.println("catch");
            e.printStackTrace();
        }
        return persons;
    }
    
    public static String helloWorld(){
    	System.out.println("DASRest helloWorld()");
    	return "hello world";
    }
    
}