// render menu items from api
document.addEventListener("DOMContentLoaded", function () {
  fetch(
    "https://raw.githubusercontent.com/virejdasani/BistroSync/main/src/api/menu.json?"
  )
    .then((response) => response.json())
    .then((data) => {
      const menuContainer = document.getElementById("menuContainer");

      // loop through each category in the menu
      for (const category in data.menu) {
        if (data.menu.hasOwnProperty(category)) {
          const items = data.menu[category];

          // loop through each item in the category
          for (const itemName in items) {
            if (items.hasOwnProperty(itemName)) {
              const item = items[itemName];

              // create html elements for the menu item
              const article = document.createElement("article");
              article.className = "hoodies";
              const divSale = document.createElement("div");
              divSale.className = "hoodies_sale";
              divSale.textContent = item.idCheck ? "" : "18+";
              divSale.textContent = item.vegan ? "Ve" : "";
              const img = document.createElement("img");
              img.src = `./images/${item.image}.png`;
              img.alt = "";
              img.className = "hoodies_img";
              const spanName = document.createElement("span");
              spanName.className = "hoodie_name";
              spanName.textContent = item.name;
              const pDesc = document.createElement("p");
              pDesc.className = "collection_desc";
              pDesc.textContent = item.description;
              const spanPrice = document.createElement("span");
              spanPrice.className = "hoodie_price";
              spanPrice.textContent = `£${(item.price / 100).toFixed(2)}`;
              const a = document.createElement("a");
              a.href = "#";
              a.className = "button-light";
              a.textContent = "Add to basket";
              const i = document.createElement("i");
              i.className = "bx bx-right-arrow button-icon";

              // append elements to the article
              a.appendChild(i);
              article.appendChild(divSale);
              article.appendChild(img);
              article.appendChild(spanName);
              article.appendChild(pDesc);
              article.appendChild(spanPrice);
              article.appendChild(a);

              // Append article to the menu container
              menuContainer.appendChild(article);
            }
          }
        }
      }
    })
    .catch((error) => {
      console.error("Error fetching menu:", error);
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
