//saveState, set to yes means store data in localStorage object
var saveState = true;
var yScroll = 360;
// DataTables init
$(document).ready( function() {	
	//initPersons();
	//initPersonExternal();
	//initPersonExternalMark();
	//initPersonBtn();
	initPersonColVis();
	/*
	table.on("click", "tr", function() {
		var data = table.row(this).data();
		initTypes(data.id);
	});
	*/

});

function initPersons(){
	$('#persons tfoot th').each( function () {
        var title = $(this).text();
        $(this).html( '<input type="text" placeholder="Search '+title+'" />' );
    } );	
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
                
                $( 'input', this.footer() ).on( 'keyup change', function () {
                    if ( column.search() !== this.value ) {
                    	column
                            .search( this.value )
                            .draw();
                    }
                } );           
            } );
			
		}
	});
}

function initPersonsPlainTable() {
	
	
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

function initPersonsSelectInput(){
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

function initPersonExternal(){
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
		,{
			data : "job"
		}
		],
		initComplete: function(){
			var db = $("#persons").DataTable();
			$('.filter').on('keyup change', function () {
		        //clear global search values
		        db.search('');
		        db.column($(this).data('columnIndex')).search(this.value).draw();
		    });
		    
		    $( ".dataTables_filter input" ).on( 'keyup change',function() {
			   //clear column search values
		        db.columns().search('');
		       //clear input values
		       $('.filter').val('');
			});			    
		}
	});
}
/*
$(function() {
	var db = $("#persons").DataTable();
	db.destroy();
	localStorage.clear();
	// Map inputs with columns (nth-child(X))
	  var inputMapper = {
	    "firstname": 1,
	    "lastname": 2,
	    "company": 3,
	    "job": 4
	  };

	  // Initialize DataTables
	  var db = $("#persons").DataTable({
		  dom: 'Bfrtip',
	        buttons: [
	            'copy',
	            'csv',
	            'excel',
	            {
	                extend: 'pdfHtml5',
	                orientation: 'landscape',
	                pageSize: 'LEGAL',
	                title: 'Person Details'
	            },
	            'print'
	        ],
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
			,{
				data : "job"
			}
			],  
			
		  
	    // Set elements per page
	    pageLength: 10,
	    // Disable entry selection
	    bLengthChange: false,
	    // Act on table rendering
	    drawCallback: function() {
	      // Iterate over all inputs (by mapper names)
				$.each(inputMapper, function(colName, index) {
			        // Determine the entered keyword
					
			        var val = $("input[name='" + colName + "']").val();
			        // Determine the column related to the input
			        var $col = $(".datatables-table tbody tr > td:nth-child(" + index + ")");
			        // Remove marks in related column
			        $col.unmark({
			          "element": "span",
			          "className": "markSearched"
			        });
			        // Mark in related column
			        $col.mark(val, {
			          // Define mark.js options (see https://markjs.io/)
			          "element": "span",
			          "className": "markSearched"
			        });
			      })
	    }
	  });

	  // Trigger table redraw on search keyword change
	  $("input").on("keyup change", function() {
		  var db = $("#persons").DataTable();
		  var $this = $(this);
		  var val = $this.val();
		  var key = $this.attr("name");

	    // Search inside DataTable column
	    // subtract -1 because :nth-child starts with 1,
	    // DataTables with 0
	    db.columns(inputMapper[key] - 1).search(val).draw();
	  });
	
});
*/
function initPersonBtn(){
	var db = $("#persons").DataTable();
	db.destroy();
	localStorage.clear();
	// Map inputs with columns (nth-child(X))
	  var inputMapper = {
	    "firstname": 1,
	    "lastname": 2,
	    "company": 3,
	    "job": 4
	  };

	  // Initialize DataTables
	  var db = $("#persons").DataTable({
		  dom: 'Bfrtip',
	        buttons: [
	            'copy',
	            'csv',
	            'excel',
	            {
	                extend: 'pdfHtml5',
	                orientation: 'landscape',
	                pageSize: 'LEGAL',
	                title: 'Person Details'
	            },
	            'print'
	        ],
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
			,{
				data : "job"
			}
			],  
			
		  
	    // Set elements per page
	    pageLength: 10,
	    // Disable entry selection
	    bLengthChange: false,
	    // Act on table rendering
	    drawCallback: function() {
	      // Iterate over all inputs (by mapper names)
				$.each(inputMapper, function(colName, index) {
			        // Determine the entered keyword
					
			        var val = $("input[name='" + colName + "']").val();
			        // Determine the column related to the input
			        var $col = $(".datatables-table tbody tr > td:nth-child(" + index + ")");
			        // Remove marks in related column
			        $col.unmark({
			          "element": "span",
			          "className": "markSearched"
			        });
			        // Mark in related column
			        $col.mark(val, {
			          // Define mark.js options (see https://markjs.io/)
			          "element": "span",
			          "className": "markSearched"
			        });
			      })
	    }
	  });

	  // Trigger table redraw on search keyword change
	  $("input").on("keyup change", function() {
		  var db = $("#persons").DataTable();
		  var $this = $(this);
		  var val = $this.val();
		  var key = $this.attr("name");

	    // Search inside DataTable column
	    // subtract -1 because :nth-child starts with 1,
	    // DataTables with 0
	    db.columns(inputMapper[key] - 1).search(val).draw();
	  });
}

