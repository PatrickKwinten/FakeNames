package com.quintessens.FakeNames;

import javax.ws.rs.core.MediaType;
import org.codehaus.jackson.map.ObjectMapper;
import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.WebResource;
import com.sun.jersey.api.client.config.ClientConfig;
import com.sun.jersey.api.client.config.DefaultClientConfig;

import com.quintessens.FakeNames.Person;

public class DASRest {

    public static Person[] getPersons(String url) {
        Person[] persons = null;
        try {
            ClientConfig config = new DefaultClientConfig();
            Client client = Client.create(config);
            WebResource service = client.resource(url);
            System.out.println("DASREST url:" + url);
            String json = service.accept(MediaType.APPLICATION_JSON).get(String.class);
            System.out.println("DASREST json:" + json);
            ObjectMapper mapper = new ObjectMapper();
            persons = mapper.readValue(json, Person[].class);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return persons;
    }
}