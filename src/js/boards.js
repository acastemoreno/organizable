import "../styles/boards.scss";
import "@babel/polyfill";
import {
  get_protected_url,
  post_protected_url,
  patch_protected_url,
  delete_protected_url,
} from "./components/request_api.js";
import MicroModal from "micromodal";

MicroModal.init();

import * as star_url from "../images/star.svg";
import * as close_url from "../images/close.svg";
import * as star_header_url from "../images/star_header.svg";
import * as brackets_url from "../images/brackets.svg";

refresh_board_content();

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

function refresh_board_content() {
  get_protected_url("http://localhost:3000/boards").then(([status, boards]) => {
    if (status == "error") {
      window.location.replace("login.html");
    } else {
      generate_content_boards(
        boards.filter((board) => {
          return !board.closed;
        })
      );
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
  let caption_element = document.createElement("div");
  caption_element.classList.add("caption");
  fragment.append(caption_element);

  let image_element = document.createElement("img");
  if (title === "Your Starred Boards") {
    image_element.src = star_header_url.default;
  } else {
    image_element.src = brackets_url.default;
  }
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
    board_element.style.backgroundColor = board.color;
    board_element.style.color = "lightgray";

    let title = document.createElement("p");
    title.textContent = board.name;
    board_element.append(title);

    let actions_element = document.createElement("div");
    actions_element.classList.add("actions");
    actions_element.innerHTML = `<div class="close">
      <img src="${close_url.default}" alt="" />
    </div>
    <div class="star">
      <img src="${star_url.default}" alt="" />
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

    actions_element
      .querySelector(".close")
      .addEventListener("click", (event) => {
        const id = event.currentTarget
          .closest(".board")
          .getAttribute("board_id");
        const hash = {
          closed: "true",
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

const palette = document.getElementsByClassName("color-palette");
palette.pickedColor = "white";

const buttons = document.getElementsByClassName("color-palette-button");

for (const button of buttons) {
  const color = button.style.backgroundColor;
  button.onclick = (event) => {
    document.querySelector(".modal__container").style.backgroundColor = color;
    palette.pickedColor = event.target.classList[1];
  };
}

document.querySelector("#new-board").addEventListener("click", (event) => {
  const title = document.querySelector("#board-title").value;
  const hash = {
    name: document.querySelector("#board-title").value,
    closed: "false",
    desc: "text description",
    color: palette.pickedColor,
    starred: "false",
  };
  document.querySelector("#board-title").value = "";
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
