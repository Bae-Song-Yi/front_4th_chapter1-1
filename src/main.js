import { Router } from "./router/router";
import { MainPage } from "./pages/MainPage";
import { LoginPage } from "./pages/LoginPage";
import { ProfilePage } from "./pages/ProfilePage";
import { ErrorPage } from "./pages/ErrorPage";

window.addEventListener("DOMContentLoaded", () => {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    console.error("Root element not found");
    return;
  }

  const checkAuth = () => {
    const user = localStorage.getItem("user");
    if (!user) {
      window.history.pushState({}, "", "/login");
      render("/login");
      return false;
    }
    return true;
  };

  const routes = {
    "/": MainPage,
    "/login": () => {
      if (localStorage.getItem("user")) {
        window.history.pushState({}, "", "/");
        render("/");
        return;
      }
      return LoginPage();
    },
    "/profile": () => {
      if (checkAuth()) {
        return ProfilePage();
      }
    },
    404: ErrorPage,
  };

  const render = (path) => {
    const component = routes[path] || routes[404];
    rootElement.innerHTML = component();
  };

  const handleNavigation = (path) => {
    window.history.pushState({}, "", path);
    render(path);
  };

  // 페이지 초기 렌더링
  render(window.location.pathname);

  // popstate 이벤트 처리 (뒤로가기/앞으로가기)
  window.addEventListener("popstate", () => {
    render(window.location.pathname);
  });

  // 모든 링크 클릭 이벤트 처리
  document.addEventListener("click", (e) => {
    const anchor = e.target.closest("a");
    if (anchor && anchor.getAttribute("href")) {
      e.preventDefault();
      const href = anchor.getAttribute("href");
      if (href !== "#") {
        handleNavigation(href);
      }
    }
  });

  const router = new Router(routes);
  router.addEventListeners();
});
