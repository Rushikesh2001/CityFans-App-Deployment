const { hostname, protocol } = window.location;
const appUrl = `${protocol}//${hostname}`;
const fnCheckMail = async () => {
  try {
    let email = document.getElementsByName("email")[0].value;
    let res = await fetch(`${appUrl}/send/resetLink`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mail: email,
      }),
    });
    res = await res.json();
    if (res.msg === "success") {
      let box = document.querySelector("#success");
      box.style.display = "flex";
      box.getElementsByTagName(
        "p"
      )[0].innerText = `A mail has been sent to your mail id ${email} to reset your password.`;
      box
        .getElementsByTagName("button")[0]
        .setAttribute("onclick", `resendMail('${email}')`);
      document.querySelector("#formContainer").style.display = "none";
    } else {
      document.querySelector("#error").style.display = "flex";
    }
  } catch (error) {
    console.log(error);
  }
};

const resendMail = async (mail) => {
  try {
    let res = await fetch(`${appUrl}/send/resetLink`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mail: mail,
      }),
    });
    res = await res.json();
    let box = document.querySelector("#success");
    box.getElementsByTagName("button")[0].innerText =
      "Resend Link - Mail sent successfully";
  } catch (error) {
    console.log(error);
  }
};

const fnCross = () => {
  let errBox = document.querySelector("#error");
  if (errBox.style.display != "none") {
    errBox.style.display = "none";
  }
};
