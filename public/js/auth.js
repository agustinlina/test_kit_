// Si hay sesión, inyectamos header con (usuario + avatar) a la izquierda y botón a la derecha
if (session && !isLogin) {
  // ---- Avatar + nombre de usuario (izquierda) ----
  var userBox = document.createElement('div')
  userBox.style.display = 'flex'
  userBox.style.alignItems = 'center'
  userBox.style.gap = '8px'
  userBox.style.color = '#e9c500'
  userBox.style.fontWeight = '600'

  var userImg = new Image()
  userImg.src = './media/user.svg'     // <-- asegurate de tener este ícono en /media (puede ser .png/.svg)
  userImg.alt = 'Usuario'
  userImg.loading = 'lazy'
  userImg.decoding = 'async'
  userImg.style.width = '20px'
  userImg.style.height = '20px'
  userImg.style.pointerEvents = 'none'
  userImg.style.userSelect = 'none'
  userImg.setAttribute('aria-hidden', 'true')

  var userName = document.createElement('span')
  var usuario = (session && session.usuario) ? String(session.usuario).trim() : 'Usuario'
  userName.textContent = usuario

  userBox.appendChild(userImg)
  userBox.appendChild(userName)

  // ---- Botón cerrar sesión (derecha) ----
  var btn = document.createElement('button')
  btn.style.display = 'flex'
  btn.style.alignItems = 'center'
  btn.style.gap = '6px'
  btn.style.padding = '4px 8px'
  btn.style.border = '2px solid #e9c500'
  btn.style.borderRadius = '8px'
  btn.style.backgroundColor = 'transparent'
  btn.style.color = '#e9c500'
  btn.style.cursor = 'pointer'
  btn.style.outline = 'none'

  var img = new Image()
  img.src = './media/exit.svg' // ícono para cerrar sesión
  img.alt = 'Cerrar sesión'
  img.loading = 'lazy'
  img.decoding = 'async'
  img.style.height = '20px'
  img.style.width = '20px'
  img.style.pointerEvents = 'none'

  var text = document.createElement('span')
  text.textContent = 'Cerrar sesión'

  btn.appendChild(img)
  btn.appendChild(text)

  btn.addEventListener('mouseenter', function () {
    btn.style.color = '#937d00ff'
    btn.style.borderColor = '#937d00ff'
    img.style.opacity = '0.75'
  })
  btn.addEventListener('mouseleave', function () {
    btn.style.color = '#e9c500'
    btn.style.borderColor = '#e9c500'
    img.style.opacity = '1'
  })
  btn.addEventListener('click', function () {
    try { localStorage.removeItem('sessionUser') } catch {}
    try { sessionStorage.removeItem('nextAfterLogin') } catch {}
    location.replace(loginURL)
  })

  function mount () {
    var wrap = document.getElementById('session-wrap')
    if (!wrap) {
      wrap = document.createElement('div')
      wrap.id = 'session-wrap'
      // 👇 Flex con extremos y centrado vertical
      wrap.className = 'w-100 d-flex justify-content-between align-items-center'
      wrap.style.backgroundColor = '#233475'
      wrap.style.borderBottom = '1px solid #16245acc'
      wrap.style.padding = '6px 10px'
      wrap.style.minHeight = '44px'
      document.body.prepend(wrap)
    }
    wrap.innerHTML = '' // evita duplicados
    wrap.appendChild(userBox) // izquierda: avatar + nombre
    wrap.appendChild(btn)     // derecha: botón
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount)
  } else {
    mount()
  }
}
