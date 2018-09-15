// Qi Shu - Shopify Challenge 2019 Winter

var searchAPI = "https://api.github.com/search/repositories?q=";

// track the information of all favorite repos
var favArray = [];

$(document).ready(function() {

	// search caller
	$("#searchWrapper button").click(function(){
		search();
	});
	// search when hit enter key
	$("#searchWrapper input").keypress(function(e){
		var key = e.which;
		if(key == 13)  {
			search();
		}
	});

	// add to favortie repositories
	$("#searchTable").on("click", ".clickOn", function(){
		// get the row to be added
		var $row = $(this).closest("tr");
		// copy the row and paste to fav table
		var $newRow = $row.clone();
		// get the id of repo
		var id = parseInt($row.attr("data-id"));
		// push id to favorite list
		favArray.push(id);
		// turn off click for the row
		$row.find("td:last").text("").attr('class', 'clickOff');
		// add row to fav table
		$newRow.find("td:last").text("Remove");
		$("#favTable > tbody:last-child").append($newRow);
	});

	// remove from favorite repositories
	$("#favTable").on("click", ".clickOn", function(){
		// find the id
		var id = parseInt($(this).closest("tr").attr("data-id"));
		// remove the id from the fav array
		favArray.splice(favArray.indexOf(id), 1);
		// turn on click for the row
		reverseClass(id);
		// remove row from fav table
		$(this).closest("tr").remove();
	});


	// detect if input box is empty
	$("#searchDiv input").on("keyup", function() {
	    if ($(this).val().length === 0) {
	    	$("#searchTable").find("tr:gt(0)").remove(); // clear all table rows except headers
	    }

	});

});


function search(){
	var name = $("#searchDiv input").val();
	var searchTargetAPI  = searchAPI + name;
	// making AJAX call to API
	$.ajax({
		url: searchTargetAPI,
		dataType: "JSON",
		type: "GET",
		success: function(data) {
			// get the first ten elements
			var tenElements = data.items.slice(0,10);

			parseSearch(tenElements);
		} 
	})
}

// parseSearch get all relevant information
function parseSearch(dataArray){

	$("#searchTable").find("tr:gt(0)").remove(); // clear all table rows except headers
	for(var item of dataArray){
		var id = item.id;
		var name = item.full_name;
		var lang = item.language;
		var htmlURL = item.html_url;
		var tagURL = item.tags_url;
		// make changes to the table
		changeTable(id, name, lang, htmlURL,tagURL);
		
	}
}

function changeTable(id, name, lang, htmlURL, tagURL){
	// ajax call to get the tag
	$.ajax({
		url: tagURL,
		dataType: "JSON",
		type: "GET",
		success: function(data) {
			var tag = data.length == 0 ? '-' : data[0].name;;

			var firstStr = '<tr data-id=' + id + '><td><a target="_blank" href=' + htmlURL + '>' + name + 
						'</a></td><td>' + lang + 
						'</td><td>' + tag + 
						'</td>';

			var secStr = searchFav(id) && favArray.indexOf(id) == -1 ?
						'<td class="clickOn">Add</td></tr>' :
						'<td class="clickOff"></td></tr>' 
				

			$("#searchTable > tbody:last-child").append(firstStr + secStr);
		} 
	})
}

// check if a repo is in the favourtes
function searchFav(id){
	$('#favTable tr').each(function(){
        if(parseInt($(this).attr("data-id")) === id){
            return false;
        }
    });
   	return true;
}

// turn on click/add functionality for search results when repo removed from favorites
function reverseClass(id){
	$('#searchTable tr').each(function(){
        if(parseInt($(this).attr("data-id")) === id){
            $(this).find("td:last").text("Add").attr('class', 'clickOn');
        }
    }); 
}

// Qi Shu - Shopify Challenge 2019 Winter
