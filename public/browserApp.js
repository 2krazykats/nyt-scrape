// Get the articles and write it to the webpage
$(document).ready(function() {
	var articlesList = $(".articles");

	$(document).on("click", "#scrape", handleArticleScrape);
	$(document).on("click", "#show-articles", initPage);

  // Once the page is ready, run the initPage function to kick things off
  initPage();

  function initPage() {
  	articlesList.empty();
  	$.get("/articles/").then(function(data) {
  		// console.log(`In initPage ${data}`);
  		if (data && data.length) {
  			renderArticles(data);
  		} 

  	});
  }	

  function renderArticles(articles) {
  		// console.log(`In renderArticles ${articles}`);
  	var articleListings = [];

	$(".articles").append("<div class='panel panel-default sub-articles'>");
  	
  	for (var i = 0; i < articles.length; i++) {
  		articleListings.push(articles[i]);

  		// Write the data to the page
	  	$(".sub-articles").append("<div class='panel-body' data-id='" 
	  		+ articles[i]._id + "'>" 
	  		+ "<strong>" + articles[i].headline + "</strong><br />"  
	  		+ articles[i].summary + "<br />" 
	  		+ "<a href='" + articles[i].url + "'>" + articles[i].url + "</a></div>");
	 }
	  	$(".modal-body").attr("display:hidden");
  }


  function handleArticleScrape() {
  	articlesList.empty();
  	let message = "Articles have been scraped. Click Show Articles to see them.";

  	$.get("/scrape").then(function(data) {
  		// initPage();
	  	if (data && data.length) {
	      	$(".articles-list").append("<h3 class='modal-body'>" + message + "<h3>");
	      }
  	});
  }



	// Whenever someone clicks 
	$(document).on("click", ".panel-body", function() {
	  // Empty the notes from the note section
	  $(".notes").empty();
	  // Save the id from the panel-body tag
	  var thisId = $(this).attr("data-id");

	  // Now make an ajax call for the Article
	  $.ajax({
	    method: "GET",
	    url: "/articles/" + thisId
	  })
	    // With that done, add the note information to the page
	    .done(function(data) {
	      console.log(data);
	      // The headline of the article
	      $(".notes").append("<h3>" + data.headline + "</h3>");
	      // text area to add note
	      $(".notes").append("<p><textarea class='form-control' id='bodyinput' name='body'></textarea></p>");
	      // A button to submit a new note, with the id of the article saved to it
	      $(".notes").append("<p><button type='button' class='btn btn-primary' data-id='" + data._id + "' id='savenote'>Save Note</button></p>");

	      // If there's a note in the article
	      if (data.note) {
	        $("#bodyinput").val(data.note.body);
	      }
	    });
	});


	// Saving the note
	$(document).on("click", "#savenote", function() {
		var thisId = $(this).attr("data-id");

		// POST request to change the note
		$.ajax({
			method: "POST",
			url: "/articles/" + thisId,
			data: {
				body: $("#bodyinput").val()
			}
		}).done(function(data) {
			// console.log(data);
			// $(".notes").empty();
		});
		$("#bodyinput").val("");
	})

}); // document ready
