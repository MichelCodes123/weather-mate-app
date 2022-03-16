var links = document.querySelector("ul");
var burger = document.querySelector(".burger");


burger.addEventListener("click", function () {
    links.classList.toggle("ul-hidden");
})