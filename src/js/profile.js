import "../styles/profile.scss";
import "../styles/sign_up.scss";
import "@babel/polyfill";
import { get_protected_url } from "./components/request_api.js";

const id = localStorage.getItem("id");

get_protected_url(`http://localhost:3000/users/${id}`).then(
  ([status, result]) => {
    if (status == "error") {
      window.location.replace("login.html");
    } else {
      console.log(result);
    }
  }
);

async function post(url, body) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok) {
    console.log(data);
  } else {
    localStorage.setItem("token", data.token);
    window.location.replace("boards.html");
  }
}

document.querySelector("#username").value = "";
document.querySelector("#email").value = "";
document.querySelector("#firstname").value = "";
document.querySelector("#lastname").value = "";

const hash = {
  username: document.querySelector("#username").value,
  email: document.querySelector("#email").value,
  firstname: document.querySelector("#firstname").value,
  lastnaem: document.querySelector("#lastname").value,
};
