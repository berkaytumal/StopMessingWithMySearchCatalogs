Scrollbar.use(OverscrollPlugin);

var ScrollbarOptions = {
    damping: 0.05,
    thumbMinSize: 1,
    renderByPixel: false,
    alwaysShowTracks: false,
    continuousScrolling: false,
    plugins: {
        overscroll: {
            effect: "bounce",
            damping: 0.15,
            maxOverscroll: 300,
        },
    },
};


function Inithand() {


    $(".drag-item").on("pointerdown", function (e) {
        this.mose = e.clientY;
        this.lastmose = e.clientY;
        this.mosedown = true;
        $(this).css("--translatey", 0);
    });
    $(".drag-item").on("pointerup", function (e) {
        if (!this.mosedown) return
        this.mosedown = false;
        //console.log(this.lastmose, this.mose);
        var other
        if (Math.abs(this.lastmose - this.mose) < 10) {

        } else if ((this.lastmose - this.mose) > 0) {
            $(this).css("transform", "translateY(48px)")
            other = $(this).next()
            other.css("transform", "translateY(-48px)")

        } else {
            $(this).css("transform", "translateY(-48px)")

            other = $(this).prev()
            other.css("transform", "translateY(48px)")
        }

        setTimeout(() => {
            if (this.lastmose == this.mose) {

            } else if ((this.lastmose - this.mose) > 0) {
                other.css("display", "none")
                setTimeout(() => {
                    other.css("transform", "")
                    setTimeout(() => {
                        other.css("display", "block")
                        $(this).css("transform", "")

                        $(this).insertAfter($(this).next());
                        setTimeout(() => {
                            var list = []
                            $(".drag-item").each(function () {
                                list.push($(this).attr("cat"))
                            })
                            chrome.storage.sync.set({ "cataloglist": { data: list.join(",") } });
                        }, 0);
                    }, 0);
                }, 0);

            } else {
                other.css("display", "none")
                setTimeout(() => {
                    other.css("transform", "")
                    setTimeout(() => {
                        other.css("display", "block")
                        $(this).css("transform", "")

                        $(this).insertBefore($(this).prev());
                        setTimeout(() => {
                            var list = []
                            $(".drag-item").each(function () {
                                list.push($(this).attr("cat"))
                            })
                            chrome.storage.sync.set({ "cataloglist": { data: list.join(",") } });
                        }, 0);
                    }, 0);
                }, 0);

            }

        }, 500);

    });
    $(".drag-item").on("pointermove", function (e) {
        if (this.mosedown) {
            this.lastmose = e.clientY;
            if (Math.abs(e.clientY - this.mose) < 5) {
                $(this).removeClass("switchingfrom");
                $(this).next().removeClass("switchingto");
                $(this).prev().removeClass("switchingto");

                $(this).css(
                    "--translatey",
                    (e.clientY - this.mose) *
                    Math.cos((Math.abs(e.clientY - this.mose) / 100) * Math.PI * 2)
                );
            } else {
                $(this).addClass("switchingfrom");
                if (e.clientY - this.mose > 0) $(this).next().addClass("switchingto");
                else $(this).prev().addClass("switchingto");
            }
        }
    });
    var scrollbar = Scrollbar.init(
        document.querySelector("#draglist"),
        ScrollbarOptions
    );
}
var windowon = true
$(window).on("pointerup", function () {
    if (!windowon) return
    $(".drag-item").removeClass("switchingto");
    $(".drag-item").each(function () {
        windowon = false
        if (this.mosedown) $(this).trigger("pointerup")
        windowon = true
        this.mosedown = false;

    });
    setTimeout(() => {
        $(".drag-item").css("transform", "")


    }, 500);
});
const defaultorder = "images,videos,maps,news,shopping,books,flights,finance"
chrome.storage.sync.get('cataloglist', function (data) {
    try {
        LoadList(data.cataloglist.data.split(","))

    } catch (error) {
        chrome.storage.sync.set({ "cataloglist": { data: defaultorder } });
        LoadList(defaultorder.split(","))
    }

});
function LoadList(list) {
    $("#draglist").html("")

    list.forEach(element => {
        var el
        switch (element) {

            case "images":
                el = `<div class="drag-item" cat="images" style="--icon:url(icons/images.png);">Images<div class="icon"></div>`
                break;
            case "videos":
                el = `<div class="drag-item" cat="videos" style="--icon:url(icons/videos.png);">Videos<div class="icon"></div>`
                break;
            case "maps":
                el = `<div class="drag-item" cat="maps" style="--icon:url(icons/maps.png);">Maps<div class="icon"></div>`
                break;
            case "news":
                el = `<div class="drag-item" cat="news" style="--icon:url(icons/news.png);">News<div class="icon"></div>`
                break;
            case "shopping":
                el = `<div class="drag-item" cat="shopping" style="--icon:url(icons/shopping.png);">Shopping<div class="icon"></div>`
                break;
            case "books":
                el = `<div class="drag-item" cat="books" style="--icon:url(icons/books.png);">Books<div class="icon"></div>`
                break;
            case "flights":
                el = `<div class="drag-item" cat="flights" style="--icon:url(icons/plane.png);">Flights<div class="icon"></div>`
                break;
            case "finance":
                el = `<div class="drag-item" cat="finance" style="--icon:url(icons/finance.png);">Finance<div class="icon"></div>`
                break;


            default:
                break;
        }
        $("#draglist").append(el)
    });
    Inithand()
}
$("#resetbtn").click(function () {
    $(this).addClass("anim")
    setTimeout(() => {
        $(this).removeClass("anim")

    }, 500);
    $("#draglist").css("pointer-events", "none")
    $("#popup").addClass("shown")
})
var buttons = $("#popup").children("button")
buttons.eq(0).click(function () {
    $("#draglist").css("pointer-events", "")
    $("#popup").removeClass("shown")
})
buttons.eq(1).click(function () {
    $("#draglist").css("pointer-events", "")
    $("#popup").removeClass("shown")
    setTimeout(() => {
        chrome.storage.sync.clear();
        $("#draglist").addClass("hidden")
        setTimeout(() => {
            LoadList(defaultorder.split(","))

            $("#draglist").removeClass("hidden")
        }, 500);
    }, 100);
})