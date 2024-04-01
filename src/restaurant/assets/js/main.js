// render menu items from api
document.addEventListener("DOMContentLoaded", () => {
  const cart = [];

  const addToCart = (item) => {
    const existingItem = cart.find((cartItem) => cartItem.name === item.name);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.push({ ...item, quantity: 1 });
    }
    renderCart();
  };

  const renderCart = () => {
    const cartItemsContainer = document.getElementById("cartItems");
    cartItemsContainer.innerHTML = "";

    cart.forEach((item) => {
      cartItemsContainer.innerHTML += `<div>${item.name} ${
        item.quantity > 1 ? `x${item.quantity}` : ""
      } - £${(item.price * item.quantity).toFixed(2)}</div>`;
    });

    renderSubtotal();
  };

  const renderSubtotal = () => {
    const subtotalContainer = document.getElementById("subtotal");
    const subtotal = cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    subtotalContainer.textContent = `Subtotal: £${subtotal.toFixed(2)}`;
  };

  fetch(
    "https://raw.githubusercontent.com/virejdasani/BistroSync/main/src/api/menu.json"
  )
    .then((response) => response.json())
    .then((data) => {
      const breakfastItemsContainer = document.getElementById("breakfastItems");
      const mainItemsContainer = document.getElementById("mainItems");
      const dinnerItemsContainer = document.getElementById("dinnerItems");
      const drinksItemsContainer = document.getElementById("drinksItems");

      // function to create html for a menu item
      const createMenuItemHTML = (item) => {
        const showBlackBanner = item.idCheck || item.vegan;
        const blackBannerText = item.idCheck ? "18+" : "VEG";

        return `
          <article class="hoodies">
            ${
              showBlackBanner
                ? `<div class="hoodies_sale">${blackBannerText}</div>`
                : ""
            }
            <img src="${item.image}" alt="" class="hoodies_img">
            <span class="hoodie_name">${item.name}</span>
            <p class="collection_desc">${item.description}</p>
            <span class="hoodie_price">£${item.price.toFixed(2)}</span>
            <button class="button-light addToCartButton" data-name="${
              item.name
            }" data-price="${
          item.price
        }">Add to basket<i class='bx bx-right-arrow button-icon'></i></button>
          </article>
        `;
      };

      // populate breakfast items
      const breakfastItems = data.menu.breakfast;
      Object.keys(breakfastItems).forEach((key) => {
        const menuItem = breakfastItems[key];
        const menuItemHTML = createMenuItemHTML(menuItem);
        breakfastItemsContainer.innerHTML += menuItemHTML;
      });

      // populate main items
      const mainItems = data.menu.mainItems;
      Object.keys(mainItems).forEach((key) => {
        const menuItem = mainItems[key];
        const menuItemHTML = createMenuItemHTML(menuItem);
        mainItemsContainer.innerHTML += menuItemHTML;
      });

      // populate dinner items
      const dinnerItems = data.menu.dinner;
      Object.keys(dinnerItems).forEach((key) => {
        const menuItem = dinnerItems[key];
        const menuItemHTML = createMenuItemHTML(menuItem);
        dinnerItemsContainer.innerHTML += menuItemHTML;
      });

      // populate drinks items
      const drinksItems = data.menu.drinks;
      Object.keys(drinksItems).forEach((key) => {
        const menuItem = drinksItems[key];
        const menuItemHTML = createMenuItemHTML(menuItem);
        drinksItemsContainer.innerHTML += menuItemHTML;
      });

      // add event listeners to "Add to basket" buttons
      const addToCartButtons = document.querySelectorAll(".addToCartButton");
      addToCartButtons.forEach((button) => {
        button.addEventListener("click", () => {
          const name = button.getAttribute("data-name");
          const price = parseFloat(button.getAttribute("data-price"));
          addToCart({ name, price });
        });
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
