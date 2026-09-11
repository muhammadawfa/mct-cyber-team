/* =========================================================
   MUQODDASAH CYBER TEAM
   MAIN PAGE CONTROLLER
========================================================= */

const pages = document.querySelectorAll(".page");
const dots = document.querySelectorAll(".page-dots .dot");
const currentPage = document.getElementById("currentPage");

const historyWrapper =
    document.querySelector(".history-full-wrapper");


/* =========================================================
   MAIN PAGE STATE
========================================================= */

let currentIndex = 0;
let scrollLocked = false;

const LOCK_TIME = 750;


/* =========================================================
   UPDATE PAGE
========================================================= */

function updatePage(index) {

    if (index < 0) {
        index = 0;
    }

    if (index >= pages.length) {
        index = pages.length - 1;
    }


    pages.forEach((page, i) => {

        page.classList.remove("active");
        page.classList.remove("previous");

        if (i === index) {
            page.classList.add("active");
        }

        if (i < index) {
            page.classList.add("previous");
        }

    });


    dots.forEach((dot, i) => {

        dot.classList.toggle(
            "active",
            i === index
        );

    });


    if (currentPage) {

        currentPage.textContent =
            String(index + 1).padStart(2, "0");

    }


    currentIndex = index;

}


/* =========================================================
   SCROLL LOCK
========================================================= */

function lockScroll() {

    scrollLocked = true;

    setTimeout(() => {

        scrollLocked = false;

    }, LOCK_TIME);

}


/* =========================================================
   NEXT PAGE
========================================================= */

function nextPage() {

    if (scrollLocked) return;

    if (currentIndex >= pages.length - 1) {
        return;
    }

    lockScroll();

    updatePage(currentIndex + 1);

}


/* =========================================================
   PREVIOUS PAGE
========================================================= */

function previousPage() {

    if (scrollLocked) return;

    if (currentIndex <= 0) {
        return;
    }

    lockScroll();

    updatePage(currentIndex - 1);

}


/* =========================================================
   HISTORY INNER SCROLL
========================================================= */

function historyCanScrollDown() {

    if (!historyWrapper) {
        return false;
    }

    return (
        historyWrapper.scrollTop +
        historyWrapper.clientHeight <
        historyWrapper.scrollHeight - 5
    );

}


function historyCanScrollUp() {

    if (!historyWrapper) {
        return false;
    }

    return historyWrapper.scrollTop > 5;

}


/* =========================================================
   MOUSE WHEEL
========================================================= */

window.addEventListener(
    "wheel",
    function (event) {

        /*
           PAGE 04 — FULL HISTORY

           Kalau cursor berada di area sejarah,
           izinkan scroll isi sejarah terlebih dahulu.
        */

        if (
            currentIndex === 3 &&
            historyWrapper &&
            historyWrapper.contains(event.target)
        ) {

            if (event.deltaY > 0) {

                if (historyCanScrollDown()) {

                    return;

                } else {

                    nextPage();

                    return;

                }

            }


            if (event.deltaY < 0) {

                if (historyCanScrollUp()) {

                    return;

                } else {

                    previousPage();

                    return;

                }

            }

        }


        /*
           PAGE NORMAL
        */

        if (event.deltaY > 0) {

            nextPage();

        } else if (event.deltaY < 0) {

            previousPage();

        }

    },
    {
        passive: true
    }
);


/* =========================================================
   TOUCH / SWIPE MAIN PAGE
========================================================= */

let touchStartY = 0;
let touchStartTarget = null;


window.addEventListener(
    "touchstart",
    function (event) {

        touchStartY =
            event.changedTouches[0].screenY;

        touchStartTarget =
            event.target;

    },
    {
        passive: true
    }
);


