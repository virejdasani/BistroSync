// fetch this API: https://raw.githubusercontent.com/virejdasani/BistroSync/main/api/menu.json?

// Function to fetch menu items from the API and render them
async function fetchAndRenderMenu() {
  try {
    const response = await fetch(
      "https://raw.githubusercontent.com/virejdasani/BistroSync/main/api/menu.json?"
    );
    const menuItems = await response.json();
    const menuContainer = document.getElementById("menuContainer");

    // Iterate through each menu item and create HTML elements
    menuItems.forEach((item) => {
      const article = document.createElement("article");
      article.className = "hoodies";

      const divSale = document.createElement("div");
      divSale.className = "hoodies_sale";
      divSale.textContent = item.label;

      const img = document.createElement("img");
      img.src = item.image;
      img.alt = item.name;
      img.className = "hoodies_img";

      const spanName = document.createElement("span");
      spanName.className = "hoodie_name";
      spanName.textContent = item.name;

      const pDesc = document.createElement("p");
      pDesc.className = "collection_desc";
      pDesc.textContent = item.description;

      const spanPrice = document.createElement("span");
      spanPrice.className = "hoodie_price";
      spanPrice.textContent = `£${item.price}`;

      const aButton = document.createElement("a");
      aButton.href = "#";
      aButton.className = "button-light";
      aButton.textContent = "Add to basket";
      const buttonIcon = document.createElement("i");
      buttonIcon.className = "bx bx-right-arrow button-icon";
      aButton.appendChild(buttonIcon);

      // Append all elements to the article
      article.appendChild(divSale);
      article.appendChild(img);
      article.appendChild(spanName);
      article.appendChild(pDesc);
      article.appendChild(spanPrice);
      article.appendChild(aButton);

      // Append the article to the menu container
      menuContainer.appendChild(article);
    });
  } catch (error) {
    console.error("Error fetching menu:", error);
  }
}

// Call the function to fetch and render menu items
fetchAndRenderMenu();

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
