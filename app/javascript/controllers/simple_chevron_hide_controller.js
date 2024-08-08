import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="simple-chevron-hide"
export default class extends Controller {
  connect() {
  }

  toggle(event) {
    const chevron = event.target;
    const idNumber = chevron.id.replace("chevronDetail", "");
    const detailElement = document.getElementById(`detail${idNumber}`);
    detailElement.classList.toggle("d-none");
    if (chevron.style.transform !== "rotate(90deg)") {
      chevron.style.transform = "rotate(90deg)";
    }
    else {
      chevron.style.transform = "";
    }
  }
}
