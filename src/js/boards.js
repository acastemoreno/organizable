import "../styles/boards.scss";
import "@babel/polyfill";
import get_protected_url from "./components/validate_auth.js";

get_protected_url("http://localhost:3000/boards").then((result) => {
  if (result[0] == "error") {
    window.location.replace("login.html");
  } else {
    console.log("holi");
  }
});

document.querySelector("#logout").addEventListener("click", (event) => {
  event.preventDefault();
  localStorage.removeItem("token");
  window.location.replace("login.html");
});
