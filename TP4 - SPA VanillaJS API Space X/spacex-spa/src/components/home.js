
let launches = [];

async function getLaunches() {
  if (launches.length === 0) {
    const res = await fetch("https://api.spacexdata.com/v5/launches");
    launches = await res.json();
  }
  return launches;
}

export async function renderHome(container) {
  const data = await getLaunches();
  container.innerHTML = "";

  data.slice(0, 20).forEach(launch => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${launch.links.patch.small || ''}" alt="${launch.name}" />
      <h3>${launch.name}</h3>
    `;
    card.addEventListener("click", () => {
      window.location.hash = `#/launch/${launch.id}`;
    });
    container.appendChild(card);
  });
}
