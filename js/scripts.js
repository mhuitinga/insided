$( document ).ready(function() {
	// Listeners:
	
	$('#users input[type="checkbox"]').click(function() {
	 
		// toggles the user row color when selecting a user row
	   if ($(this).is(':checked')) {
	       $(this).parents('.user').addClass( "active" );
	   } else {
	       $(this).parents('.user').removeClass( "active" );
	   }
	   
	   // displays actions when at least one user is selected
	  if($('#users input[type="checkbox"]:checked').val()=='on') {
		  $('#user_change').addClass( "show" );
	  } else {
		  $('#user_change').removeClass( "show" );
	  }
	  
	});
	
	// (de)select all userrows
	
	$('#select_all').click(function() {
		if ($(this).is(':checked')) {
			$('.user').addClass( "active" );
			$('#users input[type="checkbox"]').prop('checked', true);
			$('#user_change').addClass( "show" );
		} else {
			$('.user').removeClass( "active" );
			$('#users input[type="checkbox"]').prop('checked', false);
			$('#user_change').removeClass( "show" );
		}
	});
	
	// adds a new row
	$('#add_row').click(function() {
		var latest = $( "#rows > div:last" ).attr('id'); // retrieve the id of the last made element
		//alert(latest);
		if (latest == undefined) { latest = 'row_0'; }
		arr = latest.split('_');
		if(arr[1] == '') { 
			var newNumber = 1 
		} else {
			newNumber = parseInt(arr[1]) + 1;
		}
		var rowId = 'row_' + newNumber;
		
		$( "#rows" ).append( "<div id='" + rowId + "' name='" + rowId + "' class='selectrow'><select name='searchtype_" + newNumber + "' id='searchtype_" + newNumber + "' class='searchtype'><option value=''></option><option value='comments'>Comments</option><option value='regdate'>Registration date</option><option value='usergroup'>Usergroup</option></select><div id='submenus_" + newNumber + "' class='submenu'></div><br class='clear'></div>\n");
		var selectricTarget = "#searchtype_" + newNumber;
		console.log(selectricTarget)
		$("#searchtype_" + newNumber).selectric();
	});
	
	// delete all filters & tags
	
	$('#clearall').click(function() {
		$("#rows,#tags").empty();
		$('#clearall').addClass ("hide");
	});
		
	// display filtervalues
	
	$(document.body).on("change", ".searchtype", function(){
		$('#clearall').removeClass ("hide");
		if($(this).attr('id') == undefined) {
			//console.log($(this).attr('id'));
	   	} else {
	   		//console.log($(this).attr('id'));
		   	var varId =  $(this).attr('id');
		   	arr = varId.split('_')
			var curNumber = parseInt(arr[1]);
			//alert (curNumber);
			switch ($(this).val()) {
				case 'comments': createCommentsSubmenu(curNumber);
				break;
				case 'regdate': createRegdateSubmenu(curNumber);
				break;
				case 'usergroup': createUsergroupSubmenu(curNumber);
				break;
				default:emptySubmenu(curNumber);
			}
	   	}
	});
	$('select').selectric();
	
	// multiselect dropdown functions
	$(document.body).on("click", ".description, .button", function(){
		var curId = $(this).parent().attr('id');
		var dropdown = "#" + curId + " .dropdown";
		if ($(dropdown).css('display') == 'none') {
			$('#'+curId).addClass('active');
			$(dropdown).css('display', 'block');
		} else {
			$(dropdown).css('display', 'none');
			$('#'+curId).removeClass('active');
		}
	});
	
	$(document.body).on("click", ".check", function(){
		var curId = $(this).parent().attr('id');
		$('#' + curId + ' input[type="checkbox"]').prop('checked', true);
	});
	
	$(document.body).on("click", ".uncheck", function(){
		var curId = $(this).parent().attr('id');
		$('#' + curId + ' input[type="checkbox"]').prop('checked', false);
	});	
	
	// calender dropdown
	$(document).on("change", ".datepicker", function () {
       var rawDate = $(this).val();
       var curId = $(this).parent().attr('id');
       $('#' + curId + ' .description').html(transformDate(rawDate));
       $('#' + curId + ' .dropdown').css('display', 'none');
       $('#' + curId).removeClass('active');
    })	    
});


// Functions:
	
