$(document).ready(async () => {
    movie = JSON.parse(movie);

    if (user) user = JSON.parse(user);
    $.ajax({
        url: "/u/",
        type: "POST",
        data: {
            query: query
        },
        success: (torrent) => {
            $("#btn-download").on("click", () => {
                window.open(torrent, "_blank");
            })
        },
        error: (request, error) => {
            console.log(error);
        }
    })

    $("#btn-back").on("click", () => {
        location.href = "/movies";
    })

    $("#btn-submit").on("click", async (event) => {
        let review = {
            author: user._id,
            body: $("#body").val(),
            rating: $("fieldset > input[type=radio].active").val()
        }

        $.ajax({
            url: `/m/${movie.imdbID}/reviews`,
            type: "POST",
            data: {
                review: review
            },
            dataType: "TEXT",
            success: (response) => {
                let reviewHtml = $.parseHTML(response);
                $("#comments").prepend(reviewHtml);
                $("#body").val("");
            },
            error: (request, error) => {
                console.log(error);
            }
        })
    });

    $("fieldset > input[type=radio]").on("click", (e) => {
        if ($("fieldset > input[type=radio].active"))
            $("fieldset > input[type=radio].active").removeAttr("class");

        $(e.target).addClass("active");
    })
})

$(document).on("click", ".btn-delete", (event) => {
    event.preventDefault();

    $.ajax({
        url: `/m/${movie.imdbID}/reviews/${event.target.id}/`,
        type: "DELETE",
        data: {
            _id: event.target.id
        },
        success: (res) => {
            $(`#${res._id}`).parentsUntil("#comments").remove();
        },
        error: (request, error) => {
            console.log(error);
        }
    })
})