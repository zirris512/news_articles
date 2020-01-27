$(".commentBtn").on("click", event => {
    event.preventDefault();

    $("#comment-section").empty();
    $("#input-section").empty();

    const thisID = $(this).attr("data-id");

    $.ajax({
        method: "GET",
        url: `/articles/${thisID}`
    }).then(data => {

        $("#input-section").append("<textarea name=comment id=comment></textarea>");
        $("#input-section").append("<button data-id='" + data.id + "' type='submit' id='comment-submit'>Save Comment</button>");
    
        if(data.comments) {
            data.comments.forEach(element => {
                $("#comment-section").append("<div class='comment-box'>")
                .append("<p>" + element.body + "</p></div>");    
            });
        }
    });
});

$(document).on("click", "#comment-submit", event => {
    event.preventDefault();

    const thisID = $(this).attr("data-id");

    $.ajax({
        method: "POST",
        url: `/articles/${thisID}`,
        data: { body: $("#comment").val().trim() }
    }).then(data => {
        $("#comment-section").append("<div class='comment-box'>")
        .append("<p>" + data.comments.body + "</p></div>");
        
        console.log(data);
        $("#comment").val("");
    });
});