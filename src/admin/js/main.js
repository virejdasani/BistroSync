
document.addEventListener("DOMContentLoaded", () => {
    const restaurant = window.location.pathname.split("/")[1];

    const clearTable = () => {
        return document.getElementById("ordersTableBody").innerHTML = "";
    };

    const attachCompleteButtonListeners = () => {
        const completeBtns = document.querySelectorAll(".completeBtn");
        completeBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                const orderId = btn.parentElement.parentElement.id;
                // get food id
                const foodId = btn.parentElement.parentElement.querySelector("#foodId").textContent;
                console.log("FoodID: " + foodId);
                fetch(`/${restaurant}/admin/orders/${orderId}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ status: "completed", foodId: foodId })
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.status === "ok") {
                            btn.parentElement.parentElement.remove();
                        }
                    })
                    .catch(err => console.error(err));
            });
        });
    }

    const loadOrdersTable = (orders, type) => {
        // Add action header if pending orders
        if (type === "pending") {
            if (!document.getElementById("action-col")) {
                const actionCol = document.createElement("th");
                actionCol.id = "action-col";
                actionCol.textContent = "Action";
                document.querySelector("#ordersTableHead tr").appendChild(actionCol);
            }
            if (!document.getElementById("date-time")) {
                const dateTimeCol = document.createElement("th");
                dateTimeCol.id = "date-time";
                dateTimeCol.textContent = "Date & Time";
                document.getElementById("order-id").insertAdjacentElement("afterend", dateTimeCol);
            }
        }

        else if (type === "past") {
            const actionCol = document.getElementById("action-col");
            if (actionCol) actionCol.remove();
            const dateTimeCol = document.getElementById("date-time");
            if (dateTimeCol) dateTimeCol.textContent = "Date & Time";
        }

        const orderTable = document.getElementById("ordersTableBody");
        orders.forEach(order => {
            const id = order._id.toString().slice(-6);
            order.items.forEach(item => {
                const row = document.createElement("tr");
                row.id = order._id;
                if (type === "pending") {
                    row.innerHTML = `
                        <td>${id}</td>
                        <td>${new Date(order.createdAt).getHours()}:${new Date(order.createdAt).getMinutes()}</td>
                        <td>${order.tableNumber}</td>
                        <td>${item.name}</td>
                        <td id="foodId">${item.foodId}</td>
                        <td>${item.quantity}</td>
                        <td>${item.price * item.quantity}</td>
                        <td><button class="btn btn-primary completeBtn">Complete</button></td>`
                } else {
                    row.innerHTML = `
                        <td>${id}</td>
                        <td>${new Date(order.createdAt).toLocaleString()}</td>
                        <td>${order.tableNumber}</td>
                        <td>${item.name}</td>
                        <td id="foodId">${item.foodId}</td>
                        <td>${item.quantity}</td>
                        <td>${item.price * item.quantity}</td>`
                }
                orderTable.appendChild(row);
            });
        });
        attachCompleteButtonListeners();
    }

    // load pending orders
    const ordersTable = () => {
        clearTable();
        fetch(`/${restaurant}/admin/orders`)
            .then(response => response.json())
            .then(data => {
                const orders = data;
                document.getElementById("ordersType").innerHTML = "Pending Orders";
                loadOrdersTable(orders, "pending");
            })
            .catch(err => console.error(err));
    };
    ordersTable();

    // load past orders
    const pastOrdersTable = () => {
        clearTable();
        fetch(`/${restaurant}/admin/past_orders`)
            .then(response => response.json())
            .then(data => {
                const orders = data;
                document.getElementById("ordersType").innerHTML = "Past Orders";
                loadOrdersTable(orders, "past");
            })
            .catch(err => console.error(err));
    };

    dashboard = document.getElementById("dashboard");
    pastOrderLink = document.getElementById("pastOrders");

    dashboard.addEventListener("click", () => {
        ordersTable();
        dashboard.classList.add("active");
        pastOrderLink.classList.remove("active");
    });

    pastOrderLink.addEventListener("click", () => {
        pastOrdersTable();
        pastOrderLink.classList.add("active");
        dashboard.classList.remove("active");
    });

    document.getElementById("addIngredient").addEventListener("click", () => {
        // get suppliers and populate select
        fetch(`/${restaurant}/admin/suppliers`)
            .then(response => response.json())
            .then(data => {
                const suppliers = data;
                const supplierSelect = document.getElementById("stockSupplier");
                suppliers.forEach(supplier => {
                    const option = document.createElement("option");
                    option.value = supplier._id;
                    option.textContent = supplier.name;
                    supplierSelect.appendChild(option);
                });
            })
            .catch(err => console.error(err));
    });

    document.getElementById("addIngredientForm").addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("ingredientName").value;
        const quantity = document.getElementById("quantity").value;
        const price = document.getElementById("price").value;
        const min = document.getElementById("min").value;
        const supplier = document.getElementById("stockSupplier").value;
        fetch(`/${restaurant}/admin/stock/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, quantity, price, min, supplier})
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === "ok") {
                    document.getElementById("addIngredientForm").reset();
                    alert("Ingredient added successfully");
                    document.querySelector(".modal").classList.toggle("show-modal");
                }
            })
            .catch(err => console.error(err));
    });

    document.getElementById("addSupplierForm").addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("supplierName").value;
        const phone = document.getElementById("supplierPhone").value;
        const email = document.getElementById("supplierEmail").value;
        const location = document.getElementById("supplierPostcode").value;
        fetch(`/${restaurant}/admin/supplier/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, phone, email, location })
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === "ok") {
                    document.getElementById("addSupplierForm").reset();
                    alert("Supplier added successfully");
                    document.querySelector(".modal").classList.toggle("show-modal");
                }
            })
            .catch(err => console.error(err));
    });

});