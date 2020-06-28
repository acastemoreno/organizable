import "../styles/board.scss";
import "@babel/polyfill";
import {
  get_protected_url,
  post_protected_url,
  patch_protected_url,
  delete_protected_url,
} from "./components/request_api.js";

import * as plus_white_url from "../images/plus_white.svg";
import * as close_header_url from "../images/close_header.svg";
import * as plus_gray_url from "../images/plus_gray.svg";
import * as check_url from "../images/check.svg";
import * as cancel_url from "../images/cancel.svg";

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
  sort_asc(lists, (list) => list.pos).forEach((list) => {
    board_lists_element = render_add_list(board_lists_element, list);
  });
  return board_lists_element;
}

function sort_asc(list_element, fun) {
  return list_element.sort((a, b) => {
    if (fun(a) < fun(b)) {
      return -1;
    } else if (fun(a) > fun(b)) {
      return 1;
    } else {
      return 0;
    }
  });
}

function render_add_list(board_lists_element, list) {
  let list_element = document.createElement("div");
  list_element.className = "list";
  list_element.setAttribute("list_id", list.listId || list.id);
  list_element.setAttribute("pos", list.pos);

  list_element = create_head_list(list_element, list);
  list_element = create_body_list(list_element, list);

  board_lists_element.append(list_element);
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

  list_head_element
    .querySelector("p")
    .addEventListener("click", modify_title_of_list_callback);

  list_head_element
    .querySelector(".close")
    .addEventListener("click", delete_list_api_callback);

  list_element.append(list_head_element);
  return list_element;
}

function create_body_list(list_element, list) {
  let list_body_element = document.createElement("div");
  list_body_element.className = "list_body";

  list_body_element = render_all_card(list_body_element, list);
  list_body_element = render_create_card_option(list_body_element);

  list_element.append(list_body_element);
  return list_element;
}

function render_all_card(list_body_element, list) {
  list.cards.forEach((card) => {
    list_body_element = render_card(list_body_element, card);
  });

  return list_body_element;
}

function render_card(parent_element, card) {
  let card_element = document.createElement("div");
  card_element.className = "card";
  card_element.setAttribute("card_id", card.cardId || card.id);
  card_element.setAttribute("pos", card.pos);

  card_element = render_labels_for_card(card_element, card);
  card_element = render_title_for_card(card_element, card);
  card_element = render_check_list_for_card(card_element, card);

  parent_element.append(card_element);
  return parent_element;
}

function render_labels_for_card(card_element, card) {
  if (card.labels.length !== 0) {
    let labels_element = document.createElement("div");
    labels_element.className = "labels";

    card.labels.forEach((label) => {
      let label_element = document.createElement("div");
      label_element.className = `label ${label.color}`;

      labels_element.append(label_element);
    });

    card_element.append(labels_element);
  }

  return card_element;
}

function render_title_for_card(card_element, card) {
  let title_element = document.createElement("div");
  title_element.className = "card_title";

  title_element.innerHTML = `<p>${card.name}</p>`;

  card_element.append(title_element);
  return card_element;
}

function render_check_list_for_card(card_element, card) {
  if (card.checkItems !== 0) {
    let check_list_element = document.createElement("div");
    check_list_element.className = "check_list";

    check_list_element.innerHTML = `<img src="${check_url.default}" />
    <p>${card.completedCheckItems}/${card.checkItems}</p>`;

    card_element.append(check_list_element);
  }
  return card_element;
}

function render_create_card_option(list_body_element) {
  let create_card_option_element = document.createElement("div");
  create_card_option_element.className = "create_card";

  create_card_option_element.innerHTML = `<img src="${plus_gray_url.default}" alt="" />
  <p>Add another card</p>`;

  create_card_option_element.addEventListener(
    "click",
    render_form_to_create_card_callback
  );

  list_body_element.append(create_card_option_element);
  return list_body_element;
}

function render_create_list(board_lists_element) {
  let create_list_element = document.createElement("div");
  create_list_element.className = "list";

  create_list_element.innerHTML = `<form class="create_list">
    <input
      type="text"
      name="title"
      id="title"
      placeholder="Enter list title..."
    />
    <div class="control">
      <button class="submit" type="submit">Add List</button>
      <a href="#">
        <img src="${cancel_url.default}" alt="" />
      </a>
    </div>
  </form>`;

  create_list_element
    .querySelector("form.create_list")
    .addEventListener("submit", create_list_api_callback);

  create_list_element
    .querySelector("a")
    .addEventListener("click", return_create_list_callback);

  board_lists_element.append(create_list_element);
  return board_lists_element;
}

function render_add_list_option(board_lists_element) {
  let create_add_list_element = document.createElement("div");
  create_add_list_element.className = "list add-a-list-button";

  create_add_list_element.innerHTML = `<img src="${plus_white_url.default}" alt="" />
  <p>Add a list</p>`;

  create_add_list_element.addEventListener("click", create_list_callback);

  board_lists_element.append(create_add_list_element);
  return board_lists_element;
}

function render_form_for_edit_title_list(parent_element, current_title) {
  let form_for_edit_title_element = document.createElement("form");
  form_for_edit_title_element.className = "edit_title";
  form_for_edit_title_element.innerHTML = `<input type="text" name="title" id="title" value="${current_title}" />`;

  form_for_edit_title_element.addEventListener("keydown", (event) =>
    cancel_edit_title_callback(event, current_title)
  );

  form_for_edit_title_element.addEventListener(
    "submit",
    edit_title_api_callback
  );

  parent_element.append(form_for_edit_title_element);
  return parent_element;
}