window.addEventListener(
    "touchend",
    function (event) {

        const touchEndY =
            event.changedTouches[0].screenY;

        const distance =
            touchEndY - touchStartY;


        /*
           Abaikan swipe kecil
        */

        if (Math.abs(distance) < 60) {
            return;
        }


        /*
           HISTORY PAGE
        */

        if (
            currentIndex === 3 &&
            historyWrapper &&
            historyWrapper.contains(touchStartTarget)
        ) {

            if (distance < 0) {

                if (historyCanScrollDown()) {
                    return;
                }

                nextPage();
                return;

            }


            if (distance > 0) {

                if (historyCanScrollUp()) {
                    return;
                }

                previousPage();
                return;

            }

        }


        /*
           NORMAL PAGE
        */

        if (distance < 0) {

            nextPage();

        } else {

            previousPage();

        }

    },
    {
        passive: true
    }
);


/* =========================================================
   KEYBOARD MAIN PAGE
========================================================= */

window.addEventListener(
    "keydown",
    function (event) {

        /*
           Jangan ganggu input field
        */

        const tag =
            event.target.tagName.toLowerCase();

        if (
            tag === "input" ||
            tag === "textarea" ||
            tag === "select"
        ) {
            return;
        }


        /*
           PAGE UP / DOWN
        */

        if (event.key === "ArrowDown") {

            /*
               History inner scroll
            */

            if (
                currentIndex === 3 &&
                historyWrapper
            ) {

                if (historyCanScrollDown()) {

                    historyWrapper.scrollTop += 100;

                    return;

                }

            }

            nextPage();

            return;

        }


        if (event.key === "ArrowUp") {

            /*
               History inner scroll
            */

            if (
                currentIndex === 3 &&
                historyWrapper
            ) {

                if (historyCanScrollUp()) {

                    historyWrapper.scrollTop -= 100;

                    return;

                }

            }

            previousPage();

            return;

        }


        /*
           PAGE DOWN
        */

        if (event.key === "PageDown") {

            nextPage();

            return;

        }


        /*
           PAGE UP
        */

        if (event.key === "PageUp") {

            previousPage();

            return;

        }


        /*
           SPACE
        */

        if (event.code === "Space") {

            event.preventDefault();

            nextPage();

            return;

        }

    }
);


/* =========================================================
   NAVIGATION DOTS
========================================================= */

dots.forEach((dot) => {

    dot.addEventListener(
        "click",
        function () {

            const index =
                Number(
                    dot.getAttribute("data-dot")
                );


            if (Number.isNaN(index)) {
                return;
            }


            updatePage(index);


            /*
               Kalau masuk ke halaman sejarah penuh,
               reset posisi scroll ke atas.
            */

            if (
                index === 3 &&
                historyWrapper
            ) {

                historyWrapper.scrollTop = 0;

            }

        }
    );

});


/* =========================================================
   RESET HISTORY WHEN LEAVING / ENTERING
========================================================= */

function resetHistoryScroll() {

    if (!historyWrapper) {
        return;
    }

    historyWrapper.scrollTop = 0;

}


/* =========================================================
   INITIAL PAGE
========================================================= */

updatePage(0);


/* =========================================================
   CONSOLE
========================================================= */

console.log(
    "MUQODDASAH CYBER TEAM // SYSTEM ONLINE"
);

console.log(
    "Pages detected:",
    pages.length
);


/* =========================================================
   MCT COMPETITION CAROUSEL
   PAGE 07
========================================================= */

const competitionCards =
    document.querySelectorAll(
        ".competition-card"
    );

const competitionDots =
    document.querySelectorAll(
        ".competition-dot"
    );

const competitionPrev =
    document.getElementById(
        "competitionPrev"
    );

const competitionNext =
    document.getElementById(
        "competitionNext"
    );

const competitionCarousel =
    document.getElementById(
        "competitionCarousel"
    );


let competitionIndex = 0;


/* =========================================================
   SHOW COMPETITION
========================================================= */

