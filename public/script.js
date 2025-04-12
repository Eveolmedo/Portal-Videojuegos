const $ = (id) => document.getElementById(id)

gamesContainer = $('gamesContainer')

async function fetchGames() {
  const res = await fetch('/api/games'); // Realiza una solicitud GET al backend.
  const games = await res.json(); // Convierte la respuesta en un array de juegos.
  renderGames(games); 
}

// Muestra los juegos cada uno en una tarjeta
function renderGames(games) {
  gamesContainer.innerHTML = games.map(game => `
    <div class="p-4 bg-[#3A4955] rounded shadow text-center w-96">
        <h3 class="text-lg font-bold pb-2 text-white">${game.title}</h3>
        <img src="${game.img}" class="w-[400px] rounded shadow" alt="${game.title}">
    </div>
  `).join('');
}

fetchGames()

document.addEventListener("DOMContentLoaded", () => {
  $("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
    loginUser();      
  });
});

async function loginUser() {
  const username = $("loginUsername").value;
  const password = $("loginPassword").value;
  const messageDiv = $("message");
  
  try {
    const res = await fetch('/auth/login', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
  
    const data = await res.json();
  
    if (data.token) {
      localStorage.setItem("token", data.token); // Guardamos el token
      messageDiv.innerHTML = "<p class='text-green-500 font-bold'>Bienvenido!</p>";
    } else {
      messageDiv.innerHTML = `<p class='text-red-500 font-bold'>${data.error || "Registrase para iniciar sesion"}</p>`;
    }
  } catch (err) {
      messageDiv.innerHTML = `<p class='text-red-500 font-bold'>Algo salio mal: ${err.message}</p>`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  $("registerForm").addEventListener("submit", function (e) {
    e.preventDefault();
    registerUser();   
  });
});

async function registerUser() {
  const username = $("registerUsername").value;
  const password = $("registerPassword").value;
  const messageDiv = $("messageRegister");

  console.log({ username, password });

  try {
    const res = await fetch('/auth/register', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (res.ok) {
      messageDiv.innerHTML = "<p class='text-green-500 font-bold'>Bienvenido!</p>";
    } else {
      messageDiv.innerHTML = `<p class='text-red-500 font-bold'>Error: ${data.message || 'No se pudo registrar.'}</p>`;
    }
  } catch (err) {
    messageDiv.innerHTML = `<p class='text-red-500 font-bold'>Algo salió mal: ${err.message}</p>`;
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const loginModal = $("loginModal");
  const registerModal = $("registerModal");

  const openLoginBtn = $("openModalBtn");
  const closeLoginBtn = $("closeModalBtn");
  const registerLink = $("registerLink");

  const closeRegisterBtn = $("closeRegisterModalBtn");
  const goToLoginLink = $("goToLogin");

  openLoginBtn.addEventListener("click", () => {
    loginModal.classList.remove("hidden");
  });

  closeLoginBtn.addEventListener("click", () => {
    loginModal.classList.add("hidden");
  });


  registerLink.addEventListener("click", (e) => {
    e.preventDefault();
    loginModal.classList.add("hidden");
    registerModal.classList.remove("hidden");
  });

  closeRegisterBtn.addEventListener("click", () => {
    registerModal.classList.add("hidden");
  });

  goToLoginLink.addEventListener("click", (e) => {
    e.preventDefault();
    registerModal.classList.add("hidden");
    loginModal.classList.remove("hidden");
  });

  // Cerrar modales al hacer clic fuera del contenido
  window.addEventListener("click", (event) => {
    if (event.target === loginModal) loginModal.classList.add("hidden");
    if (event.target === registerModal) registerModal.classList.add("hidden");
  });
});
