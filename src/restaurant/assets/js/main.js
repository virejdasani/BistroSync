// fetch this API: https://raw.githubusercontent.com/virejdasani/BistroSync/main/api/menu.json?

// fetch the menu items from the API
fetch(
  "https://raw.githubusercontent.com/virejdasani/BistroSync/main/api/menu.json"
)
  .then((response) => response.json())
  .then((data) => {
    const menu = data.menu;
    const menuContainer = document.querySelector(".menu_container");

    menu.forEach((item) => {
      const menuItem = document.createElement("div");
      menuItem.classList.add("menu_item");

      menuItem.innerHTML = `
      <img src="${item.img}" alt="${item.title}" class="menu_img">
      <div class="menu_content">
        <h3 class="menu_title">${item.title}</h3>
        <span class="menu_price
        ">${item.price}</span>
        <p class="menu_description">${item.desc}</p>
      </div>
      `;
      menuContainer.appendChild(menuItem);
    });
  });

// logic for mobile menu toggle
const showMenu = (toggleId, navId) => {
  const toggle = document.getElementById(toggleId),
    nav = document.getElementById(navId);

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      nav.classList.toggle("show");
    });
  }
};

showMenu("nav-toggle", "nav-menu");

const navLink = document.querySelectorAll(".nav_link"),
  navMenu = document.getElementById("nav-menu");

function linkAction() {
  navMenu.classList.remove("show");
}

navLink.forEach((n) => n.addEventListener("click", linkAction));
