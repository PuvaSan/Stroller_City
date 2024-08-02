import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static values = {
    apiKey: String,
    coordinates: Array
  }

  connect() {
    console.log("Stimulus controller connected"); // Debugging line
    const coordinatesData = this.data.get("map-coordinates-value");
    console.log("Coordinates data attribute: ", coordinatesData); // Debugging line

    try {
      this.coordinatesValue = JSON.parse(coordinatesData);
      if (!Array.isArray(this.coordinatesValue)) {
        throw new TypeError("Expected an array but got " + typeof this.coordinatesValue);
      }
    } catch (error) {
      console.error("Error parsing coordinates JSON: ", error);
      this.coordinatesValue = [];
    }
    console.log("Parsed Coordinates: ", this.coordinatesValue); // Debugging line

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

    // Add transit layer
    const transitLayer = new google.maps.TransitLayer();
    transitLayer.setMap(map);

    // Validate and parse coordinates
    let validCoordinates = [];
    try {
      validCoordinates = this.coordinatesValue.filter(coord => coord.lat !== null && coord.lng !== null).map(coord => ({
        lat: parseFloat(coord.lat),
        lng: parseFloat(coord.lng),
        info: coord.info
      }));
    } catch (error) {
      console.error("Error filtering and parsing coordinates: ", error);
    }

    console.log("Valid Route Coordinates: ", validCoordinates); // Debugging line

    if (validCoordinates.length > 0) {
      const routePath = new google.maps.Polyline({
        path: validCoordinates.map(coord => ({ lat: coord.lat, lng: coord.lng })),
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
      });

      routePath.setMap(map);
      console.log("Route path added to the map"); // Debugging line

      // Add markers for each valid place
      validCoordinates.forEach(coord => {
        const marker = new google.maps.Marker({
          position: { lat: coord.lat, lng: coord.lng },
          map: map
        });

        // Add info window for hover state
        const infoWindow = new google.maps.InfoWindow({
          content: coord.info
        });

        marker.addListener('mouseover', () => {
          infoWindow.open(map, marker);
        });

        marker.addListener('mouseout', () => {
          infoWindow.close();
        });
      });
    } else {
      console.error("No valid coordinates to display the route.");
    }
  }
}
