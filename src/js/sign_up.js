import "../styles/sign_up.scss";

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
  post("http://localhost:3000/users", hash);
});

async function post(url, body) {
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).then((res) => {
    console.log(res.status);
    if (res.status === 201) {
      return res.json();
    }
    console.log(res.text());
    return;
  });
}
