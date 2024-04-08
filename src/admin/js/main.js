
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
                fetch(`/${restaurant}/admin/orders/${orderId}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ status: "completed" })
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

    const loadTable = (orders, type) => {
        // Add action header if pending orders
        if (type === "pending" && !document.getElementById("action-col")) {
            const actionCol = document.createElement("th");
            actionCol.id = "action-col";
            actionCol.textContent = "Action";
            document.querySelector("#ordersTableHead tr").appendChild(actionCol);
        }
        else if (type === "past") {
            const actionCol = document.getElementById("action-col");
            if (actionCol) actionCol.remove();
        }

        const orderTable = document.getElementById("ordersTableBody");
        orders.forEach(order => {
            order.items.forEach(item => {
                const row = document.createElement("tr");
                row.id = order._id;
                const id = order._id.toString().slice(-6);
                row.innerHTML = `
                    <td>${id}</td>
                    <td>${order.tableNumber}</td>
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>${item.price * item.quantity}</td>`;
                if (type === "pending") row.innerHTML += `<td><button class="btn btn-primary completeBtn">Complete</button></td>`;
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
                loadTable(orders, "pending");
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
                loadTable(orders, "past");
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

});