
document.addEventListener("DOMContentLoaded", () => {
    const restaurant = window.location.pathname.split("/")[1];

    const clearTable = () => {
        return document.getElementById("ordersTableBody").innerHTML = "";
    };

    const loadTable = (orders) => {
        const orderTable = document.getElementById("ordersTableBody");
        orders.forEach(order => {
            order.items.forEach(item => {
                const row = document.createElement("tr");
                const id = order._id.toString().slice(-6);
                row.innerHTML = `
                    <td>${id}</td>
                    <td>${order.tableNumber}</td>
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>${item.price * item.quantity}</td>
                    <td><button class="btn btn-primary">Complete</button></td>`;
                orderTable.appendChild(row);
            });
        });
    }

    // load pending orders
    const ordersTable = () => {
        clearTable();
        fetch(`/${restaurant}/admin/orders`)
            .then(response => response.json())
            .then(data => {
                const orders = data;
                const orderTable = document.getElementById("ordersTableBody");
                document.getElementById("ordersType").innerHTML = "Pending Orders";
                loadTable(orders);
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
                const orderTable = document.getElementById("pastOrdersTableBody");
                document.getElementById("ordersType").innerHTML = "Past Orders";
                loadTable(orders);

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