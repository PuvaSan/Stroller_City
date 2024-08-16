import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="place-toggler"
export default class extends Controller {
  connect() {
  }

  toggleTab(event) {
    const activeElement = document.querySelector("#tabs .active");
    if (activeElement) {
      activeElement.classList.remove("active");
    };
    console.log(activeElement);
    const containers = document.querySelectorAll(".container-container > *");
    containers.forEach(container => {
      if (!container.classList.contains("d-none")) {
        container.classList.add("d-none");
      }
    });

    event.currentTarget.classList.add("active");
    console.log(event.currentTarget.id);
    document.querySelector(`#${event.currentTarget.id}-container`).classList.remove("d-none");
  }
}
