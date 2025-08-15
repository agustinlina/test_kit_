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
  var btn = document.createElement('button')
  btn.style.display = 'flex' // para que imagen y texto estén alineados
  btn.style.alignItems = 'center'
  btn.style.gap = '6px' // separación entre imagen y texto
  btn.style.padding = '4px 8px'
  btn.style.border = '2px solid #e9c500' // borde visible
  btn.style.borderRadius = '8px'
  btn.style.backgroundColor = 'transparent'
  btn.style.color = '#e9c500'
  btn.style.cursor = 'pointer'
  btn.style.outline = 'none'

  // Imagen dentro del botón
  var img = new Image()
  img.src = './media/exit.svg' // ajusta si es otro nombre
  img.alt = 'Cerrar sesión'
  img.loading = 'lazy'
  img.decoding = 'async'
  img.style.height = '20px'
  img.style.width = '20px'
  img.style.pointerEvents = 'none' // para que no bloquee el clic del botón

  // Texto del botón
  var text = document.createElement('span')
  text.textContent = 'Cerrar sesión'

  btn.appendChild(img)
  btn.appendChild(text)

  btn.addEventListener('mouseenter', function () {
    btn.style.color = '#937d00ff'
    btn.style.borderColor = '#937d00ff'
  })
  btn.addEventListener('mouseleave', function () {
    btn.style.color = '#e9c500'
    btn.style.borderColor = '#e9c500'
  })
  btn.addEventListener('click', function () {
    try { localStorage.removeItem('sessionUser') } catch {}
    try { sessionStorage.removeItem('nextAfterLogin') } catch {}
    location.replace(loginURL)
  })

  function mount() {
    var wrap = document.getElementById('session-wrap')
    if (!wrap) {
      wrap = document.createElement('div')
      wrap.id = 'session-wrap'
      wrap.className = 'w-100 d-flex justify-content-end align-items-center'
      wrap.style.backgroundColor = '#233475'
      wrap.style.borderBottom = '1px solid #16245acc'
      wrap.style.padding = '4px'
      document.body.prepend(wrap)
    }
    wrap.innerHTML = ''
    wrap.appendChild(btn)
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount)
  } else {
    mount()
  }
}

})()
