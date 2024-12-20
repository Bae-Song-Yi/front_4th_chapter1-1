export class Router {
  constructor(routes) {
    this.routes = routes;
    this.rootElement = document.getElementById("root");

    if (!this.rootElement) {
      throw new Error("Root element not found");
    }

    // 페이지 초기 렌더링
    this.render(window.location.pathname);

    // popstate 이벤트 처리 (뒤로가기/앞으로가기)
    window.addEventListener("popstate", () => {
      this.render(window.location.pathname);
    });

    // 모든 링크 클릭 이벤트 처리
    document.addEventListener("click", (e) => {
      const anchor = e.target.closest("a");
      if (anchor && anchor.getAttribute("href")) {
        e.preventDefault();
        const href = anchor.getAttribute("href");
        if (href !== "#") {
          this.navigate(href);
        }
      }
    });
  }

  // 경로 이동
  navigate(path) {
    window.history.pushState({}, "", path);
    this.render(path);
  }

  // 현재 경로에 맞는 컴포넌트 렌더링
  render(path) {
    const component = this.routes[path] || this.routes[404];
    if (typeof component === "function") {
      this.rootElement.innerHTML = component();
      this.addEventListeners(); // 렌더링 후 이벤트 리스너 추가
    } else {
      console.error("Invalid route component");
    }
  }

  // 이벤트 리스너 추가
  addEventListeners() {
    // 로그아웃 버튼 이벤트
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("user"); // 로컬스토리지에서 사용자 정보 제거
        this.navigate("/login"); // 로그인 페이지로 리다이렉트
      });
    }

    // 로그인 폼 제출 이벤트
    console.log(window.location.pathname);
    const loginForm = document.querySelector(".login-btn");
    if (loginForm) {
      loginForm.addEventListener("click", (e) => {
        e.preventDefault();
        const username = document
          .querySelector('input[type="text"]')
          .value.trim();
        if (username) {
          localStorage.setItem("user", JSON.stringify({ username }));
          this.navigate("/profile");
        }
      });
    }
  }
}
