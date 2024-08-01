import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static values = {
    apiKey: String,
    coordinates: Array
  }

  connect() {
    console.log("Stimulus controller connected"); // Debugging line
    console.log("Coordinates: ", this.coordinatesValue); // Debugging line

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
    const map = new google.maps.Map(this.element, {
      zoom: 12,
      center: { lat: 35.665020999999996, lng: 139.7837478 } // Starting position
    });

    const routeCoordinates = this.coordinatesValue.map(coord => ({
      lat: parseFloat(coord[0]),
      lng: parseFloat(coord[1])
    }));

    console.log("Route Coordinates: ", routeCoordinates); // Debugging line

    const routePath = new google.maps.Polyline({
      path: routeCoordinates,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 2
    });

    routePath.setMap(map);
  }
}
