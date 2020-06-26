import "../styles/board.scss";
import "@babel/polyfill";
import {
  get_protected_url,
  // post_protected_url,
  // patch_protected_url,
  //delete_protected_url,
} from "./components/request_api.js";

import * as plus_white_url from "../images/plus_white.svg";
import * as close_header_url from "../images/close_header.svg";
import * as plus_gray_url from "../images/plus_gray.svg";

refresh_board_content();

function refresh_board_content() {
  const board_id = capture_board_id();

  get_protected_url(`http://localhost:3000/boards/${board_id}`).then(
    ([status, board]) => {
      if (status == "error") {
        window.location.replace("login.html");
      } else {
        let main_fragment = new DocumentFragment();
        let main_element = create_main(board);
        main_element = render_info(main_element, board);
        main_element = render_board_list(main_element, board);

        main_fragment.append(main_element);
        console.log(board);
        document.querySelector("main").replaceWith(main_fragment);
      }
    }
  );
}

function capture_board_id() {
  const re = /\?board_id\=(\d+)/;
  return re.exec(window.location.href)[1];
}

function create_main(board) {
  const main_element = document.createElement("main");
  main_element.classList.add(board.color);
  return main_element;
}

function render_info(main_element, board) {
  const header_element = document.createElement("div");
  header_element.classList.add("board_info");
  header_element.innerHTML = `<h1>${board.name}</h1>`;
  main_element.append(header_element);
  return main_element;
}

function render_board_list(main_element, board) {
  let board_lists_element = document.createElement("div");
  board_lists_element.classList.add("board_lists");
  board_lists_element = render_all_lists(board_lists_element, board.lists);
  board_lists_element = render_add_list_option(board_lists_element);
  main_element.append(board_lists_element);
  return main_element;
}

function render_all_lists(board_lists_element, lists) {
  lists.forEach((list) => {
    let list_element = document.createElement("div");
    list_element.className = "list";
    list_element = create_head_list(list_element, list);
    list_element = create_body_list(list_element, list);

    board_lists_element.append(list_element);
  });
  return board_lists_element;
}

function create_head_list(list_element, list) {
  let list_head_element = document.createElement("div");
  list_head_element.className = "list_head";

  list_head_element.innerHTML = `<p class="list_name">
    ${list.name}
  </p>
  <div class="close">
    <img src="${close_header_url.default}" alt="" />
  </div>`;

  list_element.append(list_head_element);
  return list_element;
}

function create_body_list(list_element, list) {
  let list_body_element = document.createElement("div");
  list_body_element.className = "list_body";

  list_body_element = render_all_card(list_body_element, list);
  list_body_element = render_create_card_option(list_body_element, list);

  list_element.append(list_body_element);
  return list_element;
}

function render_all_card(list_body_element, list) {
  list.cards.forEach((card) => {
    let card_element = document.createElement("div");
    card_element.className = "card";

    list_body_element.append(card_element);
  });

  return list_body_element;
}

function render_create_card_option(list_body_element, list) {
  let create_card_option_element = document.createElement("div");
  create_card_option_element.className = "create_card";

  create_card_option_element.innerHTML = `<img src="${plus_gray_url.default}" alt="" />
  <p>Add another card</p>`;

  list_body_element.append(create_card_option_element);
  return list_body_element;
}

function render_add_list_option(board_lists_element) {
  let create_add_list_element = document.createElement("div");
  create_add_list_element.className = "list add-a-list-button";
  create_add_list_element.innerHTML = `<img src="${plus_white_url.default}" alt="" />
  <p>Add a list</p>`;
  board_lists_element.append(create_add_list_element);
  return board_lists_element;
}
