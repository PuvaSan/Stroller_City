import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["content", "map", "coordinates"];

  connect() {
    console.log("Routes map controller connected");
    // Initialize the map when the controller is connected
    this.initMap();
  }

  initMap() {
    const mapOptions = {
      zoom: 11,
      center: { lat: 35.690916, lng: 139.785495 }, // A central point in Tokyo
      mapTypeId: "terrain",
    };

    this.map = new google.maps.Map(this.mapTarget, mapOptions);

    // Draw the full polyline route and adjust the map view
    this.drawFullPolylineRoute();
  }

  drawFullPolylineRoute() {
    const routeData = this.element.dataset.route;
    let route;
    try {
      route = JSON.parse(routeData);
      console.log("Parsed route data successfully:", route);
    } catch (error) {
      console.error("Failed to parse route data:", error);
      return;
    }

    // Collect all coordinates from the shapes and group by 'ways'
    const shapes = route.shapes.features;
    const bounds = new google.maps.LatLngBounds(); // To fit the map to the route

    shapes.forEach((shape) => {
      const shapeCoordinates = shape.geometry.coordinates.map((coord) => {
        return { lat: coord[1], lng: coord[0] };
      });

      // Extend the bounds to include this shape
      shapeCoordinates.forEach(coord => bounds.extend(coord));

      // Draw the polyline
      this.drawPolyline(shapeCoordinates, shape.properties);
    });

    // Fit the map to the bounds of the entire route
    this.map.fitBounds(bounds);
  }

  drawPolyline(pathCoordinates, properties) {
    const isWalking = properties.ways === "walk";

    const polyline = new google.maps.Polyline({
      path: pathCoordinates,
      strokeColor: properties.inline.color,
      strokeOpacity: properties.inline.opacity,
      strokeWeight: properties.inline.width,
      map: this.map,
      strokeLinecap: properties.inline.strokelinecap || 'round',
      strokeLinejoin: properties.inline.strokelinejoin || 'round',
      icons: isWalking ? [{
        icon: {
          path: 'M 0,-1 0,1',
          scale: 4,
          strokeColor: properties.inline.color,
          strokeOpacity: properties.inline.opacity,
        },
        offset: '0',
        repeat: '20px'
      }] : [],
    });
    polyline.setMap(this.map);

    if (!isWalking) {
      new google.maps.Marker({
        position: pathCoordinates[0],
        map: this.map,
        title: "Start of Transport",
      });

      new google.maps.Marker({
        position: pathCoordinates[pathCoordinates.length - 1],
        map: this.map,
        title: "End of Transport",
      });
    }
  }

  handleCardClick(event) {
    const sectionId = event.currentTarget.dataset.sectionId;
    let coordinates = event.currentTarget.dataset.coordinates;

    console.log(`Clicked on section with ID: ${sectionId}`);
    console.log(`Coordinates: ${coordinates}`);

    // Check if coordinates is a string or an object
    if (typeof coordinates === "string") {
      coordinates = coordinates.split(",").map((coord) => parseFloat(coord));
    } else if (typeof coordinates === "object" && coordinates.lat && coordinates.lng) {
      coordinates = [coordinates.lat, coordinates.lng];
    } else {
      console.error("Invalid coordinates format:", coordinates);
      return;
    }

    this.zoomTo({ lat: coordinates[0], lng: coordinates[1] });
    this.drawPolylineForSection(sectionId);
  }

  zoomTo(coordinates) {
    const position = { lat: coordinates.lat, lng: coordinates.lng };

    this.map.setCenter(position);
    this.map.setZoom(18);

    new google.maps.Marker({
      position,
      map: this.map,
    });
  }

  drawPolylineForSection(sectionId) {
    const routeData = this.element.dataset.route;

    console.log(`Attempting to draw polyline for section ID: ${sectionId}`);
    console.log(`Route data: ${routeData}`);

    if (!routeData) {
      console.error("Route data is missing");
      return;
    }

    let route;
    try {
      route = JSON.parse(routeData);
      console.log("Parsed route data successfully:", route);
    } catch (error) {
      console.error("Failed to parse route data:", error);
      return;
    }

    const shapes = route.shapes.features;

    shapes.forEach((feature) => {
      const sectionNumbers = feature.properties.section.split(",");

      if (sectionNumbers.includes(sectionId)) {
        const pathCoordinates = feature.geometry.coordinates.map((coord) => {
          return { lat: coord[1], lng: coord[0] };
        });

        console.log(`Drawing polyline for section ${sectionId} with coordinates:`, pathCoordinates);

        const polyline = new google.maps.Polyline({
          path: pathCoordinates,
          strokeColor: feature.properties.inline.color,
          strokeOpacity: feature.properties.inline.opacity,
          strokeWeight: feature.properties.inline.width,
          map: this.map,
        });

        polyline.setMap(this.map);
      }
    });
  }
}
