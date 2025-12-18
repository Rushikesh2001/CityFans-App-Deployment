const fnPwdValidate = (e) => {
  let pwd = document.getElementsByName("password")[0].value;
  let cpwd = document.getElementsByName("confirmPassword")[0].value;

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
      document.querySelector("#matchError").style.display = "none";
      document.querySelector("#error").style.display = "none";
      return true;
    } else {
      document.querySelector("#error").style.display = "none";
      document.querySelector("#matchError").style.display = "flex";
    }
  } else {
    document.querySelector("#error").style.display = "flex";
  }
};

const isDetailValid = (eve) => {
  eve.preventDefault();
  var mail = document.getElementsByName("mail")[0].value;
  const mailValid = /^[a-zA-Z0-9]{1}[a-zA-Z0-9]{1,}@[a-z]{5,}.[a-z]{2,3}$/.test(
    mail
  );
  if (fnPwdValidate() && mailValid) {
    eve.target.submit();
  } else if (!mailValid) {
    document.querySelector("#mailError").style.display = "flex";
  }
};
