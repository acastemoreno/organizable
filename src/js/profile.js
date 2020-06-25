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
      document.querySelector("#username").value = result.username;
      document.querySelector("#email").value = result.email;
      document.querySelector("#firstname").value = result.firstName;
      document.querySelector("#lastname").value = result.lastName;
    }
  }
);

const edit = document.querySelector('.edit')
edit.addEventListener(
  'click',
  (event) => {
    event.preventDefault()
    const hash = {
      username: document.querySelector("#username").value,
      email: document.querySelector("#email").value,
      first_name: document.querySelector("#firstname").value,
      last_name: document.querySelector("#lastname").value,
    };
    patch_url(`http://localhost:3000/users/${localStorage.getItem('id')}`, hash)
    location.reload()
  }
)

const del = document.querySelector('.delete')
del.addEventListener(
  'click',
  (event) => {
    event.preventDefault()
    del_url(`http://localhost:3000/users/${localStorage.getItem('id')}`)
    window.location.replace("login.html");
  }
)

const del_url = async (url) => {
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Token token="${localStorage.getItem('token')}"`
    },
  });
};