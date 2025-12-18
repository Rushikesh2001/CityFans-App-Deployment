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

//Display mobile menu
let right = parseInt(getComputedStyle(document.getElementById("menu")).right);
const showMobileMenu = () => {
  let nav = document.getElementById("menu");
  let ct = parseInt(getComputedStyle(document.getElementById("menu")).right);
  nav.style.transform = `translateX(${right}px)`;
  right = right >= 0 ? ct : 0;
};
