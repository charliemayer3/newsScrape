// Grab the articles as a json
$.getJSON("/articles", function(data) {
  // For each one
  // location.href = "/"
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append("<div>" + "<p>" + "<strong>Title: </strong>" + data[i].title + "<br />" + "<strong>Summary: </strong>" + data[i].summary + "<br />" + "<strong>Link: </strong>" + "<a href='" + data[i].link + "'>" + "ESPN" + "</a>" + "</p>" + "<button class='saveArticle'" + "data-id='" + data[i]._id + "'>" + "Save Article</button>" + "</div>" + "<br>");
  }
});


$(document).on("click", "#run-scrape", function() {
  // $.getJSON("/scrape", function(data) {
    location.href = "/scrape"
  // })
  // .then(function(data) {
});

$(document).on("click", "#show-articles", function() {
  $.getJSON("/articles", function(data) {
    // For each one
    location.href = "/"
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      $("#articles").append("<p data-id='" + data[i]._id + "'>" + "<strong>Title: </strong>" + data[i].title + "<br />" + "<strong>Summary: </strong>" + data[i].summary + "<br />" + "<strong>Link: </strong>" + "<a href='" + data[i].link + "'>" + "ESPN" + "</a>" + "</p>");
    }
  });
});

$(document).on("click", ".saveArticle", function() {
  var thisId = $(this).attr("data-id");
  $.ajax({
    method: "POST",
    url: "/savedArticles/" + thisId,
    data: {
        saved: "yes"
    }
  })
    // With that done
    // .then(function(data) {
    //   // Log the response
    //   console.log(data);
    //   // Empty the notes section
    //   // $("#notes").empty();
    // });
})


// Whenever someone clicks a p tag
// $(document).on("click", "p", function() {
//   // Empty the notes from the note section
//   $("#notes").empty();
//   // Save the id from the p tag
//   var thisId = $(this).attr("data-id");

//   // Now make an ajax call for the Article
//   $.ajax({
//     method: "GET",
//     url: "/articles/" + thisId
//   })
//     // With that done, add the note information to the page
//     .then(function(data) {
//       console.log(data.note);
//       // The title of the article
//       $("#notes").append("<h2>" + data.title + "</h2>");

//       var noteSpace = $("<div>")
//       $("#notes").append(noteSpace);
//       // An input to enter a new title
//       $("#notes").append("<input id='titleinput' name='title' >");
//       // A textarea to add a new note body
//       $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
//       // A button to submit a new note, with the id of the article saved to it
//       $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

//       // If there's a note in the article
//       if (data.note) {
//         for (var n = 0; n < data.note.length; n++) {
//           console.log(data.note[n])
//           var savedNote = $("<div>")
//           // Place the title of the note in the title input
//           savedNote.append($("<h4>" + data.note[n].title + "</h4>"));
//           // Place the body of the note in the body textarea
//           savedNote.append($("<p>" + data.note[n].body + "</p>"));
//           noteSpace.append(savedNote)
//         }
//       }
//     });
// });

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
