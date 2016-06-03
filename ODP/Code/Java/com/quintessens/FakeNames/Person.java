package com.quintessens.FakeNames;

import java.io.Serializable;

import javax.xml.bind.annotation.XmlRootElement;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.annotate.JsonProperty;

@XmlRootElement
@JsonIgnoreProperties(ignoreUnknown = true)
public class Person implements Serializable{
	
	private static final long serialVersionUID = 1L;
	private String name;//$17
	private String companyName;
	private String jobtitle;
	
	@JsonProperty("$17")
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	@JsonProperty("CompanyName")
	public String getCompanyname() {
		return companyName;
	}
	public void setCompanyname(String companyname) {
		this.companyName = companyname;
	}
	public String getJobtitle() {
		return jobtitle;
	}
	public void setJobtitle(String jobtitle) {
		this.jobtitle = jobtitle;
	}
}