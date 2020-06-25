import "../styles/boards.scss";
import "@babel/polyfill";
import get_protected_url from "./components/validate_auth.js";

get_protected_url("http://localhost:3000/boards").then((result) => {
  if (result[0] == "error") {
    window.location.replace("sign_up.html");
  } else {
    console.log("holi");
  }
});
