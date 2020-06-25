import "../styles/sign_up.scss";

import "@babel/polyfill";
import { post_url } from "./components/request_api.js";

document.querySelector(".auth_form").addEventListener("submit", (event) => {
  event.preventDefault();
  const target = event.currentTarget;
  const hash = {
    user: {
      username: target.querySelector("#username").value,
      password: target.querySelector("#password").value,
      email: target.querySelector("#email").value,
      first_name: target.querySelector("#firstname").value,
      last_name: target.querySelector("#lastname").value,
    },
  };
  post_url("http://localhost:3000/users", hash).then(([status, data]) => {
    if (status == "error") {
      console.log(data);
    } else {
      localStorage.setItem("id", data.id);
      localStorage.setItem("token", data.token);
      window.location.replace("boards.html");
    }
  });
});
