// js/Alert.js
export default class Alert {
  constructor(jsonFilePath) {
    this.jsonFilePath = jsonFilePath;
    this.init();
  }

  async init() {
    try {
      const response = await fetch(this.jsonFilePath);
      const alerts = await response.json();

      if (alerts.length > 0) {
        this.displayAlerts(alerts);
      }
    } catch (error) {
      console.error("Error loading alerts:", error);
    }
  }

  displayAlerts(alerts) {
    const section = document.createElement("section");
    section.classList.add("alert-list");

    alerts.forEach(alert => {
      const p = document.createElement("p");
      p.textContent = alert.message;
      p.style.background = alert.background;
      p.style.color = alert.color;
      p.style.padding = "10px";
      p.style.margin = "0 0 10px 0";
      p.style.fontWeight = "bold";
      p.style.borderRadius = "5px";
      section.appendChild(p);
    });

    const main = document.querySelector("main");
    if (main) {
      main.prepend(section);
    } else {
      console.warn("Main element not found.");
    }
  }
}