// comments submenu
function createCommentsSubmenu(id) {
	emptySubmenu(id);
	var content = "<select name='comments_range_" + id + "' id='comments_range_" + id + "'><option value=''>Is greater than</option><option value=''>Is smaller than</option></select><input type='button' class='delete hide' value='&#x2715;' onClick='deleteRow(" + id + ")'>";
	$("#submenus_" + id ).append(content);	
	$("#comments_range_" + id).selectric();
	var tag = "<div id='tag_" + id + "' class='tagcontainer'><div id='tag_" + id + "' class='tag'><span onClick='deleteRow(" + id + ")'>&#x2715;</span> Comments</div></div>";
	$("#tags").append(tag);
}


// registration date submenu

function createRegdateSubmenu(id) {
	var today = curDate();
	emptySubmenu(id);		
	var content = "<select name='regdate_range_" + id + "' id='regdate_range_" + id + "'><option value=''>Before</option><option value=''>After</option><option value=''>On</option></select>\n<div class='dateselect' id='dateselect_" + id + "'>\n<div class='description'>" + today +"</div><div class='button'>▾</div>\n<div class='dropdown datepicker' id='dateselectdropdown_" + id + "'>\n</div>\n</div>\n<input type='button' class='delete' value='&#x2715;' onClick='deleteRow(" + id + ")'>";
	$("#submenus_" + id ).append(content);
	// Refresh Selectric
	$("#regdate_range_" + id).selectric();
	// add datepicker
	$("#dateselectdropdown_" + id).datepicker({
        showOtherMonths: true,
        selectOtherMonths: true
    });
	var tag = "<div id='tag_" + id + "' class='tagcontainer'><div class='tag'><span onClick='deleteRow(" + id + ")'>&#x2715;</span> Registration date</div></div>";
	$("#tags").append(tag);
}

// usergroup submenu

function createUsergroupSubmenu(id) {
	emptySubmenu(id);		
	var content = "<div class='multiselect' id='multiselect_" + id + "'><div class='description'>Select one or more options</div><div class='button'>▾</div>\n<div class='dropdown' id='multidropdown_" + id + "'>\n<span class='link check'>Check all</span> <span class='link uncheck'>Uncheck all</span>\n<span class='subitem'>Group 1</span>\n<label><input type='checkbox' name='gr1_opt1' id='gr1_opt1'>Option #1 for group 1</label>\n<label><input type='checkbox' name='gr1_opt2' id='gr1_opt2'>Option #2 for group 1</label>\n<label><input type='checkbox' name='gr1_opt3' id='gr1_opt3'>Option #3 for group 1</label>\n<span class='subitem'>Group 2</span>\n<label><input type='checkbox' name='gr2_opt1' id='gr2_opt1'>Option #1 for group 2</label>\n<label><input type='checkbox' name='gr2_opt2' id='gr2_opt2'>Option #2 for group 2</label>\n<label><input type='checkbox' name='gr2_opt3' id='gr2_opt3'>Option #3 for group 2</label>\n<span class='subitem'>Group 3</span>\n<label><input type='checkbox' name='gr3_opt1' id='gr3_opt1'>Option #1 for group 3</label>\n<label><input type='checkbox' name='gr3_opt2' id='gr3_opt2'>Option #2 for group 3</label>\n<label><input type='checkbox' name='gr3_opt3' id='gr3_opt3'>Option #3 for group 3</label>\n</div>\n</div>\n<input type='button' class='delete' value='&#x2715;' onClick='deleteRow(" + id + ")'>";
	$("#submenus_" + id ).append(content);
	var tag = "<div id='tag_" + id + "' class='tagcontainer'><div class='tag'><span onClick='deleteRow(" + id + ")'>&#x2715;</span> Usergroup</div></div>";
	$("#tags").append(tag);
}

// none selected
function emptySubmenu(id){
	$("#submenus_" + id).empty();
	$("#tag_" + id).remove();
}

// delete row and corresponding tag

function deleteRow(id) {
	$( "#row_" + id + ", #tag_" + id ).remove();
	if($("#tags").is(":empty")) {
		$('#clearall').addClass ("hide");
	}	
}

// today's date 

function curDate() {
	var d = new Date();
	//var month = d.getMonth()+1;
	var day = d.getDate();
	var monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun",
	    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
	var month = monthNames[d.getMonth()];
	var fullYear = d.getFullYear();
	var year = fullYear.toString().substring(2, 4);
	return day + "-" + month + "-" + year;
 }
 
//transform the US datepicker date to our date

function transformDate(rawDate) {
	var splitted = rawDate.split("/"); // mm/dd/yyyy
	var monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun",
	    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
	var day = parseInt(splitted[1]);
	var month = monthNames[(parseInt(splitted[0])-1)];
	var year = splitted[2].toString().substring(2, 4);
	return day + "-" + month + "-" + year;
}