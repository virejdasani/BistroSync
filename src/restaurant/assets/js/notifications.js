// notifcations
options = {
  position: "top-right",
  duration: 3000,
  labels: {
    success: "Added to cart",
    alert: "Alert",
    info: "SUCCESS!",
    warning: "Deleted from cart",
  },
  maxNotifications: 4,
  durations: {
    success: 2200,
    warning: 2200,
    alert: 2200,
    info: 2200,
  },
};

let notifier = new AWN(options);
