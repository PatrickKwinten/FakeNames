//CSJS functions - Patrick
function createCookie(name, value, days) 
{
    var expires;
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    } else {
        expires = "";
    }
    document.cookie =  APP.regKey + encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=/";
}

function readCookie(name) 
{
    var nameEQ = APP.regKey + encodeURIComponent(name) + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
    return null;
}

function eraseCookie(name) 
{
	//createCookie(cookies[i].substring(APP.regKeyLength+1), "", -1);
	createCookie(name, "", -1);
}

function readCookies()
{
	var cookies = getCookiesNames();
	$.each( cookies, function(i) 
	{
		var filter = readCookie(name);		
	});    	
}

function getCookiesNames() 
{
    var names = new Array();
    if (document.cookie && document.cookie != '') {
        var split = document.cookie.split(';');   
        for (var i = 0; i < split.length; i++) {
        	var name_value = split[i].split("=");
        	//Only use cookies set for this application
        	if (name_value[0].indexOf(APP.regKey) > -1){
        		names.push(name_value[0]);
        	}              
        }
    }
    return names;   
}

function getFacetCookiesNames() 
{
	//RETURNS ONLY COOKIE NAMES FOR REQUESTED FACETS
    var names = new Array();
    var facets = getFacets("facets",",");
    if (document.cookie && document.cookie != '') {
        var split = document.cookie.split(';');   
        for (var i = 0; i < split.length; i++) {
        	var name_value = split[i].split("=");
        	if (name_value[0].indexOf(APP.regKey) > -1){
        		//var key = name_value[0].substring(APP.regKeyLength+1);
        		if( facets.indexOf(name_value[0].substring(APP.regKeyLength+1)) > -1){
        			names.push(name_value[0]);
        		}        		
        	}              
        }
    }
    return names;   
}

function eraseCookies() 
{
	var cookies = getCookiesNames();
	$.each( cookies, function(i) 
	{
		if (cookies[i]){
			//Only use cookies set for this application
			createCookie(cookies[i].substring(APP.regKeyLength+1), "", -1);
		}			
	});    
}

function writeCookiesValues(target){
	$("#cookies").empty();
	return;//BREAK THIS;MORE FOR DEBUGGING
	var cookies = getCookiesNames();
	$.each( cookies, function(i) 
	{
		var cookieVal = readCookie(cookies[i].substring(APP.regKeyLength+1));
		var cookieVals = cookieVal.split(",");
		$.each( cookieVals, function(n) 
			{
				$('#cookies').append(cookies[i] + ":" + cookieVals[n] + "<br/>");
			});
	});    
}

function unique(list) 
{
    var result = [];
    $.each(list, function(i, e) 
    {
        if ($.inArray(e, result) == -1) result.push(e);
    });
    return result;
}

function naturalCompare(a, b) 
{
    var ax = [], bx = [];
    a.replace(/(\d+)|(\D+)/g, function(_, $1, $2) { ax.push([$1 || Infinity, $2 || ""]) });
    b.replace(/(\d+)|(\D+)/g, function(_, $1, $2) { bx.push([$1 || Infinity, $2 || ""]) });
    while(ax.length && bx.length) 
    {
        var an = ax.shift();
        var bn = bx.shift();
        var nn = (an[0] - bn[0]) || an[1].localeCompare(bn[1]);
        if(nn) return nn;
    }
    return ax.length - bx.length;
}
$.urlParam = function(name)
{
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null){
       return null;
    }
    else{
       return results[1] || 0;
    }
}

