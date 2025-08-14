// root/public/js/auth.js
(function () {
  // Detectar si estamos en /login o /login.html
  var path = location.pathname;
  var isLogin = /\/login(?:\.html)?$/.test(path);

  // Cargar sesión
  var raw = null, session = null;
  try {
    raw = localStorage.getItem("sessionUser");
    session = raw ? JSON.parse(raw) : null;
  } catch (e) {
    session = null;
  }

  // Construir URL absoluta de login
  var loginURL = new URL('/login.html', window.location.origin).toString();

  // Si NO hay sesión y NO es login -> redirigimos YA (la página está oculta por CSS, no se ve nada)
  if (!session && !isLogin) {
    try { sessionStorage.setItem("nextAfterLogin", location.pathname + location.search); } catch {}
    location.replace(loginURL);
    return; // evitamos ejecutar más
  }

  // Si HAY sesión y estamos en login -> volver a donde quería ir o al home
  if (session && isLogin) {
    var next = sessionStorage.getItem("nextAfterLogin") || "/";
    try { sessionStorage.removeItem("nextAfterLogin"); } catch {}
    location.replace(next);
    return;
  }

  // En este punto:
  //  - hay sesión (y no es login), o
  //  - es el login (y puede no haber sesión)
  // -> Mostramos el documento (removiendo la ocultación por CSS).
  try {
    // visibility:visible tiene prioridad local sobre el CSS base.
    document.documentElement.style.visibility = 'visible';
  } catch (e) {}

  // Si hay sesión, inyectamos botón "Cerrar sesión"
  if (session && !isLogin) {
    var btn = document.createElement("button");
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
    btn.addEventListener("mouseenter", function(){ btn.style.background = "#1d2330"; });
    btn.addEventListener("mouseleave", function(){ btn.style.background = "#161b26"; });
    btn.addEventListener("click", function () {
      try { localStorage.removeItem("sessionUser"); } catch {}
      try { sessionStorage.removeItem("nextAfterLogin"); } catch {}
      location.replace(loginURL);
    });
    document.addEventListener('DOMContentLoaded', function () {
      document.body.appendChild(btn);
    });
  }
})();
