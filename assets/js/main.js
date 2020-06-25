import { login, signout, createUser } from "./robert.js";
const user = JSON.parse(localStorage.getItem("user"));

console.log(user);
const loginBtn = document.querySelector("#login-btn");
const createBtn = document.querySelector("#create-btn");
const signoutBtn = document.querySelector("#sign-out");

if (createBtn) createBtn.addEventListener("click", createUser);
if (loginBtn) loginBtn.addEventListener("click", login);
if (signoutBtn) signoutBtn.addEventListener("click", signout);

export { user };
