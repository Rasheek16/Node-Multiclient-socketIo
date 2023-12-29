export function checkAuth(request, response, next) {
  if (!request.session.user) {
    response.redirect("/");
  } else {
    next();
  }
}
