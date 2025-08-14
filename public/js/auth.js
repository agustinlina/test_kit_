// root/public/js/auth.js
;(function () {
  // Detectar si estamos en /login o /login.html
  var path = location.pathname
  var isLogin = /\/login(?:\.html)?$/.test(path)

  // Cargar sesión
  var raw = null,
    session = null
  try {
    raw = localStorage.getItem('sessionUser')
    session = raw ? JSON.parse(raw) : null
  } catch (e) {
    session = null
  }

  // Construir URL absoluta de login
  var loginURL = new URL('/login.html', window.location.origin).toString()

  // Si NO hay sesión y NO es login -> redirigimos YA (la página está oculta por CSS, no se ve nada)
  if (!session && !isLogin) {
    try {
      sessionStorage.setItem(
        'nextAfterLogin',
        location.pathname + location.search
      )
    } catch {}
    location.replace(loginURL)
    return // evitamos ejecutar más
  }

  // Si HAY sesión y estamos en login -> volver a donde quería ir o al home
  if (session && isLogin) {
    var next = sessionStorage.getItem('nextAfterLogin') || '/'
    try {
      sessionStorage.removeItem('nextAfterLogin')
    } catch {}
    location.replace(next)
    return
  }

  // En este punto:
  //  - hay sesión (y no es login), o
  //  - es el login (y puede no haber sesión)
  // -> Mostramos el documento (removiendo la ocultación por CSS).
  try {
    // visibility:visible tiene prioridad local sobre el CSS base.
    document.documentElement.style.visibility = 'visible'
  } catch (e) {}

  // Si hay sesión, inyectamos botón "Cerrar sesión"
if (session && !isLogin) {
  var btn = document.createElement('button');
  btn.textContent = 'Cerrar sesión';
  btn.style.padding = '4px 0px';
  btn.style.borderRadius = '10px';
  btn.style.backgroundColor = 'transparent';
  btn.style.color = '#e9c500';
  btn.style.cursor = 'pointer';
  btn.style.border = 'none';     // sin bordes
  btn.style.outline = 'none';    // sin outline al enfocar

  btn.addEventListener('mouseenter', function () {
    btn.style.color = '#937d00ff';
  });
  btn.addEventListener('mouseleave', function () {
    btn.style.background = 'transparent'; // vuelve a transparente
  });
  btn.addEventListener('click', function () {
    try { localStorage.removeItem('sessionUser'); } catch {}
    try { sessionStorage.removeItem('nextAfterLogin'); } catch {}
    location.replace(loginURL);
  });

  function mount () {
    var wrap = document.getElementById('session-wrap');
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.id = 'session-wrap';
      wrap.className = 'w-100 d-flex justify-content-end p-2'; // Bootstrap: alineado a la derecha
      wrap.style.backgroundColor = '#233475';
      document.body.prepend(wrap); // primero dentro de <body>
    }
    wrap.innerHTML = '';           // evita duplicados
    wrap.appendChild(btn);         // botón dentro del contenedor
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
}

})()
