import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["content", "map", "coordinates"];

  connect() {
    console.log("Routes map controller connected");
  }

  initMap() {
    this.map = new google.maps.Map(this.mapTarget, {
      center: { lat: 35.652832, lng: 139.839478 },
      zoom: 13,
    });

    const transitLayer = new google.maps.TransitLayer();
    transitLayer.setMap(this.map);

    // Draw the full polyline route and adjust the map view
    this.drawFullPolylineRoute();
  }

  drawFullPolylineRoute() {
    // Parse route data
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
    let currentPath = [];
    let currentWays = null;
    let currentProperties = null;

    shapes.forEach((shape, index) => {
      const shapeWays = shape.properties.ways;

      if (shapeWays !== currentWays) {
        // If the way type changes, draw the current path and start a new one
        if (currentPath.length > 0) {
          this.drawPolyline(currentPath, currentProperties);
          currentPath = [];
        }
        currentWays = shapeWays;
      }

      const shapeCoordinates = shape.geometry.coordinates.map((coord) => {
        return { lat: coord[1], lng: coord[0] };
      });

      currentPath.push(...shapeCoordinates);
      currentProperties = shape.properties;  // Store the properties for styling

      // Draw the remaining path after the loop ends
      if (index === shapes.length - 1 && currentPath.length > 0) {
        this.drawPolyline(currentPath, currentProperties);
      }
    });
  }

  drawPolyline(pathCoordinates, properties) {
    // Draw the outline polyline first (if it exists)
    if (properties.outline) {
      const outlinePolyline = new google.maps.Polyline({
        path: pathCoordinates,
        strokeColor: properties.outline.color,
        strokeOpacity: properties.outline.opacity,
        strokeWeight: properties.outline.width,
        map: this.map,
        strokeLinecap: properties.outline.strokelinecap || 'round',
        strokeLinejoin: properties.outline.strokelinejoin || 'round',
      });
      outlinePolyline.setMap(this.map);
    }

    // Determine if the line is for walking or transport
    const isWalking = properties.ways === "walk";

    // Draw the inline polyline on top
    const polyline = new google.maps.Polyline({
      path: pathCoordinates,
      strokeColor: properties.inline.color,
      strokeOpacity: properties.inline.opacity,
      strokeWeight: properties.inline.width,
      map: this.map,
      strokeLinecap: properties.inline.strokelinecap || 'round',
      strokeLinejoin: properties.inline.strokelinejoin || 'round',
      // If it's a walking path, make it dotted
      icons: isWalking ? [{
        icon: {
          path: 'M 0,-1 0,1',
          strokeOpacity: 1,
          scale: 4,
        },
        offset: '0',
        repeat: '10px'
      }] : [],
    });
    polyline.setMap(this.map);

    // Add markers for the start and end of transport lines
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

    // Adjust the map view to fit the entire polyline
    const bounds = new google.maps.LatLngBounds();
    pathCoordinates.forEach((coord) => {
      bounds.extend(coord);
    });

    this.map.fitBounds(bounds);
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

        this.drawPolyline(pathCoordinates, feature.properties);
      }
    });
  }
}
