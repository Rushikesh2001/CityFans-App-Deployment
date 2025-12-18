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

let addFileIcon = document.querySelector(".fa-plus");
let selectFile = document.querySelector("#fileSelect");

addFileIcon.addEventListener("click", () => {
  selectFile.style.display = "flex";
  if (document.getElementById("fileError").style.display != "none") {
    document.getElementById("fileError").style.display = "none";
  }
});

let closeDialog = document.querySelector("#closeDialog");

closeDialog.addEventListener("click", (e) => {
  e.stopPropagation();
  selectFile.style.display = "none";
});

let fileElem = document.querySelector("#fileElem");
let cancelIcon = document.getElementById("deleteFile");

selectFile.addEventListener(
  "click",
  (e) => {
    if (fileElem) {
      fileElem.click();
    }
  },
  false
);

fileElem.addEventListener("click touchstart", () => {
  fileElem.value = "";
});

let fileName = document.getElementById("fileName");
fileElem.addEventListener("change", () => {
  let file = fileElem.files[0];
  if (
    file &&
    (file.type == "image/jpg" ||
      file.type == "image/jpeg" ||
      file.type == "image/png") &&
    file.size < 1000000
  ) {
    fileName.innerText = fileElem.files[0].name;
    cancelIcon.style.display = "flex";
    addFileIcon.style.display = "none";
    selectFile.style.display = "none";
    console.log(file.type);
    console.log(file.size);
  } else {
    fileElem.value = "";
    document.getElementById("fileError").style.display = "flex";
  }
});

cancelIcon.addEventListener("click", () => {
  fileName.innerText = "";
  fileElem.value = "";
  cancelIcon.style.display = "none";
  addFileIcon.style.display = "flex";
});

let submit = document.querySelector("input[type='submit']");
let nofile = document.getElementById("noFileSelected");

submit.addEventListener("click", () => {
  if (!fileElem.files[0]) {
    nofile.style.display = "flex";
  }
});

//Display mobile menu
let right = parseInt(getComputedStyle(document.getElementById("menu")).right);
const showMobileMenu = () => {
  let nav = document.getElementById("menu");
  let ct = parseInt(getComputedStyle(document.getElementById("menu")).right);
  nav.style.transform = `translateX(${right}px)`;
  right = right >= 0 ? ct : 0;
};