function render_form_option_to_create_card(fragment) {
  let form_container_element = document.createElement("div");
  form_container_element.className = "create_form_options";
  form_container_element.innerHTML = `<form class="create_card_form">
    <input
      type="text"
      name=""
      id=""
      placeholder="Enter a title for this card..."
    />
    <div class="control">
      <button class="submit" type="submit">Add Card</button>
      <a href="#">
        <img src="${cancel_url.default}" alt="" />
      </a>
    </div>
  </form>`;

  form_container_element
    .querySelector("a")
    .addEventListener("click", reset_render_form_to_create_card_callback);

  form_container_element
    .querySelector("form")
    .addEventListener("submit", create_card_api_callback);

  fragment.append(form_container_element);
  return fragment;
}

function create_list_callback(event) {
  let fragment = new DocumentFragment();

  fragment = render_create_list(fragment);

  event.currentTarget.replaceWith(fragment);
}

function return_create_list_callback(event) {
  event.preventDefault();
  let fragment = new DocumentFragment();

  fragment = render_add_list_option(fragment);

  event.target.closest(".list").replaceWith(fragment);
}

function create_list_api_callback(event) {
  event.preventDefault();
  const target = event.currentTarget;
  const title = target.querySelector("input").value;
  const board_id = capture_board_id();
  if (/^\w+/.test(title)) {
    const new_pos =
      parseInt(target.closest(".list").previousSibling.getAttribute("pos")) + 1;
    post_protected_url(`http://localhost:3000/boards/${board_id}/lists`, {
      name: title,
      pos: new_pos,
    }).then(([status, data]) => {
      if (status == "error") {
        console.log(data);
      } else {
        data.cards = [];
        let fragment = new DocumentFragment();
        fragment = render_add_list(fragment, data);
        fragment = render_add_list_option(fragment);
        target.closest(".list").replaceWith(fragment);
      }
    });
  }
}

function modify_title_of_list_callback(event) {
  const parent = event.currentTarget.closest(".list_head");
  const current_title = event.currentTarget.innerText;
  let fragment = new DocumentFragment();
  fragment = render_form_for_edit_title_list(fragment, current_title);

  event.currentTarget.replaceWith(fragment);
  parent.querySelector("input").focus();
}

function cancel_edit_title_callback(event, current_title) {
  if (event.key === "Escape") {
    let p_element = create_title_for_list(current_title);

    event.currentTarget.replaceWith(p_element);
  }
}

function create_title_for_list(current_title) {
  let p_element = document.createElement("p");
  p_element.className = "list_name";
  p_element.innerText = current_title;

  p_element.addEventListener("click", modify_title_of_list_callback);

  return p_element;
}

function edit_title_api_callback(event) {
  event.preventDefault();
  let target = event.currentTarget;
  const new_title = target.querySelector("input").value;
  if (/^\w+/.test(new_title)) {
    const board_id = capture_board_id();
    const list_id = target.closest(".list").getAttribute("list_id");
    patch_protected_url(
      `http://localhost:3000/boards/${board_id}/lists/${list_id}`,
      { name: new_title }
    ).then(([status, data]) => {
      if (status == "error") {
        console.log(data);
      } else {
        let p_element = create_title_for_list(new_title);

        target.replaceWith(p_element);
      }
    });
  }
}

function delete_list_api_callback(event) {
  const target = event.currentTarget.closest(".list");
  const list_id = target.getAttribute("list_id");
  const board_id = capture_board_id();
  delete_protected_url(
    `http://localhost:3000/boards/${board_id}/lists/${list_id}`
  ).then((status) => {
    if (status == "error") {
      return;
    } else {
      target.remove();
    }
  });
}

function render_form_to_create_card_callback(event) {
  const target = event.currentTarget;
  let fragment = new DocumentFragment();

  fragment = render_form_option_to_create_card(fragment);

  target.replaceWith(fragment);
}

function reset_render_form_to_create_card_callback(event) {
  event.preventDefault();
  const target = event.currentTarget.closest(".create_form_options");
  let fragment = new DocumentFragment();

  fragment = render_create_card_option(fragment);

  target.replaceWith(fragment);
}

function create_card_api_callback(event) {
  event.preventDefault();
  const target = event.currentTarget;
  const card_name = target.querySelector("input").value;
  if (/^\w+/.test(card_name)) {
    const list_id = target.closest(".list").getAttribute("list_id");
    const div_form = target.closest(".create_form_options");
    const next_pos = parseInt(div_form.previousSibling.getAttribute("pos")) + 1;
    const hash = {
      name: card_name,
      pos: next_pos,
    };
    post_protected_url(
      `http://localhost:3000/lists/${list_id}/cards`,
      hash
    ).then(([status, data]) => {
      if (status === "error") {
        console.log(data);
      } else {
        data.checkItems = 0;
        let fragment = new DocumentFragment();

        fragment = render_card(fragment, data);
        fragment = render_create_card_option(fragment);

        fragment = div_form.replaceWith(fragment);
      }
    });
  }
}
