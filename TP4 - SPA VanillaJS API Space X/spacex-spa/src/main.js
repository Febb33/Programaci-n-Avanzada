
import { renderDetail } from "./components/detail.js";
import { renderHome } from "./components/home.js";
// import './style.css';

async function router() {
  const app = document.getElementById("app");
  const hash = window.location.hash || "#/home";

  if (hash.startsWith("#/launch/")) {
    const id = hash.split("/")[2];
    renderDetail(app, id);
  } else {
    renderHome(app);
  }
}

window.addEventListener("hashchange", router);
window.addEventListener("load", router);
