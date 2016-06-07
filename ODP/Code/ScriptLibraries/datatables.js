//saveState, set to yes means store data in localStorage object
var saveState = true;
var yScroll = 360;
// DataTables init
$(document).ready( function() {	
	initPersons();
	/*
	table.on("click", "tr", function() {
		var data = table.row(this).data();
		initTypes(data.id);
	});
	*/

});

function initPersons2() {
	var db = $("#persons").DataTable();
	db.destroy();
	localStorage.clear();
	var table = $("#persons").DataTable( {
		stateSave : saveState,
		fixedHeader: true,
		"language" : {
			"lengthMenu" : "Entries per page _MENU_",
			// "info" : "Page _PAGE_ of _PAGES_",
			"infoEmpty" : "No entries found",
			"infoFiltered" : ""
		},
		scrollY : yScroll,
		"ajax" : "api.xsp/Persons" ,
		"columns" : [ 
		{
			data : "firstname",
			"defaultContent": "<i>Not set</i>"
		},{
			data : "lastname",
			"defaultContent": "<i>Not set</i>"
		},{
			data : "company"
		}				
		]
	});
}

function initPersons(){
	var db = $("#persons").DataTable();
	db.destroy();
	localStorage.clear();
	var table = $("#persons").DataTable( {
		stateSave : saveState,
		fixedHeader: true,
		"language" : {
			"lengthMenu" : "Entries per page _MENU_",
			// "info" : "Page _PAGE_ of _PAGES_",
			"infoEmpty" : "No entries found",
			"infoFiltered" : ""
		},
		scrollY : yScroll,
		"ajax" : "api.xsp/Persons" ,
		"columns" : [ 
		{
			data : "firstname",
			"defaultContent": "<i>Not set</i>"
		},{
			data : "lastname",
			"defaultContent": "<i>Not set</i>"
		},{
			data : "company"
		}				
		],
		initComplete: function(){
			this.api().columns().every( function () {
                var column = this;
                var select = $('<select><option value=""></option></select>')
                    .appendTo( $(column.footer()).empty() )
                    .on( 'change', function () {
                        var val = $.fn.dataTable.util.escapeRegex(
                            $(this).val()
                        );
 
                        column
                            .search( val ? '^'+val+'$' : '', true, false )
                            .draw();
                    } );
 
                column.data().unique().sort().each( function ( d, j ) {
                    select.append( '<option value="'+d+'">'+d+'</option>' )
                } );
            } );
		}
	});
	
}

