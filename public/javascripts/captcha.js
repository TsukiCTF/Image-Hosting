// function to include captcha response string into register form fields
const includeCaptchaResponse = () => {
  var formData = new FormData(document.getElementById("loginForm"));
  var captchaResponse = formData.get("g-recaptcha-response");
  document.getElementById("captchaInput").value = captchaResponse;
}