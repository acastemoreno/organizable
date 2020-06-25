import "../styles/boards.scss";
import "@babel/polyfill";
import {
  get_protected_url,
  post_protected_url,
  patch_protected_url,
} from "./components/request_api.js";

import * as star_url from "../images/star.svg";

refresh_board_content();

document.querySelector("#logout").addEventListener("click", (event) => {
  event.preventDefault();
  localStorage.removeItem("id");
  localStorage.removeItem("token");
  window.location.replace("login.html");
});

document.querySelector("#new-board").addEventListener("click", (event) => {
  const hash = {
    name: "new board",
    closed: "false",
    desc: "text description",
    color: "blue",
    starred: "false",
  };
  post_protected_url("http://localhost:3000/boards", hash).then(
    ([status, result]) => {
      if (status == "error") {
        window.location.replace("login.html");
      } else {
        refresh_board_content();
      }
    }
  );
});

function refresh_board_content() {
  get_protected_url("http://localhost:3000/boards").then(([status, boards]) => {
    if (status == "error") {
      window.location.replace("login.html");
    } else {
      generate_content_boards(boards);
    }
  });
}

function generate_content_boards(boards) {
  let content_board = document.querySelector("#content_boards");
  content_board.innerHTML = "";
  let boards_fragment = new DocumentFragment();

  const [starred_boards, normal_boards] = boards.reduce(
    ([starred_acc, normal_acc], board) => {
      return board.starred
        ? [[...starred_acc, board], normal_acc]
        : [starred_acc, [...normal_acc, board]];
    },
    [[], []]
  );
  if (starred_boards.length !== 0) {
    boards_fragment = append_group_boards(
      boards_fragment,
      starred_boards,
      "Your Starred Boards"
    );
    content_board.append(boards_fragment);
  }

  if (normal_boards.length !== 0) {
    boards_fragment = append_group_boards(
      boards_fragment,
      normal_boards,
      "Your Boards"
    );
    content_board.append(boards_fragment);
  }
}

function append_group_boards(fragment, boards, title) {
  let title_element = document.createElement("h2");
  title_element.textContent = title;
  fragment.append(title_element);

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
    actions_element.innerHTML = `<div class="star">
      <img ${board.starred ? `class="starred"` : ""} src="${
      star_url.default
    }" alt="" />
    </div>`;
    actions_element
      .querySelector(".star")
      .addEventListener("click", (event) => {
        const id = event.currentTarget
          .closest(".board")
          .getAttribute("board_id");
        const hash = {
          starred: board.starred ? "false" : "true",
        };
        patch_protected_url(`http://localhost:3000/boards/${id}`, hash).then(
          () => {
            refresh_board_content();
          }
        );
      });

    board_element.append(actions_element);

    board_group.append(board_element);
  });
  fragment.append(board_group);
  return fragment;
}
