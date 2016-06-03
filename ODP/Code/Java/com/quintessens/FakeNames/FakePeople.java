package com.quintessens.FakeNames;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Vector;

import lotus.domino.NotesException;

import lotus.domino.Database;
import lotus.domino.Session;
import lotus.domino.View;
import lotus.domino.ViewEntry;

import lotus.domino.ViewEntryCollection;

import com.ibm.commons.util.io.json.JsonException;
import com.ibm.commons.util.io.json.JsonJavaFactory;
import com.ibm.commons.util.io.json.JsonJavaObject;
import com.ibm.commons.util.io.json.JsonParser;
import com.ibm.domino.xsp.module.nsf.NotesContext;

public class FakePeople implements Serializable{
	public static final long serialVersionUID = 1L;	
	
	

	public FakePeople(){
		System.out.println("FN Constructor");
	}
	
	public ArrayList<JsonJavaObject> loadPersons() throws NotesException{
		
		ArrayList<JsonJavaObject> PersonCollection = new ArrayList<JsonJavaObject>();
		
		NotesContext nct = NotesContext.getCurrent();
		Session session = nct.getCurrentSession();
		
		String ServerName = "dev1";
		String DatabaseName = session.getCurrentDatabase().getFilePath();
		String ViewName = "PeopleJSON";		
		String Key = "";
		
		try {
			loadJSONObjects(ServerName, DatabaseName, ViewName, Key, 1);
			
		} catch (NotesException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}	
		
		return PersonCollection;		
	}
	
	public ArrayList<JsonJavaObject> loadJSONObjects(String ServerName, String DatabaseName, String ViewName, String Key, Integer ColIdx) throws NotesException {
		System.out.println("FN.loadJSONObjects: get loadJSONObjects...");
		ArrayList<JsonJavaObject> JSONObjects = new ArrayList<JsonJavaObject>();
		
		NotesContext nct = NotesContext.getCurrent();
		Session session = nct.getCurrentSession();
		Database DB = session.getDatabase(ServerName, DatabaseName);
		
		if (!(DB==null)) {
			View luView = DB.getView(ViewName); 
			
			if (!(luView == null)) {
				JsonJavaFactory factory = JsonJavaFactory.instanceEx;
				
				ViewEntryCollection vec = luView.getAllEntriesByKey(Key, true);

				ViewEntry entry = vec.getFirstEntry();
				while (entry != null) {
					
					/*View: 
					 * 1. Column: Key (sorted)
					 * 2. Column: JSON String: (z.b. {"docUNID": "FAE110220E57ECE7C12578A700375101","name": "John Doe","job": "Engineer","pictureURL": "https://dev1/picture.nsf/0/FAE110220E57ECE7C12578A700375101/$FILE/picture.jpg"})
					*/
					
					Vector<?> columnValues = entry.getColumnValues();
					String colJson = String.valueOf(columnValues.get(ColIdx));
					JsonJavaObject json = null;
					
					try {
						json = (JsonJavaObject) JsonParser.fromJson(factory, colJson);
						if (json != null) {
							JSONObjects.add(json);
						}
							
					} catch (JsonException e) {
						System.out.println("ERROR: FN.loadJsonObjects 1: colJson: ");
					}
						
				   ViewEntry tempEntry = entry;
				   entry = vec.getNextEntry();
				   tempEntry.recycle();
				} 	
				luView.recycle();
			}
			DB.recycle();
		}
		
		return JSONObjects;
	}
	

}