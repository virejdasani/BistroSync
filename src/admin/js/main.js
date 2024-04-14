
document.addEventListener("DOMContentLoaded", () => {
    const restaurant = window.location.pathname.split("/")[1];

    const clearTable = () => {
        document.getElementById("note").textContent = "";
        document.getElementById("ordersTableBody").innerHTML = "";
    };

    const attachCompleteButtonListeners = () => {
        const completeBtns = document.querySelectorAll(".completeBtn");
        completeBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                const orderId = btn.parentElement.parentElement.id;
                const foodId = btn.parentElement.parentElement.querySelector("#foodId").textContent;
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

    const attachOrderStockListeners = () => {
        const orderStockBtns = document.querySelectorAll(".orderStock");
        orderStockBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.getAttribute("data-id");
                document.getElementById("orderQuantity").setAttribute("data-id", id);
            });
        });
    }

    const loadOrdersTable = (orders, type) => {
        // Add action header if pending orders
        if (type === "pending") {
            if (!document.getElementById("cust-name")) {
                const custNameCol = document.createElement("th");
                custNameCol.id = "cust-name";
                custNameCol.textContent = "Customer Name";
                tableCol = document.getElementById("table");
                tableCol.parentNode.insertBefore(custNameCol, tableCol.nextSibling);
            }
            if (!document.getElementById("action-col")) {
                const actionCol = document.createElement("th");
                actionCol.id = "action-col";
                actionCol.textContent = "Action";
                tableCol = document.getElementById("orderPrice");
                tableCol.parentNode.insertBefore(actionCol, tableCol.nextSibling);
            }
        }

        else if (type === "past") {
            const actionCol = document.getElementById("action-col");
            const custNameCol = document.getElementById("cust-name");
            if (actionCol) actionCol.remove();
            if (custNameCol) custNameCol.remove();
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
                        <td>${order.custName}</td>
                        <td>${item.name}</td>
                        <td hidden id="foodId">${item.foodId}</td>
                        <td>${item.price * item.quantity}</td>
                        <td><button class="btn btn-primary completeBtn">Complete</button></td>`
                } else {
                    row.innerHTML = `
                        <td>${id}</td>
                        <td>${new Date(order.createdAt).toLocaleString()}</td>
                        <td>${order.tableNumber}</td>
                        <td>${item.name}</td>
                        <td hidden id="foodId">${item.foodId}</td>
                        <td>${item.price * item.quantity}</td>`
                }
                orderTable.appendChild(row);
            });
        });
        attachCompleteButtonListeners();
    }

    // load suppliers
    const loadSuppliers = () => {
        fetch(`/${restaurant}/admin/suppliers`)
            .then(response => response.json())
            .then(data => {
                const suppliers = data;
                const supplierTable = document.getElementById("supplierTableBody");
                supplierTable.innerHTML = "";
                suppliers.forEach(supplier => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${supplier.name}</td>
                        <td>${supplier.phone}</td>
                        <td>${supplier.email}</td>
                        <td>${supplier.location}</td>`;
                    supplierTable.appendChild(row);
                });
            })
            .catch(err => console.error(err));
    }

    // load stock
    const loadIngredients = () => {
        fetch(`/${restaurant}/admin/stock`)
            .then(response => response.json())
            .then(data => {
                const stock = data;
                const stockTable = document.getElementById("stockTableBody");
                stockTable.innerHTML = "";
                stock.forEach(item => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td id="stockName">${item.name}</td>
                        <td>${item.quantity}</td>
                        <td>${item.price}</td>
                        <td>${item.min}</td>
                        <td>${item.supplier.name}</td>
                        <td><button class="btn btn-primary orderStock" data-bs-toggle="modal"
                            data-bs-target="#addPurchaseOrderModal" data-id="${item._id}">
                            Order</button>
                        </td>`;
                    stockTable.appendChild(row);
                });
                attachOrderStockListeners();
            })
            .catch(err => console.error(err));
    }

    const ordersTable = () => {
        clearTable();
        fetch(`/${restaurant}/admin/orders`)
            .then(response => response.json())
            .then(data => {
                const orders = data;
                document.getElementById("ordersType").textContent = "Pending Orders";
                document.getElementById("note").textContent = "Note: table refreshes every 10 seconds.";
                loadOrdersTable(orders, "pending");
            })
            .catch(err => console.error(err));
    };
    ordersTable();

    const pastOrdersTable = () => {
        clearTable();
        fetch(`/${restaurant}/admin/past_orders`)
            .then(response => response.json())
            .then(data => {
                const orders = data;
                document.getElementById("ordersType").textContent = "Past Orders";
                loadOrdersTable(orders, "past");
            })
            .catch(err => console.error(err));
    };

    const showOrdersDiv = () => {
        document.getElementById("orders").style.display = "block";
    }

    const hideOrdersDiv = () => {
        document.getElementById("orders").style.display = "none";
    }

    const hideStockTable = () => {
        document.getElementById("stock").style.display = "none";
    }


    // Event listeners

    dashboard = document.getElementById("dashboard");
    pastOrderLink = document.getElementById("pastOrders");
    stockLink = document.getElementById("stockLink");

    dashboard.addEventListener("click", () => {
        hideStockTable();
        ordersTable();
        dashboard.classList.add("active");
        pastOrderLink.classList.remove("active");
        stockLink.classList.remove("active");

        showOrdersDiv();
    });

    pastOrderLink.addEventListener("click", () => {
        hideStockTable();
        pastOrdersTable();

        pastOrderLink.classList.add("active");
        dashboard.classList.remove("active");
        stockLink.classList.remove("active");

        showOrdersDiv();
    });

    stockLink.addEventListener("click", () => {
        hideOrdersDiv();

        stockLink.classList.add("active");
        dashboard.classList.remove("active");
        pastOrderLink.classList.remove("active");

        const stock = document.getElementById("stock");
        if (stock.style.display === "none") {
            stock.style.display = "block";
            loadIngredients();
        }
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

    document.getElementById('addPurchaseOrderForm').addEventListener("submit", (e) => {
        e.preventDefault();
        const id = document.getElementById("orderQuantity").getAttribute("data-id");
        const quantity = document.getElementById("orderQuantity").value;
        fetch(`/${restaurant}/admin/purchase_order`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id, quantity })
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === "ok") {
                    document.getElementById("addPurchaseOrderForm").reset();
                    alert("Order placed successfully");
                }
            })
            .catch(err => console.error(err));
    });



    // check every 5 seconds for new orders
    setInterval(() => {
        if (document.getElementById("dashboard").classList.contains("active")) {
            ordersTable();
        }
    }, 10000);

});