import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="routes-map"
export default class extends Controller {
  static targets = ["content"]

  connect() {
    console.log("Routes map controller connected");
    // Additional logic can be added here to interact with the content inside the draggable panel
    document.querySelector("#draggable-panel").style.height = "50vh";
  }

  async initMap() {
    let map = new google.maps.Map(document.getElementById('map'),{
      center:{lat:35.652832,lng:139.839478},
      zoom:13
    })
    google.maps.event.addListener(map,"click",function(event) {
      this.setOptions({scrollwheel:true})
    })

    // adds transit layer over our map
    const transitLayer = new google.maps.TransitLayer();
    transitLayer.setMap(map);
  }
}
