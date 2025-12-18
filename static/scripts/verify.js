const { hostname, protocol } = window.location;
const appUrl = `${protocol}//${hostname}`;
const fnResendLink = async (eve, email) => {
  try {
    eve.preventDefault();
    let res = await fetch(`${appUrl}/resend/verifyLink`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mail: email,
      }),
    });
    res = await res.json();
    if (res) {
      let resendBox = document.querySelector("#resendLink");
      resendBox.getElementsByTagName("a")[0].innerText =
        "Resend Link - Mail sent successfully";
      resendBox.getElementsByTagName("a")[0].style.color = `rgb(${
        Math.random() * 255
      }, ${Math.random() * 255}, ${Math.random() * 255})`;
    }
  } catch (error) {
    console.log(error);
  }
};
