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

    // Plot routes from Navitime response
    this.plotRoutes(map);
  }

  plotRoutes(map) {
    if (!this.navitimeResponseValue || !this.navitimeResponseValue.items) {
      console.error("No valid routes to display.");
      console.log("Navitime Response:", this.navitimeResponseValue); // Debugging line
      return;
    }

    this.navitimeResponseValue.items.forEach(item => {
      console.log("Plotting Route Item:", item); // Debugging line
      const routePath = new google.maps.Polyline({
        path: item.shapes.features.flatMap(feature => feature.geometry.coordinates.map(coord => ({ lat: coord[1], lng: coord[0] }))),
        geodesic: true,
        strokeColor: '#00FF00', // Change to green
        strokeOpacity: 1.0,
        strokeWeight: 4
      });

      routePath.setMap(map);
      console.log("Route path added to the map"); // Debugging line

      // Add markers for start and end points
      const start = item.summary.start.coord;
      const goal = item.summary.goal.coord;

      this.addMarker(map, start.lat, start.lon, item.summary.start.name);
      this.addMarker(map, goal.lat, goal.lon, item.summary.goal.name);
    });
  }

  addMarker(map, lat, lng, title) {
    const marker = new google.maps.Marker({
      position: { lat, lng },
      map: map,
      title: title
    });

    const infoWindow = new google.maps.InfoWindow({
      content: title
    });

    marker.addListener('click', () => {
      infoWindow.open(map, marker);
    });
  }
}
