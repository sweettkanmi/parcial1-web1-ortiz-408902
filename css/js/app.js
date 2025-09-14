document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".tab");
  const views = document.querySelectorAll(".view");
  const postsContainer = document.getElementById("posts");
  const postForm = document.getElementById("postForm");
  const postText = document.getElementById("postText");

  function showView(name) {
    views.forEach(v => v.id === name ? v.classList.remove("hidden") : v.classList.add("hidden"));
    tabs.forEach(t => t.dataset.route === name ? t.classList.add("active") : t.classList.remove("active"));
    history.pushState({route: name}, "", `#${name}`);
  }

  function initRoute() {
    const hash = location.hash.replace("#", "") || "muro";
    showView(hash);
  }

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const route = tab.dataset.route;
      showView(route);
    });
  });

  window.addEventListener("popstate", (ev) => {
    const route = (ev.state && ev.state.route) || location.hash.replace("#","") || "muro";
    document.querySelectorAll(".view").forEach(v => v.id === route ? v.classList.remove("hidden") : v.classList.add("hidden"));
    document.querySelectorAll(".tab").forEach(t => t.dataset.route === route ? t.classList.add("active") : t.classList.remove("active"));
  });

  const seed = [
    {id:1, name:"Nombre", date:"20 abr", text:"Este es un post de ejemplo."},
    {id:2, name:"Nombre", date:"11:46pm", text:"Otro comentario de ejemplo."}
  ];

  function renderPosts(){
    postsContainer.innerHTML = "";
    seed.slice().reverse().forEach(p => {
      const el = document.createElement("div");
      el.className = "post";
      el.innerHTML = `
        <div class="pa-avatar" aria-hidden="true"></div>
        <div class="pa-body">
          <h4>${p.name} <small style="display:block;font-size:.9rem;color:#4d7ab6">${p.date}</small></h4>
          <p>${escapeHtml(p.text)}</p>
          <div style="display:flex;gap:10px;margin-top:8px">
            <button class="btn">Me gusta</button>
            <button class="btn">Compartir</button>
          </div>
        </div>
      `;
      postsContainer.appendChild(el);
    });
  }

  postForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = postText.value.trim();
    if(!text) return alert("Escribe algo antes de compartir.");
    seed.push({id:Date.now(), name:"Tú", date: new Date().toLocaleString(), text});
    postText.value = "";
    renderPosts();
    showView("muro");
  });

  function escapeHtml(unsafe) {
    return unsafe.replace(/[&<"'>]/g, function(m) {
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m];
    });
  }
  renderPosts();
  initRoute();
});
