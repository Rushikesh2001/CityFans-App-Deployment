const fnChangePassword = (mail, id) => {
  let pwd = document.getElementsByName("pwd")[0].value;
  let cpwd = document.getElementsByName("cpwd")[0].value;

  const minOneUpperCase = /[A-Z]{1,}/.test(cpwd);
  const minOneLowerCase = /[a-z]{1,}/.test(cpwd);
  const minOneSpChar = /[@#%$&!^*]{1,}/.test(cpwd);
  const minOneNum = /[0-9]{1,}/.test(cpwd);
  const min8Char = /.{8,}/.test(cpwd);

  if (
    minOneSpChar &&
    minOneUpperCase &&
    minOneLowerCase &&
    minOneNum &&
    min8Char
  ) {
    if (pwd === cpwd) {
      fnCallApi(cpwd, mail, id);
    } else {
      document.querySelector("#matchError").style.display = "flex";
    }
  } else {
    document.querySelector("#error").style.display = "flex";
  }
};

const { hostname, protocol } = window.location;
const appUrl = `${protocol}//${hostname}`;
const fnCallApi = (password, email, id) => {
  fetch(`${appUrl}/change/user/password?id=${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      pwd: password,
      mail: email,
    }),
  })
    .then((response) => response.json())
    .then((response) => {
      window.location = "/reset-success";
    })
    .catch((err) => {
      console.log(err);
    });
};
