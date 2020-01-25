$(".commentBtn").on("click", event => {
    event.preventDefault();

    $("#comment-section").empty();
    $("#input-section").empty();

    const thisID = $(this).attr("data-id");

    $.ajax({
        method: "GET",
        url: `/articles/${thisID}`
    }).then(data => {
        if(data.comments) {
            
        }
    })
})