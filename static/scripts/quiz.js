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

const loadContent = (event) => {
  if (document.querySelector("#quizContainer").style.display != "none") {
    document.querySelector("#quizContainer").style.display = "none";
  }
  const { id } = event?.target;
  if (document.querySelector("#quizResult")) {
    if (id === "quiz") {
      if (
        document.querySelector("#dashboardContent").style.display != "table"
      ) {
        document.querySelector("#dashboardContent").style.display = "table";
        document.querySelector(`#${id}`).classList.add("titleActive");
        document.querySelector("#quizResult").style.display = "none";
        document.querySelector("#result").classList.remove("titleActive");
      }
    } else if (id === "result") {
      if (document.querySelector("#quizResult").style.display != "table") {
        document.querySelector("#quizResult").style.display = "table";
        document.querySelector(`#${id}`).classList.add("titleActive");
        document.querySelector("#dashboardContent").style.display = "none";
        document.querySelector("#quiz").classList.remove("titleActive");
      }
    }
  } else {
    if (id === "quiz") {
      if (
        document.querySelector("#dashboardContent").style.display != "table"
      ) {
        document.querySelector("#dashboardContent").style.display = "table";
        document.querySelector(`#${id}`).classList.add("titleActive");
        document.querySelector("#noData").style.display = "none";
        document.querySelector("#result").classList.remove("titleActive");
      }
    } else if (id === "result") {
      if (document.querySelector("#noData").style.display != "flex") {
        document.querySelector("#noData").style.display = "flex";
        document.querySelector(`#${id}`).classList.add("titleActive");
        document.querySelector("#dashboardContent").style.display = "none";
        document.querySelector("#quiz").classList.remove("titleActive");
      }
    }
  }
};

let quizNo;
const { hostname, protocol } = window.location;
const appUrl = `${protocol}//${hostname}`;
const loadQuiz = async (no) => {
  quizNo = no;
  let res = await fetch(`${appUrl}/data/QuickfireQuiz`, {
    method: "GET",
  });
  res = await res.json();
  let quiz = await res.quizdetail[no].quiz;
  let qanswers = await res.quizdetail[no].answers;

  const ans = ["A", "B", "C", "D"];
  let maindiv = document.getElementById("quizContainer");

  if (maindiv.getElementsByTagName("ol")[0]) {
    maindiv.removeChild(maindiv.getElementsByTagName("ol")[0]);
    maindiv.removeChild(maindiv.getElementsByTagName("button")[3]);
  }

  var mask = document.getElementById("mask");
  if (mask.style.display != "none") {
    mask.style.display = "none";
  }

  let mainlist = document.createElement("ol");
  mainlist.setAttribute("id", "questions");

  quiz.forEach((que, ind) => {
    let queBox = document.createElement("li");
    queBox.setAttribute("class", "questionBox");
    let namediv = document.createElement("div");
    namediv.setAttribute("class", "question");
    namediv.innerText = `${ind + 1}. ${que.question}`;
    queBox.append(namediv);
    let unorderedlist = document.createElement("ul");
    unorderedlist.setAttribute("class", "options");
    que.options.forEach((opt, optind) => {
      let optli = document.createElement("li");
      optli.setAttribute("class", "optionsBox");
      let inp1 = document.createElement("input");
      inp1.setAttribute("type", "radio");
      inp1.setAttribute("name", `${ind + 1}`);
      inp1.setAttribute("value", `${ans[optind]}`);
      inp1.setAttribute("onchange", "handleChange(event)");
      let inp2 = document.createElement("input");
      inp2.setAttribute("type", "checkbox");
      inp2.setAttribute("name", `${ind + 1}`);
      inp2.setAttribute("value", `${ans[optind]}`);
      inp2.setAttribute("onchange", "handleChange(event)");
      if (que.type === "single") {
        optli.append(inp1);
      } else {
        optli.append(inp2);
      }
      let optlabel = document.createElement("div");
      optlabel.setAttribute("class", "optionLabel");
      optlabel.innerText = `${opt}`;
      optli.append(optlabel);
      unorderedlist.append(optli);
    });
    queBox.append(unorderedlist);
    let ansBox = document.createElement("div");
    ansBox.setAttribute("class", "answers");
    let pbox = document.createElement("p");
    pbox.innerText = `Answer: ${qanswers[ind + 1]}`;
    ansBox.append(pbox);
    queBox.append(ansBox);
    mainlist.append(queBox);
  });
  maindiv.append(mainlist);
  let submitbtn = document.createElement("button");
  submitbtn.setAttribute("id", "submit");
  submitbtn.setAttribute("type", "submit");
  submitbtn.setAttribute("onclick", "fnSubmit()");
  submitbtn.innerText = "Submit";
  maindiv.append(submitbtn);

  document.querySelector("#quizContainer").style.display = "flex";
  let allInputs = document.getElementsByTagName("input");
  for (let element of allInputs) {
    element.removeAttribute("disabled");
  }
  let ansDivs = document.querySelectorAll(".answers");
  for (let element of ansDivs) {
    element.style.display = "none";
  }
  document.querySelector("#dashboardContent").style.display = "none";
};

