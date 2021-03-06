import "../styles/boards.scss";
import "@babel/polyfill";

import {
  get_protected_url,
  patch_protected_url,
  delete_protected_url,
} from "./components/request_api.js";

import * as trash_url from "../images/trash.svg";
import * as restore_url from "../images/restore.svg";
import * as close_header_url from "../images/close_header.svg";

refresh_closed_board_content();

document.querySelector("#logout").addEventListener("click", (event) => {
  event.preventDefault();
  delete_protected_url("http://localhost:3000/logout").then((status) => {
    if (status == "error") {
      console.log(data);
    } else {
      localStorage.removeItem("id");
      localStorage.removeItem("token");
      window.location.replace("login.html");
    }
  });
});

function refresh_closed_board_content() {
  get_protected_url("http://localhost:3000/boards").then(([status, boards]) => {
    if (status == "error") {
      window.location.replace("login.html");
    } else {
      generate_content_closed_boards(
        boards.filter((board) => {
          return board.closed;
        })
      );
    }
  });
}

function generate_content_closed_boards(boards) {
  let content_board = document.querySelector("#content_boards");
  content_board.innerHTML = "";
  let boards_fragment = new DocumentFragment();

  boards_fragment = append_group_boards(
    boards_fragment,
    boards,
    "Closed boards"
  );
  content_board.append(boards_fragment);
}

function append_group_boards(fragment, boards, title) {
  let caption_element = document.createElement("div");
  caption_element.classList.add("caption");
  fragment.append(caption_element);

  let image_element = document.createElement("img");
  image_element.src = close_header_url.default;
  caption_element.append(image_element);

  let title_element = document.createElement("h2");
  title_element.textContent = title;
  caption_element.append(title_element);

  let board_group = document.createElement("div");
  board_group.classList.add("board_group");

  boards.forEach((board) => {
    let board_element = document.createElement("div");
    board_element.classList.add("board");
    board_element.setAttribute("board_id", board.id);
    board_element.classList.add(board.color);

    let title = document.createElement("p");
    title.textContent = board.name;
    board_element.append(title);

    let actions_element = document.createElement("div");
    actions_element.classList.add("actions");
    actions_element.innerHTML = `<div class="trash">
      <img src="${trash_url.default}" alt="" />
    </div>
    <div class="restore">
      <img src="${restore_url.default}" alt="" />
    </div>`;

    actions_element
      .querySelector(".trash")
      .addEventListener("click", (event) => {
        const id = event.currentTarget
          .closest(".board")
          .getAttribute("board_id");
        delete_protected_url(`http://localhost:3000/boards/${id}`).then(() => {
          refresh_closed_board_content();
        });
      });

    actions_element
      .querySelector(".restore")
      .addEventListener("click", (event) => {
        const id = event.currentTarget
          .closest(".board")
          .getAttribute("board_id");
        const hash = {
          closed: "false",
        };
        patch_protected_url(`http://localhost:3000/boards/${id}`, hash).then(
          () => {
            refresh_closed_board_content();
          }
        );
      });

    board_element.append(actions_element);

    board_group.append(board_element);
  });
  fragment.append(board_group);
  return fragment;
}
