package com.quintessens.FakeNames;

import java.io.PrintWriter;
import java.util.Vector;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import lotus.domino.ViewEntry;
import lotus.domino.ViewEntryCollection;
import lotus.domino.ViewNavigator;

import com.ibm.commons.util.io.json.JsonJavaArray;
import com.ibm.commons.util.io.json.JsonJavaObject;
import com.ibm.domino.services.rest.RestServiceEngine;
import com.ibm.xsp.extlib.component.rest.CustomService;
import com.ibm.xsp.extlib.component.rest.CustomServiceBean;

import org.openntf.domino.xsp.XspOpenLogUtil;
import org.openntf.domino.utils.XSPUtil;

import org.openntf.domino.Database;
import org.openntf.domino.Session;
import org.openntf.domino.View;
import org.openntf.domino.DocumentCollection;
import org.openntf.domino.Document;

public class PersonsJSON extends CustomServiceBean{

	@Override
	public void renderService(CustomService service,RestServiceEngine engine){
		HttpServletRequest request = engine.getHttpRequest();
		HttpServletResponse response = engine.getHttpResponse();		
		System.out.println("===");
		response.setHeader("Content-Type", "application/json; charset=UTF-8");
		try{
			final Session session = XSPUtil.getCurrentSession();
			Database db = session.getCurrentDatabase();
			View view = db.getView("PeoplePlus");
			view.setAutoUpdate(false);
			PrintWriter writer = response.getWriter();				
			JsonJavaObject json = new JsonJavaObject();
			
			
			ViewNavigator navigator;
			//use a ViewNavigator to loop
			//optimization found: http://www.everythingaboutit.eu/2012/04/peformance-trick-beim-durchlesen-von.html
			navigator = view.createViewNav();
			navigator.setBufferMaxEntries(1024);
			//VN_ENTRYOPT_NOCOUNTDATA we are not interested in the number of children, we can go a little faster
			navigator.setEntryOptions(ViewNavigator.VN_ENTRYOPT_NOCOUNTDATA);
			
			ViewEntryCollection vec;
			
			vec = view.getAllEntries();		
			ViewEntry entry = navigator.getFirstDocument();
			
			Integer count = 0;
			
			JsonJavaArray arr = new JsonJavaArray();
			
			while (entry != null) {
			   
				/*View: 
				 * 1. Column: SortKey
				 * 2. Column: JSON String: (z.b. {"docUNID": "FAE110220E57ECE7C12578A700375101","name": "John Doe","job": "Office Manager","pictureURL": "https://dev1.quintessens.com/directory.nsf/0/FAE110220E57ECE7C12578A700375101/$FILE/PortalPicture.jpg"})
				*/
				
				Vector<?> columnValues = entry.getColumnValues();
				String colJson = String.valueOf(columnValues.get(1));

				JsonJavaObject jo = new JsonJavaObject();
				
				
				
				String firstName = String.valueOf(columnValues.get(2));
				if (null!=firstName){
					jo.put("firstname",firstName);
				}	
				String lastName = String.valueOf(columnValues.get(1));
				if (null!=lastName){
					jo.put("lastname",lastName);
				}	
				String company = String.valueOf(columnValues.get(0));
				if (null!=company){
					jo.put("company",company);
				}
				
				// add the json object to the json array
				arr.put(count, jo);
				
			   ViewEntry tempEntry = entry;
			   entry = navigator.getNextDocument();
			   tempEntry.recycle();
			   count++;
			} 
			
			json.put("data", arr);
		
			
			// prepare json output
			writer.write(json.toString());
			writer.close();
			//set view update back to normal
			view.setAutoUpdate(true);
		} catch (Throwable t) {
			XspOpenLogUtil.logError(t);
		}
	}
	
}