const fnSubmit = () => {
  document.querySelector("#mask").style.display = "flex";
  document.querySelector("#confirm").style.display = "flex";
  document.querySelector("#scoreDialog").style.display = "none";
};

let userAns = {};
const handleChange = (event) => {
  const { type, name, value, checked } = event.target;
  if (type == "checkbox") {
    let multiOpt = userAns[name] ? userAns[name].split("") : [];
    if (checked) {
      multiOpt.push(value);
    } else {
      let optIndex = multiOpt.indexOf(value);
      multiOpt.splice(optIndex, 1);
    }
    userAns[name] = multiOpt.sort().join("");
  } else {
    userAns[name] = value;
  }
};

const submitQuiz = async (email) => {
  try {
    let res = await fetch(`${appUrl}/data/QuickfireQuiz`, {
      method: "GET",
    });
    res = await res.json();
    let quizAns = await res.quizdetail[quizNo].answers;
    let quizName = await res.quizdetail[quizNo].name;
    let marks = 0;
    for (let val in userAns) {
      if (userAns[val] === quizAns[val]) {
        marks += 1;
      }
    }
    let dateObj = new Date();
    const date =
      dateObj.getDate() +
      "/" +
      parseInt(dateObj.getMonth() + 1) +
      "/" +
      dateObj.getFullYear() +
      ", " +
      dateObj.getHours() +
      ":" +
      dateObj.getMinutes() +
      ":" +
      dateObj.getSeconds();
    // fetch to web service to add the details to the mongodb
    let result = await fetch(`${appUrl}/user/data/quiz`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mail: email,
        name: quizName,
        score: marks,
        date: date,
      }),
    });
    var scoreBox = document.querySelector("#scoreDialog");
    var confirmBox = document.querySelector("#confirm");
    if (scoreBox.style.display != "flex") {
      scoreBox.style.display = "flex";
      confirmBox.style.display = "none";
    }
    document.querySelector("#score").innerText = `You scored ${marks} marks`;
  } catch (ex) {
    console.log("Quiz", ex);
  }
};

const fnAnswers = (answers) => {
  console.log(answers);
};

const showAns = () => {
  document.querySelector("#mask").style.display = "none";
  document.querySelector("#scoreDialog").style.display = "none";
  let allInputs = document.getElementsByTagName("input");
  for (let element of allInputs) {
    element.setAttribute("disabled", "");
  }

  let ansDivs = document.querySelectorAll(".answers");
  for (let element of ansDivs) {
    element.style.display = "flex";
  }
  document.querySelector("#submit").disabled = true;
};

const fnCancelSubmission = () => {
  document.querySelector("#mask").style.display = "none";
};

function updateIndex(index) {
  if (index) {
    return index;
  }
  return 0;
}

//Display mobile menu
let right = parseInt(getComputedStyle(document.getElementById("menu")).right);
const showMobileMenu = () => {
  let nav = document.getElementById("menu");
  let ct = parseInt(getComputedStyle(document.getElementById("menu")).right);
  nav.style.transform = `translateX(${right}px)`;
  right = right >= 0 ? ct : 0;
};
