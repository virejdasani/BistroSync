// render menu items from api
document.addEventListener("DOMContentLoaded", () => {
  fetch(
    "https://raw.githubusercontent.com/virejdasani/BistroSync/main/src/api/menu.json"
  )
    .then((response) => response.json())
    .then((data) => {
      const breakfastItemsContainer = document.getElementById("breakfastItems");
      const lunchItemsContainer = document.getElementById("lunchItems");
      const dinnerItemsContainer = document.getElementById("dinnerItems");
      const drinksItemsContainer = document.getElementById("drinksItems");

      // Function to create HTML for a menu item
      const createMenuItemHTML = (item) => {
        const showSale = item.idCheck || item.vegan;
        const saleText = item.idCheck ? "18+" : "VEG";

        return `
          <article class="hoodies">
            ${showSale ? `<div class="hoodies_sale">${saleText}</div>` : ""}
            <img src="${item.image}" alt="" class="hoodies_img">
            <span class="hoodie_name">${item.name}</span>
            <p class="collection_desc">${item.description}</p>
            <span class="hoodie_price">£${item.price.toFixed(2)}</span>
            <a href="#" class="button-light">Add to basket<i class='bx bx-right-arrow button-icon'></i></a>
          </article>
        `;
      };

      // Populate breakfast items
      const breakfastItems = data.menu.breakfast;
      Object.keys(breakfastItems).forEach((key) => {
        const menuItem = breakfastItems[key];
        const menuItemHTML = createMenuItemHTML(menuItem);
        breakfastItemsContainer.innerHTML += menuItemHTML;
      });

      // Populate lunch items
      const lunchItems = data.menu.lunch;
      Object.keys(lunchItems).forEach((key) => {
        const menuItem = lunchItems[key];
        const menuItemHTML = createMenuItemHTML(menuItem);
        lunchItemsContainer.innerHTML += menuItemHTML;
      });

      // Populate dinner items
      const dinnerItems = data.menu.dinner;
      Object.keys(dinnerItems).forEach((key) => {
        const menuItem = dinnerItems[key];
        const menuItemHTML = createMenuItemHTML(menuItem);
        dinnerItemsContainer.innerHTML += menuItemHTML;
      });

      // Populate drinks items
      const drinksItems = data.menu.drinks;
      Object.keys(drinksItems).forEach((key) => {
        const menuItem = drinksItems[key];
        const menuItemHTML = createMenuItemHTML(menuItem);
        drinksItemsContainer.innerHTML += menuItemHTML;
      });
    })
    .catch((error) => console.error("Error fetching menu:", error));
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