function showCompetition(index) {

    if (!competitionCards.length) {
        return;
    }


    /*
       Loop ke akhir
    */

    if (index < 0) {

        index =
            competitionCards.length - 1;

    }


    /*
       Loop kembali ke awal
    */

    if (
        index >=
        competitionCards.length
    ) {

        index = 0;

    }


    competitionIndex = index;


    /*
       CARD
    */

    competitionCards.forEach(
        (card, i) => {

            card.classList.toggle(
                "active",
                i === competitionIndex
            );

        }
    );


    /*
       DOT
    */

    competitionDots.forEach(
        (dot, i) => {

            dot.classList.toggle(
                "active",
                i === competitionIndex
            );

        }
    );


    console.log(
        "Competition:",
        competitionIndex + 1
    );

}


/* =========================================================
   NEXT COMPETITION
========================================================= */

if (competitionNext) {

    competitionNext.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

            showCompetition(
                competitionIndex + 1
            );

        }
    );

}


/* =========================================================
   PREVIOUS COMPETITION
========================================================= */

if (competitionPrev) {

    competitionPrev.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

            showCompetition(
                competitionIndex - 1
            );

        }
    );

}


/* =========================================================
   COMPETITION DOTS
========================================================= */

competitionDots.forEach(
    (dot, index) => {

        dot.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();

                showCompetition(index);

            }
        );

    }
);


/* =========================================================
   COMPETITION KEYBOARD
   LEFT / RIGHT
========================================================= */

window.addEventListener(
    "keydown",
    function (event) {

        /*
           Arrow Left / Right hanya bekerja
           ketika berada di PAGE 07.
        */

        if (currentIndex !== 6) {
            return;
        }


        if (event.key === "ArrowRight") {

            event.preventDefault();

            showCompetition(
                competitionIndex + 1
            );

        }


        if (event.key === "ArrowLeft") {

            event.preventDefault();

            showCompetition(
                competitionIndex - 1
            );

        }

    }
);


/* =========================================================
   COMPETITION TOUCH SWIPE
========================================================= */

let competitionTouchStartX = 0;
let competitionTouchEndX = 0;


if (competitionCarousel) {

    competitionCarousel.addEventListener(
        "touchstart",
        function (event) {

            competitionTouchStartX =
                event.changedTouches[0].screenX;

        },
        {
            passive: true
        }
    );


    competitionCarousel.addEventListener(
        "touchend",
        function (event) {

            competitionTouchEndX =
                event.changedTouches[0].screenX;


            const distance =
                competitionTouchEndX -
                competitionTouchStartX;


            /*
               Geser kanan
            */

            if (distance > 60) {

                showCompetition(
                    competitionIndex - 1
                );

            }


            /*
               Geser kiri
            */

            if (distance < -60) {

                showCompetition(
                    competitionIndex + 1
                );

            }

        },
        {
            passive: true
        }
    );

}


/* =========================================================
   MOUSE DRAG COMPETITION
========================================================= */

let competitionMouseDown = false;
let competitionMouseStartX = 0;


if (competitionCarousel) {

    competitionCarousel.addEventListener(
        "mousedown",
        function (event) {

            competitionMouseDown = true;

            competitionMouseStartX =
                event.clientX;

            competitionCarousel.classList.add(
                "dragging"
            );

        }
    );


    competitionCarousel.addEventListener(
        "mouseup",
        function (event) {

            if (!competitionMouseDown) {
                return;
            }


            competitionMouseDown = false;

            competitionCarousel.classList.remove(
                "dragging"
            );


            const distance =
                event.clientX -
                competitionMouseStartX;


            if (distance > 60) {

                showCompetition(
                    competitionIndex - 1
                );

            }


            if (distance < -60) {

                showCompetition(
                    competitionIndex + 1
                );

            }

        }
    );


    competitionCarousel.addEventListener(
        "mouseleave",
        function () {

            competitionMouseDown = false;

            competitionCarousel.classList.remove(
                "dragging"
            );

        }
    );

}


/* =========================================================
   INITIALIZE COMPETITION
========================================================= */

showCompetition(0);


/* =========================================================
   FINAL SYSTEM STATUS
========================================================= */

console.log(
    "MCT COMPETITION ARCHIVE // READY"
);

console.log(
    "Competition entries:",
    competitionCards.length
);