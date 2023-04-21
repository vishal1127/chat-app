console.log("in m on");
import { setTimeout } from "timers/promises";
const myModal = new bootstrap.Modal("#groupChatModal", {
  keyboard: false,
});
const tooltipTriggerList = document.querySelectorAll(
  '[data-bs-toggle="tooltip"]'
);
const tooltipList = [...tooltipTriggerList].map(
  (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
);

window.openModal = function () {
  myModal.show();
};

window.hideModal = function () {
  myModal.hide();
};
async function fun1() {
  console.log("a");

  console.log("b");

  await setTimeout(() => console.log("c"), 1000);

  await setTimeout(() => console.log("d"), 0);

  console.log("e");
}

fun1();
