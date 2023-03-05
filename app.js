$(document).ready(function() {
  $.get("/ajaxmessages", function(messages) {
    var table = $("table");
    messages.forEach(function(message) {
      var row = $("<tr>");
      row.append($("<td>").text(message.name));
      row.append($("<td>").text(message.country));
      row.append($("<td>").text(message.message));
      row.append($("<td>").text(message.id));
      row.append($("<td>").text(message.timestamp));
      table.append(row);
    });
  });

  $("form").submit(function(event) {
    event.preventDefault();

    var timestamp = new Date().getTime();

    $("#submission_id").val("submission_" + timestamp);

    $.ajax({
      url: $(this).attr("action"),
      method: "POST",
      data: $(this).serialize(),
      success: function(response) {
        console.log("Data saved successfully:", response);
        location.reload();
        var table = $("table");
        var row = $("<tr>");
        row.append($("<td>").text(response.name));
        row.append($("<td>").text(response.country));
        row.append($("<td>").text(response.message));
        row.append($("<td>").text(response.id));
        row.append($("<td>").text(response.timestamp));
        table.append(row);
      },
      error: function(error) {
        console.error("Error saving data:", error);
      }
    });
  });
});
