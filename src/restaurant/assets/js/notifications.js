// notifcations
options = {
  position: "top-right",
  duration: 3000,
  labels: {
    success: "Added to cart",
    alert: "Please enter your table number",
    info: "Info",
    warning: "Warning",
  },
  maxNotifications: 4,
  durations: {
    success: 2200,
  },
};

let notifier = new AWN(options);
