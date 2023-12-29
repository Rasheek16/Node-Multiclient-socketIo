import { Router } from "express";
import { checkAuth } from "./check-Auth.js";

export default function init(logoutWebsocket) {
  const router = Router();

  router.get("/", (request, response) => {
    response.render("login");
  });

  router.post("/login", (request, response) => {
    const user = request.body.username;
    const pw = request.body.password;

    if (user === "u1" && pw === "test") {
      request.session.user = "u1";
    } else if (user === "u2" && pw === "test") {
      request.session.user = "u2";
    }
    response.redirect("/chat");
  });

  router.get("/chat", checkAuth, (request, response) => {
    response.render("chat", { user: request.session.user });
    console.log(request.session.user);
  });

  router.get("/logout", (request, response) => {
    logoutWebsocket(request.session.user);
    delete request.session.user;
    response.redirect("/");
  });
  return router;
}

