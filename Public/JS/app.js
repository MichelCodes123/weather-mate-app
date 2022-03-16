let srcs = ["/Images/cloud-showers-heavy-solid.png", "/Images/smog-solid.png",
    "/Images/bolt-solid.png", "/Images/cloud-sun-solid.png", "/Images/wind-solid.png"];
let src_count = 0;
let but = document.querySelector("button");
let img = document.querySelector("img");


// Code to control the landing page animation
setInterval(() => {

    move();
    setTimeout(reset, 1000);
    setTimeout(finish, 1100);
    setTimeout(restart, 2100);

}, 5000);

function move() {

    $("img").addClass("fade-out");
}

function reset() {
    img.style.transition = "none";
    $("img").addClass("return");

}
function finish() {
    $("img").removeClass("return fade-in")
    img.style.transition = "1s ease";
    $("img").addClass("fade-in");
    img.setAttribute("src", srcs[newImage()]);

}

function restart() {
    $("img").removeClass("fade-out fade-in");

}

// This function allows me to cycle through each weather icon in my array, by updating my index variable, src_count.
function newImage() {
    if (src_count < 4) {
        src_count++;
    }
    else
        src_count = 0

    return src_count;
}




