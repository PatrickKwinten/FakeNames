//CSJS functions - Patrick
function createCookie(name, value, days) 
{
	//alert("sub: createCookie " + name + ", val =" + value)
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
	//alert("sub: readCookie "  + name)
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
	//alert("sub: getCookiesNames")
    var names = new Array();
    if (document.cookie && document.cookie != '') {
        var split = document.cookie.split(';');   
        for (var i = 0; i < split.length; i++) {
        	var name_value = split[i].split("=");
        	//Only use cookies set for this application (app.regkey)
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
        		if( facets.indexOf(name_value[0].substring(APP.regKeyLength)) > -1){
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
			//alert("APP.regKeyLength=" + APP.regKeyLength);
			//alert("cookies[i]=" + cookies[i]);
			createCookie(cookies[i].substring(APP.regKeyLength), "", -1);
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
	//alert("start sub: getFacets")
	var facetsParam = getUrlVars()[param];
	facetsParam = decodeURI(facetsParam.replace(/%2C/g, ","));
	var facets = facetsParam.replace("[","").replace("]","").split(splitter);
	return facets;
}


function collectFacetData(data){
	//alert("start sub: collectFacetData")
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
	//alert("sub: writeFacet")
	var facet = "";
	facet = facet + "<div>";
	var badge = "<span style='background-color:#5195ce' class='badge badge-apple'>" + data.length + "</span>"
	facet = facet + "<H4>" + id + badge + "</H4>";
	
	//var d = document.createElement("div");
	//var h = document.createElement("H4");
	//d.appendChild(h);
	//var t = document.createTextNode(id);       // Create a text node
	//h.appendChild(t); 
	

	//h.append(badge);
	facetListID = "#facets";
	$(facetListID).append(facet);
	//$(facetListID).append("<ul style='list-style-type: none;' id=\"facetList-" + id + "\">");
	
	$.each(data, function (i) 
		{
		var sum = new Array();	
		sum = $.grep(APP.jsonScopeData, function (element, index) {
			return element[id] == data[i];
		});			
			//$('#facets').append("<li class='btn btn-default'><i class='glyphicon glyphicon-plus' onClick='applyFilter(\"" + id + "\",\"" + data[i] + "\");'>" + data[i] + "</i></li>");
		$(facetListID).append("<span class='btn btn-default' title='apply this filter' onClick='applyFilter(\"" + id + "\",\"" + data[i] + "\");'><span class='glyphicon glyphicon-plus' ></span>" + data[i] + "&nbsp;<span class='badge badge-apple' style='background-color:#5195ce'>" + sum.length + "</span></span>")
		});
	//$('#facet').append("</ul>");
	$(facetListID).append("</div>")
}

function writeAsCard(unid, lastname, firstname, pictureUrl, job)
{
	var card = "";
	card = card + "<div class='col-lg-3 col-sm-6 well' style='float:left; min-height:200px;margin:3px;'>";
	card = card + "<center>";
	card = card + "<span data-target='#myModal' data-toggle='modal' href='#aboutModal'><img height='140' width='140' class='img-circle' name='aboutme' src='https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRbezqZpEuwGSvitKy3wrwnth5kysKdRqBW54cAszm_wiutku3R'></span>";
	card = card + "<h3>" + firstname + " " + lastname + "</h3>";
	card = card + "<em>" + job + "</em>";
	card = card + "</center>";
	card = card + "</div>";
		
	return card;
}

function writeResultList(data)
{
	//alert("sub: writeresultlist")
	$("#listResult").children().remove();
	$('#listResult').append("<h4>Showing the total of " + data.length + " result(s)</h4>");
	//$('#listResult').append("");
	//$('#listResult').append("<ul id='listResultUL' style='list-style-type: none;'>");	
	$.each(data, function (i) {
	   	var unid = data[i]["@unid"];
		var lastname = data[i].name;
		var firstname = data[i].firstname;
		var pictureUrl = data[i].pictureURL;
		var job = data[i].job;
		var card = writeAsCard(unid, lastname, firstname, pictureUrl, job);
		//$('#listResultUL').append("<li>" + card + "</li>");
		$('#listResult').append(card);
	});		
	//$('#listResult').append("</div>");
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
	}); 
}

function applyFilter(filter,value){
	//alert("sub: apply filter:" + filter + ";" + value)
	var filter = filter;
	if (isNewFilter(filter) == true){
		createCookie(filter, value, 7); 
	}
	else{
		isNewFilterValue(filter,value);
	}
	//alert("sub: applyfilter - before cookies")
	var cookies = getCookiesNames();
	data = collectData();
	collectFacetData(data);
	//writeQuery(true);		
	//writeQuerySortOptions();
	writeResultList(data);	
}



function collectData(){
	var cookies = getCookiesNames();
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
				var cookieVal = readCookie(cookies[i].substring(APP.regKeyLength));
				//alert(cookieVal);
				data = $.grep(data, function (element, index) {
					return element[cookies[i].substring(APP.regKeyLength)] == cookieVal;
				});		
			});      
//			return data;
	}
	APP.jsonScopeData = data
	return data;
}


function unique(list) 
{
	//alert("start sub: unique")
    var result = [];
    $.each(list, function(i, e) 
    {
        if ($.inArray(e, result) == -1) result.push(e);
    });
    return result;
}

function naturalCompare(a, b) 
{
	//alert("start sub: naturalCompare")
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

function isNewFilter(filter){
	//alert("sub:isNewFilter " + filter)
	var filter = readCookie(filter);
	if (filter == null){
		return true;
	}
	else{
		return false;
	}	
}
function isNewFilterValue(filter,value){
	//alert("sub:isNewFilterValue " + filter)
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