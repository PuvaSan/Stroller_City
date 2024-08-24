import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="panel-resizer"
export default class extends Controller {
  connect() {
    if (document.querySelector("#place-description").classList.contains("d-none")) {
      document.querySelector("#draggable-panel").style.height = this.maxHeight + "px";
      document.querySelector("#draggable-panel").style.borderRadius = 0;
    }
  }
  // initializing variables
  cursorY = 0;
  height = 0;
  maxHeight = window.innerHeight - document.getElementById("stick-to-top").clientHeight;

  // will trigger getting y-coordinate of the cursor/touch and the initial height of the panel
  grab = (event) => {
    event.preventDefault();

    // for touch devices
    if (event.touches) {
      event = event.touches[0]
    }

    this.cursorY = event.clientY;
    this.height = this.element.clientHeight;

    document.addEventListener("mousemove", this.resize); // Listen for mousemove event to trigger resizing
    document.addEventListener("mouseup", this.stopResizing); // Listen for mouseup event to stop resizing
    document.addEventListener("touchmove", this.resize);
    document.addEventListener("touchend", this.stopResizing);
  }

  resize = (event) => {
    // for touch devices
    if (event.touches) {
      event = event.touches[0]
    }

     // Calculate the new height based on the mouse movement
    let newHeight = this.height + (this.cursorY - event.clientY);

    // Set the new height of the element if within range
    if (newHeight <= this.maxHeight && newHeight >= 200) {
      this.element.style.height = `${newHeight}px`;
    }
  }

  stopResizing = (event) => {
    event.preventDefault();
    console.log("mouse up")
    document.removeEventListener("mousemove", this.resize);
    document.removeEventListener("mouseup", this.stopResizing);
    document.removeEventListener("touchmove", this.resize);
    document.removeEventListener("touchend", this.stopResizing);
  }

  heightMaxer() {
    document.querySelector("#draggable-panel").style.height = this.maxHeight + "px";
  }
}