function getUrlVars()
{
//http://jquery-howto.blogspot.de/2009/09/get-url-parameters-values-with-jquery.html
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function getFacets(param,splitter)
{
	var facetsParam = getUrlVars()[param];
	facetsParam = decodeURI(facetsParam.replace(/%2C/g, ","));
	var facets = facetsParam.replace("[","").replace("]","").split(splitter);
	return facets;
}
function writeFacets(data){
	$("#facets").children().remove();
	var facets = getFacets("facets",",");			
	$.each( facets, function(i, obj) 
	{
		var facetsVal = facets[i];
		var facet= new Array();
		$.each( data, function(i, obj) 
		{
			facet.push( data[i][facetsVal]);
		});
		facet = unique(facet);
		facet.sort(naturalCompare);
		writeFacet(facet,facets[i],facets[i]);	
	});	
}
function writeFacet(data,id,header){
	var d = document.createElement("div");
	var h = document.createElement("H2");
	d.appendChild(h);
	var t = document.createTextNode(id + " (" + data.length + ")");       // Create a text node
	h.appendChild(t); 
	facetListID = "#facets";
	$(facetListID).append(d);
	//$(facetListID).append("<ul style='list-style-type: none;' id=\"facetList-" + id + "\">");
	
	$.each(data, function (i) 
		{
		var sum = new Array();	
		sum = $.grep(APP.jsonScopeData, function (element, index) {
			return element[id] == data[i];
		});			
			//$('#facets').append("<li class='btn btn-default'><i class='glyphicon glyphicon-plus' onClick='applyFilter(\"" + id + "\",\"" + data[i] + "\");'>" + data[i] + "</i></li>");
		$('#facets').append("<span class='btn btn-default' title='apply this filter' onClick='applyFilter(\"" + id + "\",\"" + data[i] + "\");'><span class='glyphicon glyphicon-plus' ></span>" + data[i] + "&nbsp;<span class='badge badge-apple' style='background-color:#5195ce'>" + sum.length + "</span></span>")
		});
	//$('#facet').append("</ul>");
}

function writeCard(unid, lastname, firstname, pictureUrl, job)
{
	var line01 = "<div class=\"list-margin col-xs-12 col-sm-6 col-md-4 col-lg-3\" style=\"min-width: 250px\">";
	var line02 = "<a onclick=\"document.location.href='/SelfServiceSR.nsf/Person.xsp?&amp;unid=" + unid + "'\" class=\"list-group-item click-card overflow-ellipsis\" style=\"height:90px\" id=\"\">";
	var line03 = "<div class=\"media\">";
	var line04 = "<p class=\"pull-left\">";
	var line05 = "<img class=\"img-rounded\" alt=\"\" src=\"" + pictureUrl + "\" id=\"\">/";
	var line06 = "</p>";
	var line07 = "<h4 class=\"list-group-item-heading overflow-ellipsis\" style=\"padding-right:7px\" id=\"\">" + firstname + " " + lastname + "</h4>";
	var line08 = "<p class=\"list-group-item-text rowDetails overflow-ellipsis\" id=\"\">" + job + "</p>";
	var line09 = "</div></a></div>";
	var html = line01 + line02 + line03 + line04 + line05 + line06 + line07 + line08 + line09;
	return html;
}


function writeResultList(data)
{
	$("#listResult").children().remove();
	$('#listResult').append("<h4>Showing the total of " + data.length + " result(s)</h4>");
	$('#listResult').append("<ul id='listResultUL' style='list-style-type: none;'>");	
	$.each(data, function (i) {
	   	var unid = data[i]["@unid"];
		var lastname = data[i].name;
		var firstname = data[i].firstname;
		var pictureUrl = data[i].pictureURL;
		var job = data[i].job;
		var card = writeCard(unid, lastname, firstname, pictureUrl, job);
		$('#listResultUL').append("<li>" + card + "</li>");	   	
	});			
}

function writeQuery(showSearch)
{
	$("#query").empty();
	if (search !=="null" && showSearch == true){
		$('#query').append("<button type='button' class='btn' style='background-color:#5195ce;color:#fff;' title='remove search' onclick='removeSearch()'><span class='glyphicon glyphicon-zoom-out' ></span>" + search + "</button>");
	}	
	var cookies = getFacetCookiesNames();
	cookies.sort(naturalCompare);
	$.each( cookies, function(i) 
	{
		var cookieVal = readCookie(cookies[i].substring(APP.regKeyLength+1));	
		var cookieVals = cookieVal.split(",");
		$.each( cookieVals, function(n) {
    		var sum = new Array();	
    		sum = $.grep(APP.jsonScopeData, function (element, index) {
    			return element[cookies[i].substring(APP.regKeyLength+1)] == cookieVals[n];
    		});
    		$('#query').append("<button class='btn' style='background-color:#5195ce;color:#fff;' title='remove filter' onClick='removeFilter(\"" + cookies[i].substring(APP.regKeyLength+1) + "\",\"" + cookieVals[n] + "\");'><span class='glyphicon glyphicon-remove-circle' ></span>" + cookieVals[n] + "&nbsp;<span class='badge badge-apple' style='background-color:#5bc236'>" + sum.length + "</span></button>")
    	});
	}); 
	
}

function writeQuerySortOptions(){
	$("#querysort").empty();
	var facets = getFacets("facets",",");	
	var data = APP.jsonScopeData;
	$.each( facets, function(i) 
	{
		var icon = "glyphicon glyphicon-sort"
		$('#querysort').append("<button class='btn btn-default' id=\"" + facets[i] + "\" type='button' title='sort result' onClick='javascript:sortResults(\"" + facets[i] + "\");'><span class='" + icon +"' ></span>" + facets[i] + "</button>")
		
		//$('#querysort').append("<span style=\"padding-right:10px;\" id=\"" + facets[i] + "\" onclick='javascript:sortResults(\"" + facets[i] + "\""+")'>" + facets[i] +"</span>");
	}); 
}

function applyFilter(filter,value){
	var filter = filter;
	if (isNewFilter(filter) == true){
		createCookie(filter, value, 7); 
	}
	else{
		isNewFilterValue(filter,value);
	}
	var cookies = getCookiesNames();
	data = collectData();
	writeFacets(data);
	writeCookiesValues("cookies");
	writeQuery(true);		
	writeQuerySortOptions();
	writeResultList(data);	
}

function removeFilter(key,value){
	cookieKey = $.trim(APP.regKey + key);
	var cookies = getCookiesNames();
	var cookieVals = new Array();
	$.each( cookies, function(i) 	
	{
		if($.trim(cookies[i])==cookieKey){
			var cookieVal = readCookie(key);
			var cookieVals = cookieVal.split(",");	
			if ($.inArray($.trim(value), cookieVals) !== -1)
			{
				cookieVals.splice(cookieVals.indexOf($.trim(value)), 1);
			}
			if (cookieVals.length>0){
				createCookie(key, cookieVals.join(), 7);
			}
			else{
				createCookie(key, "", -1);
			}						
		}		
	});	
	data = collectData();
	writeFacets(data);
	writeCookiesValues("cookies");
	writeQuery(true);	
	writeResultList(data);	
}

function removeSearch()
{
	search = "null"
	createCookie("_DisplaySearch", false, -1);
	APP.personRestURL = "./restServices.xsp/asJSON";
	APP.jsonScopeData = new Array();	
	$.getJSON( "./restServices.xsp/asJSON", function( data ) 
	{
		APP.jsonData = data;
		data = collectData();
		writeFacets(data);
		writeCookiesValues("cookies");
		writeQuery(false);	
		writeResultList(data);	
	});
}

function collectData(){
	dispSearch = readCookie("_DisplaySearch");
	
	createCookie("_DisplaySearch","",-1);
	
	var cookies = getCookiesNames();
	//remove "displaysearch from cookies
	
	
	if (cookies.length == 0){
		//NO FILTERS APPLIED
		data = APP.jsonData;
//		return data;
	}
	else{
		
		var data = new Array();
		data = APP.jsonData;
		$.each( cookies, function(i) 
			{
//				var cookieVal = readCookie(cookies[i].substring(APP.regKeyLength+1));
//				data = $.grep(APP.jsonData, function (element, index) {
//					return element[cookies[i].substring(APP.regKeyLength+1)] == cookieVal;
//				});		
				var cookieVal = readCookie(cookies[i].substring(APP.regKeyLength+1));
				data = $.grep(data, function (element, index) {
					return element[cookies[i].substring(APP.regKeyLength+1)] == cookieVal;
				});		
			});      
//			return data;
	}	
	
	
	APP.jsonScopeData = data
	
	if (dispSearch == "true"){
		createCookie("_DisplaySearch","true",7);
	}
	return data;
}

function clearUI(){
	$("#facets").children().remove();
}

function resetFilters(){
	
	dispSearch = readCookie("_DisplaySearch");
	eraseCookies();
	if (dispSearch == "true"){
			createCookie("_DisplaySearch","true",7);
		}
	
	search = "null";
	
	APP.personRestURL = "./restServices.xsp/asJSON";
	$.getJSON( APP.personRestURL, function( data ) 
		{
			APP.jsonData = data;
			data = collectData();
			writeFacets(data);
			writeCookiesValues("cookies");
			writeQuery(true);	
			writeResultList(data);	
		});
	
	
//	data = collectData();
//	writeFacets(data);
//	writeCookiesValues("cookies");
//	writeQuery(true);	
//	writeResultList(data);	
}

function isNewFilter(filter){
	var filter = readCookie(filter);
	if (filter == null){
		return true;
	}
	else{
		return false;
	}	
}
function isNewFilterValue(filter,value){
	var filterValues = readCookie(filter);
	var filters = filterValues.split(",");	
	if (filters.indexOf(value) >= 0) {
       //value exists already, perhaps double click
    } 
    else {
        filters.push(value);
		createCookie(filter, filters.join(), 7);
    }	
}

function sortResults(facet) {
	 var id = $('#' + facet).attr('id');
	 var asc = (!$('#' + facet).attr('asc')); // switch the order, true if not set
	 $('#querysort .btn').each(function() {
         $('#' + facet).removeAttr('asc');
     });
     if (asc==true){
    	 $('#' + facet).attr('asc', 'asc');
     }
     data = APP.jsonScopeData;
     data = data.sort(function(a, b) {
         if (asc) return (a[facet] > b[facet]);
         else return (b[facet] > a[facet]);

    });
    
    writeResultList(data);	
}



