import "../styles/boards.scss";
import "@babel/polyfill";
import {
  get_protected_url,
  post_protected_url,
} from "./components/request_api.js";

get_protected_url("http://localhost:3000/boards").then(([status, result]) => {
  if (status == "error") {
    window.location.replace("login.html");
  } else {
    refresh_board_content(result);
  }
});

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

      boards_fragment = append_group_boards(
        boards_fragment,
        starred_boards,
        "Your Starred Boards"
      );
      content_board.append(boards_fragment);

      boards_fragment = append_group_boards(
        boards_fragment,
        normal_boards,
        "Your Boards"
      );
      content_board.append(boards_fragment);
    }
  });
}

function append_group_boards(fragment, boards, title) {
  let title_element = document.createElement("h2");
  title_element.textContent = title;
  fragment.append(title_element);

  let board_group = document.createElement("div");
  board_group.classList.add("board_group");

  boards.forEach((board) => {
    const board_element = document.createElement("div");
    board_element.classList.add("board");
    board_element.classList.add(board.color);
    board_element.textContent = board.name;
    board_group.append(board_element);
  });
  fragment.append(board_group);
  return fragment;
}
