let socialIcon = document.getElementsByClassName("fab");

let divIcon = document.getElementsByClassName("icons");

len = Array.from(divIcon).length;

for (let i = 0; i < len; i++) {
  divIcon[i].addEventListener("mouseover", () => {
    divIcon[i].style.backgroundColor = "lightblue";
    socialIcon[i].style.color = "black";
  });
}

for (let i = 0; i < len; i++) {
  divIcon[i].addEventListener("mouseout", () => {
    divIcon[i].style.backgroundColor = "#1b0b20";
    socialIcon[i].style.color = "lightblue";
  });
}

//Making Image slider
window.addEventListener("DOMContentLoaded", () => {
  let i = 1;
  let slides = document.querySelectorAll(".contentBox");

  setInterval(() => {
    if (i == slides.length) {
      slides[i - 1].className = "contentBox fadeOut";
      slides[0].className = "contentBox fadeIn";
      i = 0;
    } else {
      slides[i - 1].className = "contentBox fadeOut";
      slides[i].className = "contentBox fadeIn";
    }

    i++;
  }, 5000);
});

//Loading news into template
var loadNewsBoard = (link, imgLink, title) => {
  document.querySelector(
    "#newsBoard"
  ).style.backgroundImage = `url(${imgLink})`;
  document.querySelector("#newsHeadLine").innerText = title;
  document.querySelector("#articleLink").setAttribute("href", `${link}`);
};

//Display mobile menu
let right = parseInt(getComputedStyle(document.getElementById("menu")).right);
const showMobileMenu = () => {
  let nav = document.getElementById("menu");
  let ct = parseInt(getComputedStyle(document.getElementById("menu")).right);
  nav.style.transform = `translateX(${right}px)`;
  right = right >= 0 ? ct : 0;
};

//News Side Bar
var sideBar = document.getElementById("responsiveSideBar");
var leftIcon = document.querySelector(".fa-caret-left");
var newsList = document.getElementById("newsList");
let open = false;
let rpos = parseInt(getComputedStyle(newsList).right);
sideBar.addEventListener("click", () => {
  leftIcon.style.transform = open ? "rotateY(0deg)" : "rotateY(180deg)";
  let ctpos = parseInt(getComputedStyle(newsList).right);
  newsList.style.transform = `translateX(${rpos}px)`;
  sideBar.style.transform = `translateX(${rpos}px)`;
  rpos = rpos >= 0 ? ctpos : 0;
  open = !open;
});
