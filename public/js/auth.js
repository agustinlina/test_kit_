(function () {
  const isLogin = location.pathname.endsWith("/login.html") || location.pathname.endsWith("/login");

  const raw = localStorage.getItem("sessionUser");
  const session = raw ? (() => { try { return JSON.parse(raw); } catch { return null; } })() : null;

  // Redirección absoluta a login
  const loginURL = new URL('/login.html', window.location.origin).toString();

  if (!session && !isLogin) {
    try { sessionStorage.setItem("nextAfterLogin", location.pathname + location.search); } catch {}
    location.replace(loginURL);
    return;
  }

  if (isLogin && session) {
    const next = sessionStorage.getItem("nextAfterLogin") || "/";
    sessionStorage.removeItem("nextAfterLogin");
    location.replace(next);
    return;
  }

  if (session && !isLogin) {
    const btn = document.createElement("button");
    btn.textContent = "Cerrar sesión";
    btn.style.position = "fixed";
    btn.style.top = "8px";
    btn.style.left = "8px";
    btn.style.zIndex = "2147483647";
    btn.style.padding = "8px 12px";
    btn.style.borderRadius = "10px";
    btn.style.border = "1px solid #2a2f3e";
    btn.style.background = "#161b26";
    btn.style.color = "#e6e6e6";
    btn.style.cursor = "pointer";
    btn.addEventListener("mouseenter", () => btn.style.background = "#1d2330");
    btn.addEventListener("mouseleave", () => btn.style.background = "#161b26");
    btn.addEventListener("click", () => {
      localStorage.removeItem("sessionUser");
      sessionStorage.removeItem("nextAfterLogin");
      location.replace(loginURL);
    });
    document.body.appendChild(btn);
  }
})();
