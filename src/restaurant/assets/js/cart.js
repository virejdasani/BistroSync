// function to check if string is alphabetic
function isAlphabetic(str) {
  return /^[a-zA-Z\s]+$/.test(str);
}

// function to check if string is integer
function isInteger(str) {
  return /^\d+$/.test(str);
}

// render menu items from api
document.addEventListener("DOMContentLoaded", () => {
  const restaurant = window.location.pathname.split("/")[1];
  document.getElementById("restaurantName").textContent = restaurant;

  const cart = [];

  const addToCart = (item) => {
    const existingItem = cart.find((cartItem) => cartItem.name === item.name);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.push({ ...item, quantity: 1 });
    }
    renderCart();

    // notify user with what they added to cart
    notifier.success(item.name);
  };

  const removeFromCart = (itemName) => {
    const index = cart.findIndex((item) => item.name === itemName);
    if (index !== -1) {
      // remove item from cart
      cart.splice(index, 1);
      notifier.warning(itemName);

      // update cart count on cart icon
      const cartCount = document.getElementById("cartCount");
      cartItems = cart.reduce((total, item) => total + item.quantity, 0);
      cartCount.textContent = cartItems + " items";

      renderCart();
    }
  };

  const handleCheckoutButton = () => {
    // console.log(cart);

    const tableNumber = document.getElementById("tableNumber").value;
    const cardHolderName = document.getElementById("cardHolderName").value;

    if (!cardHolderName) {
      notifier.alert("Please enter card holder name");
      return;
    }

    if (!isAlphabetic(cardHolderName)) {
      notifier.alert("Please enter a valid name");
      return;
    }

    if (!tableNumber) {
      notifier.alert(
        "Please enter your table number that is printed on your table"
      );
      return;
    }

    if (!isInteger(tableNumber.toString())) {
      notifier.alert("Please enter a valid table number");
      return;
    }

    if (cart.length === 0) {
      notifier.alert("Your cart is empty");
      return;
    }

    const cartCount = document.getElementById("cartCount");
    cartCount.textContent = "0 items";

    // add this to mongodb
    const restaurant = window.location.pathname.split("/")[1];
    fetch(`/${restaurant}/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ items: cart, tableNumber, cardHolderName }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "ok") {
          notifier.info("Your order will be served shortly");
          cart.length = 0; // clear cart
          renderCart();
          toggleModal();
        }
      })
      .catch((error) => console.error("Error checking out:", error));
  };

  // attach delete button event listeners
  const attachDeleteButtonListeners = () => {
    const deleteButtons = document.querySelectorAll(".deleteButton");
    deleteButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const name = button.getAttribute("data-name");
        removeFromCart(name);
      });
    });
  };

  const renderCart = () => {
    const cartItemsContainer = document.getElementById("cartItems");
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = "<div>No items in cart</div>";
    } else {
      cartItemsContainer.innerHTML = "";
      cart.forEach((item) => {
        cartItemsContainer.innerHTML += `
          <div class="cartItem">
            ${item.name} ${item.quantity > 1 ? `x${item.quantity}` : ""} - £${(
          item.price * item.quantity
        ).toFixed(2)}
            <button class="deleteButton" data-name="${
              item.name
            }"><a class="bx trigger bx-trash"></a></li></button>
          </div>
        `;

        const tableNumberInput = document.getElementById("tableNumberInput");
        const cardHolderNameInput = document.getElementById(
          "cardHolderNameInput"
        );

        // add table number input
        tableNumberInput.innerHTML = `
          <div>
            Table Number: <input type="text" id="tableNumber">
          </div>
        `;

        // add card holder name input
        cardHolderNameInput.innerHTML = `
          <div>
            Card Holder Name: <input type="text" id="cardHolderName">
          </div>
        `;
      });
    }

    renderSubtotal();

    // add pay now button
    payNowButtonContainer.innerHTML = `
    <button id="payNowButton">Pay Now</button>
    `;

    // Attach event listener to pay now button
    const payNowButton = document.getElementById("payNowButton");
    if (payNowButton) {
      payNowButton.addEventListener("click", handleCheckoutButton);
    }

    attachDeleteButtonListeners(); // attach delete button event listeners
  };

  const renderSubtotal = () => {
    const subtotalContainer = document.getElementById("subtotal");
    const subtotal = cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    subtotalContainer.textContent = `Subtotal: £${subtotal.toFixed(2)}`;
  };

  // call when the DOM content is loaded
  renderCart();

  // fetch menu data
  fetch(
    "https://raw.githubusercontent.com/virejdasani/BistroSync/main/src/api/menu.json"
  )
    .then((response) => response.json())
    .then((data) => {
      const breakfastItemsContainer = document.getElementById("breakfastItems");
      const mainItemsContainer = document.getElementById("mainItems");
      const dessertsItemsContainer = document.getElementById("dessertsItems");
      const drinksItemsContainer = document.getElementById("drinksItems");

      // function to create HTML for a menu item
      const createMenuItemHTML = (item) => {
        const showBlackBanner = item.idCheck || item.vegan;
        const blackBannerText = item.idCheck ? "18+" : "VEG";

        return `
          <article class="menuItemArticle">
            ${
              showBlackBanner
                ? `<div class="articleBlackBanner">${blackBannerText}</div>`
                : ""
            }
            <img src="${item.image}" alt="" class="foodItem_img">
            <span class="foodItem_name">${item.name}</span>
            <p class="collection_desc">${item.description}</p>
            <span class="foodItem_price">£${item.price.toFixed(2)}</span>
            <button class="button-light addToCartButton" data-name="${
              item.name
            }" data-price="${item.price}" data-foodId=${item.id}">
            Add to Cart<i class='bx bx-right-arrow button-icon'></i></button>
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

      // populate desserts items
      const dessertsItems = data.menu.desserts;
      Object.keys(dessertsItems).forEach((key) => {
        const menuItem = dessertsItems[key];
        const menuItemHTML = createMenuItemHTML(menuItem);
        dessertsItemsContainer.innerHTML += menuItemHTML;
      });

      // populate drinks items
      const drinksItems = data.menu.drinks;
      Object.keys(drinksItems).forEach((key) => {
        const menuItem = drinksItems[key];
        const menuItemHTML = createMenuItemHTML(menuItem);
        drinksItemsContainer.innerHTML += menuItemHTML;
      });

      // add event listeners to add to basket buttons
      const addToCartButtons = document.querySelectorAll(".addToCartButton");
      addToCartButtons.forEach((button) => {
        button.addEventListener("click", () => {
          const name = button.getAttribute("data-name");
          const price = parseFloat(button.getAttribute("data-price"));
          const foodId = parseInt(button.getAttribute("data-foodId"));
          const cartCount = document.getElementById("cartCount");
          cartCount.textContent =
            parseInt(cartCount.textContent) + 1 + " items";
          addToCart({ name, price, foodId });
        });
      });
    })
    .catch((error) => console.error("Error fetching menu:", error));
});
