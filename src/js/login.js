import "../styles/sign_up.scss";

import "@babel/polyfill";

document.querySelector(".auth_form").addEventListener("submit", (event) => {
  event.preventDefault();
  const target = event.currentTarget;
  const hash = {
    username: target.querySelector("#username").value,
    password: target.querySelector("#password").value,
  };
  post("http://localhost:3000/login", hash);
});

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
    localStorage.setItem("id", data.id);
    window.location.replace("boards.html");
  }
}
