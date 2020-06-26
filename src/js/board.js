import "../styles/board.scss";
import "@babel/polyfill";
import {
  get_protected_url,
  // post_protected_url,
  // patch_protected_url,
  //delete_protected_url,
} from "./components/request_api.js";

refresh_board_content();

function refresh_board_content() {
  const board_id = capture_board_id();

  get_protected_url(`http://localhost:3000/boards/${board_id}`).then(
    ([status, board]) => {
      if (status == "error") {
        window.location.replace("login.html");
      } else {
        set_color_main(board.color);
        // refresh_lists_from_board(board);
        console.log(board);
      }
    }
  );
}

function capture_board_id() {
  const re = /\?board_id\=(\d+)/;
  return re.exec(window.location.href)[1];
}

function set_color_main(color) {
  document.querySelector("main").classList.add(color);
}

// function refresh_lists_from_board(board) {
//   if (board.lists.length === 0) {

//   } else {

//   }
// }
