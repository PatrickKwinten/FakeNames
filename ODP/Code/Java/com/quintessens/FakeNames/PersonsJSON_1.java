package com.quintessens.FakeNames;

import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Vector;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

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

public class PersonsJSON_1 extends CustomServiceBean{

	@Override
	public void renderService(CustomService service,RestServiceEngine engine){
		HttpServletRequest request = engine.getHttpRequest();
		HttpServletResponse response = engine.getHttpResponse();		
		String typeName = request.getParameter("type");	
		//String priceMissing = request.getParameter("price");
	/*	if(null==priceMissing){
			priceMissing = "";
		}else if(priceMissing.equals("true")){
			priceMissing = "Yes";
		}
		else if(priceMissing.equals("false")){
			priceMissing = "No";
		}
		else{
			priceMissing = "";
		}*/
		System.out.println("===");
		response.setHeader("Content-Type", "application/json; charset=UTF-8");
		try{
			final Session session = XSPUtil.getCurrentSession();
			Database db = session.getCurrentDatabase();
			View view = db.getView("vw-lkup-security-type");
			view.setAutoUpdate(false);
			PrintWriter writer = response.getWriter();				
			JsonJavaObject json = new JsonJavaObject();
			
			if (null != typeName){
				System.out.println("collect ALL the data, with param type =" + typeName);
				System.out.println("collect ALL the data, with param price =" + request.getParameter("price"));
				System.out.println("collection BEFORE filtering: " + view.getAllEntries().getCount());
				ArrayList keys = new ArrayList<String>();
				keys.add(typeName);
				if(null!=request.getParameter("price")){
					System.out.println("OMG priceMissing not null but " + request.getParameter("price"));
					if(request.getParameter("price").equals("true")){
						
						keys.add("Yes");
					}
					else {
						keys.add("No");
					}
					//keys.add(request.getParameter("price"));
				}
				else{
					System.out.println("OMG priceMissing = " + request.getParameter("price"));
				}
				//keys.add(priceMissing);
				//Vector query = new Vector<String>();
				//query.add(typeName);
				//query.add(priceMissing);
				// get all data matching the provided key
				System.out.println("Keys filtering: " + keys.toString());
				
				DocumentCollection dc = view.getAllDocumentsByKey(keys, true);

				System.out.println("collection AFTER filtering: " + dc.getCount());
				JsonJavaArray arr = new JsonJavaArray();
				if (dc.getCount() != 0){
					int count = 0;
					for (Document doc : dc) {
						JsonJavaObject jo = new JsonJavaObject();						
						Date lastUpdate = doc.getItemValue("LASTUPDATE", java.util.Date.class);
						if (null!=lastUpdate){
							//jo.put("udate", doc.getItemValue("LASTUPDATE", java.util.Date.class).toString());
							SimpleDateFormat format1 = new SimpleDateFormat("yyyy/MM/dd HH:mm");
							jo.put("udate",format1.format(lastUpdate.getTime()) );
							
						}						
						jo.put("sname", null);
						jo.put("name", null);
						
						String currency = doc.getItemValueString("CURRENCY");
						if (null!=currency){
							jo.put("curr",currency);
						}
						
						jo.put("exch", null);
						
						Double close =  doc.getItemValueDouble("YesterdayClosePrice");
						if (null!=close){
							jo.put("close", close);
						}
						
						jo.put("ask", null);
						jo.put("bid", null);
						jo.put("mid", null);
						jo.put("traded", null);
						jo.put("fix", null);
						// add the json object to the json array
						arr.put(count, jo);
						count++;
					}									
				}		
				// add the json array to the json object
				json.put("data", arr);				
			}
			else{
				// collect ALL the data, no param filtering
				System.out.println("collect ALL the data, no param filtering");
				System.out.println(view.getAllEntries().getCount());
				
				DocumentCollection dc = view.getAllDocuments();
				JsonJavaArray arr = new JsonJavaArray();
				if (dc.getCount() != 0){
					int count = 0;					
					for (Document doc : dc) {
						JsonJavaObject jo = new JsonJavaObject();
						
						Date lastUpdate = doc.getItemValue("LASTUPDATE", java.util.Date.class);
						if (null!=lastUpdate){
							//jo.put("udate", doc.getItemValue("LASTUPDATE", java.util.Date.class).toString());
							SimpleDateFormat format1 = new SimpleDateFormat("yyyy/MM/dd HH:mm");
							jo.put("udate",format1.format(lastUpdate.getTime()) );
						}
						
						jo.put("sname", null);
						jo.put("name", null);
						
						String currency = doc.getItemValueString("CURRENCY");
						if (null!=currency){
							jo.put("curr",currency);
						}						
						jo.put("exch", null);
						
						Double close =  doc.getItemValueDouble("YesterdayClosePrice");
						if (null!=close){
							jo.put("close", close);
						}
						
						jo.put("ask", null);
						jo.put("bid", null);
						jo.put("mid", null);
						jo.put("traded", null);
						jo.put("fix", null);
						// add the json object to the json array
						arr.put(count, jo);
						count++;
					}
				}
				// add the json array to the json object
				json.put("data", arr);
			}
			
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
