const redirectURL = new URLSearchParams(window.location.search).get("redirect");

const nicknameInput = document.getElementById("nickname-input");
document.getElementById("create-account-button").addEventListener("click", (event) => {
  let nickname = nicknameInput.value;
  if (nickname && nickname.length > 0) {
    createAccount(nickname);
  }
});
const errorLabel = document.getElementById("error-text");

const createAccount = async (nickname) => {
  let response = await fetch(`/create-account?nickname=${nickname}`, {method: "POST"});
  let status =  response.status;
  switch (status) {
    case 401: // unauthorized
      window.location = window.location.origin + `/authenticate?redirect=${redirectURL}`;
    case 412: // precondition failed
      nicknameInput.focus();
      break;
    case 409: // conflict
      errorLabel.innerHTML = "nickname taken";
      nicknameInput.focus();
      break;
    case 202: // accepted
    case 201: // created
      window.location.pathname = redirectURL;
      break;
    default:
      errorLabel.innerHTML = "try again";
      break;
  }
}
