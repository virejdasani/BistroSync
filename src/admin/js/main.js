
document.addEventListener("DOMContentLoaded", () => {
    const restaurant = window.location.pathname.split("/")[1];

    // load orders
    fetch(`/${restaurant}/admin/orders`)
        .then(response => response.json())
        .then(data => {
            const orders = data;
            const orderTable = document.getElementById("pendingOrdersBody");
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
        })
        .catch(err => console.error(err));
});