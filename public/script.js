const $ = (id) => document.getElementById(id)

gamesContainer = $('gamesContainer')

async function fetchGames() {
  try {
    const res = await fetch('/api/games'); // Realiza una solicitud GET al backend.
    const games = await res.json(); // Convierte la respuesta en un array de juegos.

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    // Si no hay usuario logueado, renderizamos sin favoritos
    if (!token || !userId) {
      renderGames(games); 
      return;
    }

    // Si hay usuario logueado, buscamos sus favoritos
    const userRes = await fetch(`/${userId}/favorites`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const user = await userRes.json();
    const favoritosIds = user.favorites.map(fav => fav._id);

    renderGames(games, favoritosIds);

  } catch (err) {
    console.error("Error cargando juegos:", err);
    gamesContainer.innerHTML = "<p class='text-red-500'>Error al cargar los juegos</p>";
  }
}

// Muestra los juegos cada uno en una tarjeta
function renderGames(games, userFavorites = []) {
  gamesContainer.innerHTML = games.map(game => {
    const isFavorite = userFavorites.includes(game._id);
    return `
    <div class="p-4 bg-[#3A4955] rounded shadow text-center w-96">
        <h3 class="text-lg font-bold pb-2 text-white">${game.title}</h3>
        <img src="${game.img}" class="w-[400px] rounded shadow" alt="${game.title}">
        <button 
          class="favorite-btn text-3xl ${isFavorite ? 'text-yellow-400' : 'text-gray-400'}"
          data-id="${game._id}"
          title="Agregar a favoritos">★</button>
        </button>
    </div>
  `;
}).join('');

  addFavoriteListeners();
}

document.addEventListener("DOMContentLoaded", () => {
  $("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
    loginUser();      
  });
});

async function loginUser() {
  const username = $("loginUsername").value;
  const password = $("loginPassword").value;
  const userNameHeader = $("userNameHeader");
  const messageDiv = $("message");
  
  try {
    const res = await fetch('/login', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
  
    const data = await res.json();

    if (data.token) {
      localStorage.setItem("token", data.token); // Guardamos el token
      localStorage.setItem("userId", data.user.id); 
      localStorage.setItem("username", data.user.username)

      userNameHeader.textContent = `Hola, ${data.user.username}!`; 
      loginModal.classList.add("hidden");
      openModalBtn.classList.add("hidden");
      btnExit.classList.remove("hidden")

    } else {
      messageDiv.innerHTML = `<p class='text-red-500 font-bold'>${data.error || "Registrase para iniciar sesion"}</p>`;
    }
  } catch (err) {
      messageDiv.innerHTML = `<p class='text-red-500 font-bold'>Algo salio mal: ${err.message}</p>`;
  }
}

async function checkUserSession() {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const userNameHeader = $("userNameHeader");

  if (token && userId) {
    // Si hay sesión, ocultamos login y mostramos botón de salir
    loginModal.classList.add("hidden");
    openModalBtn.classList.add("hidden");
    btnExit.classList.remove("hidden");

    const username = localStorage.getItem("username");
    if (username) {
      userNameHeader.textContent = `Hola, ${username}!`;
    }
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
    const res = await fetch('/register', {
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

function addFavoriteListeners() {
  document.querySelectorAll(".favorite-btn").forEach(btn => {
    btn.addEventListener("click", async () => {
      const gameId = btn.dataset.id;
      const userId = localStorage.getItem("userId"); // lo guardaste al loguear

      const res = await fetch(`/${userId}/favorite/${gameId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" }
      });

      const data = await res.json();

      if (data.favorites.includes(gameId)) {
        btn.classList.remove("text-gray-400");
        btn.classList.add("text-yellow-400");
      } else {
        btn.classList.remove("text-yellow-400");
        btn.classList.add("text-gray-400");
      }
    });
  });
}

async function showFavoritesBtn(){
  const showFavoritesBtn = $("showFavoritesBtn");

  showFavoritesBtn.addEventListener("click", async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Tenés que iniciar sesión para ver favoritos.");
      return;
    }
  
    try {
      const res = await fetch(`/${userId}/favorites`);
      const data = await res.json();
  
      if (data.favorites) {
        renderGames(data.favorites || [], data.favorites?.map(g => g._id) || []);
      } else {
        gamesContainer.innerHTML = "<p class='text-white'>No tenés juegos favoritos aún.</p>";
      }
    } catch (error) {
      console.error("Error al cargar favoritos:", error);
    }
  });
}

showFavoritesBtn()

document.getElementById("btnExit").addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("username");

  location.reload(); // Refresca la página
});

document.addEventListener("DOMContentLoaded", () => {
  const loginModal = $("loginModal");
  const registerModal = $("registerModal");

  const openLoginBtn = $("openModalBtn");
  const closeLoginBtn = $("closeModalBtn");
  const registerLink = $("registerLink");

  const closeRegisterBtn = $("closeRegisterModalBtn");
  const goToLoginLink = $("goToLogin");

  const homeBtn = document.getElementById("homeBtn");

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

  homeBtn.addEventListener("click", () => {
    fetchGames(); // vuelve a cargar todos los juegos
  });

  // Cerrar modales al hacer clic fuera del contenido
  window.addEventListener("click", (event) => {
    if (event.target === loginModal) loginModal.classList.add("hidden");
    if (event.target === registerModal) registerModal.classList.add("hidden");
  });

  checkUserSession();
  fetchGames(); 
});
