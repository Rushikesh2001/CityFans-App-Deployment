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

function fireSearchEvent(event) {
  var str = event.target.value;
  var code = event.charCode;
  if (str.length) {
    if (code == 13) {
      findPlayer();
    }
    document.querySelector("#cancel").style.display = "flex";
  } else {
    document.querySelector("#cancel").style.display = "none";
  }
}

function findPlayer() {
  var searchString = document.querySelector("#searchPlayer").value;
  searchString = searchString.toLowerCase();
  var items = document.querySelectorAll(".items");
  for (let i = 0; i < 3; i++) {
    var name = document.querySelectorAll(".name")[i].innerHTML;
    name = name.toLowerCase();

    if (name.includes(searchString)) {
      items[i + 1].style.display = "flex";
    } else {
      items[i + 1].style.display = "none";
    }
  }
}

function displayAllPlayersList() {
  document.querySelector("#searchPlayer").value = "";
  document.querySelectorAll(".items").forEach((element) => {
    element.style.display = "flex";
  });
  document.querySelector("#cancel").style.display = "none";
}

let players = document.querySelectorAll(".player");

for (let i = 0; i < players.length; i++) {
  players[i].addEventListener("mouseover", () => {
    let nameBlock = players[i].querySelector(".name");
    nameBlock.style.backgroundColor = "#070352";
    nameBlock.style.color = "white";
    players[i].querySelector(".playerInfo").style.display = "flex";
  });
}

for (let i = 0; i < players.length; i++) {
  players[i].addEventListener("mouseout", () => {
    let nameBlock = players[i].querySelector(".name");
    nameBlock.style.backgroundColor = "white";
    nameBlock.style.color = "#090358";
    players[i].querySelector(".playerInfo").style.display = "none";
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
