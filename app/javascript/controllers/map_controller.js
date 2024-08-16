import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static values = {
    apiKey: String,
    navitimeResponse: Object
  }

  static targets = ["mapElement", "markerContainer"]

  connect() {
    console.log("Stimulus controller connected"); // Debugging line
    console.log("Navitime Response Value:", this.navitimeResponseValue); // Debugging line
    console.log("API Key Value:", this.apiKeyValue); // Debugging line

    if (typeof google === "undefined") {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKeyValue}&callback=initMap`;
      script.async = true;
      window.initMap = this.initMap.bind(this);
      document.head.appendChild(script);
    } else {
      this.initMap();
    }
  }

  initMap() {
    console.log("Google Maps API loaded"); // Debugging line
    const map = new google.maps.Map(this.mapElementTarget, {
      zoom: 12,
      center: { lat: 35.665020999999996, lng: 139.7837478 } // Starting position
    });

    // Add transit layer
    const transitLayer = new google.maps.TransitLayer();
    transitLayer.setMap(map);
  }


}