function initPersonColVis(){
	var db = $("#persons").DataTable();
	db.destroy();
	localStorage.clear();
	// Map inputs with columns (nth-child(X))
	  var inputMapper = {
	    "firstname": 1,
	    "lastname": 2,
	    "company": 3,
	    "job": 4
	  };

	  // Initialize DataTables
	  var db = $("#persons").DataTable({
		  dom: 'Bfrtip',
	        buttons: [
	            'copy',
	            'csv',
	            'excel',
	            {
	                extend: 'pdfHtml5',
	                orientation: 'landscape',
	                pageSize: 'LEGAL',
	                title: 'Person Details'
	            },
	            {
	                extend: 'print',
	                exportOptions: {
	                    columns: ':visible'
	                }
	            },
	            'colvis'
	        ],
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
			,{
				data : "job"
			}
			],  
			
		  
	    // Set elements per page
	    pageLength: 10,
	    // Disable entry selection
	    bLengthChange: false,
	    // Act on table rendering
	    drawCallback: function() {
	      // Iterate over all inputs (by mapper names)
				$.each(inputMapper, function(colName, index) {
			        // Determine the entered keyword
					
			        var val = $("input[name='" + colName + "']").val();
			        // Determine the column related to the input
			        var $col = $(".datatables-table tbody tr > td:nth-child(" + index + ")");
			        // Remove marks in related column
			        $col.unmark({
			          "element": "span",
			          "className": "markSearched"
			        });
			        // Mark in related column
			        $col.mark(val, {
			          // Define mark.js options (see https://markjs.io/)
			          "element": "span",
			          "className": "markSearched"
			        });
			      })
	    }
	  });

	  // Trigger table redraw on search keyword change
	  $("input").on("keyup change", function() {
		  var db = $("#persons").DataTable();
		  var $this = $(this);
		  var val = $this.val();
		  var key = $this.attr("name");

	    // Search inside DataTable column
	    // subtract -1 because :nth-child starts with 1,
	    // DataTables with 0
	    db.columns(inputMapper[key] - 1).search(val).draw();
	  });
	  
	  $('a.toggle-vis').on( 'click', function (e) {
		  var db = $("#persons").DataTable();
		  e.preventDefault();
	 
		  // Get the column API object
		  var column = db.column( $(this).attr('data-column') );
	 
		  // Toggle the visibility
		  column.visible( ! column.visible() );
	  } );
}



