import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["content", "map", "coordinates"];

  connect() {
    console.log("[RoutesMapController] Connected successfully.");
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
    console.log("[initMap] Map initialized with center:", mapOptions.center);

    // Draw the full polyline route and adjust the map view
    this.drawFullPolylineRoute();
  }

  drawFullPolylineRoute() {
    const routeData = this.element.dataset.route;
    let route;
    try {
      route = JSON.parse(routeData);
      console.log("[drawFullPolylineRoute] Parsed route data successfully:", route);
    } catch (error) {
      console.error("[drawFullPolylineRoute] Failed to parse route data:", error);
      return;
    }

    // Collect all coordinates from the shapes and group by 'ways'
    const shapes = route.shapes.features;
    const bounds = new google.maps.LatLngBounds(); // To fit the map to the route

    shapes.forEach((shape, index) => {
      const shapeCoordinates = shape.geometry.coordinates.map((coord) => {
        return { lat: coord[1], lng: coord[0] };
      });

      // Extend the bounds to include this shape
      shapeCoordinates.forEach(coord => bounds.extend(coord));

      // Draw the polyline
      console.log(`[drawFullPolylineRoute] Drawing polyline for shape ${index + 1} with ways: ${shape.properties.ways}`);
      this.drawPolyline(shapeCoordinates, shape.properties);
    });

    // Fit the map to the bounds of the entire route
    this.map.fitBounds(bounds);
    console.log("[drawFullPolylineRoute] Map bounds adjusted to fit entire route.");
  }

  drawPolyline(pathCoordinates, properties) {
    const isWalking = properties.ways === "walk";
    console.log(`[drawPolyline] Drawing polyline. Is walking route: ${isWalking}`);

    const polylineOptions = {
      path: pathCoordinates,
      strokeOpacity: isWalking ? 0 : 0.5, // Set opacity to 0 for dashed lines
      strokeWeight: 10,
      map: this.map,
      strokeLinecap: properties.inline.strokelinecap || 'round',
      strokeLinejoin: properties.inline.strokelinejoin || 'round',
    };

    if (isWalking) {
      // Define the dashed line symbol for walking routes
      const lineSymbol = {
        path: 'M 0,-1 0,1',
        scale: 4,
        strokeColor: properties.inline.color,
        strokeOpacity: 0.5,
      };

      // Add the dashed line effect to the polyline
      polylineOptions.icons = [{
        icon: lineSymbol,
        offset: '0',
        repeat: '20px'
      }];
      console.log("[drawPolyline] Dashed line style applied for walking route.");
    } else {
      // Set the color for transport routes
      polylineOptions.strokeColor = properties.inline.color;
      console.log(`[drawPolyline] Solid line style applied with color: ${properties.inline.color}`);
    }

    const polyline = new google.maps.Polyline(polylineOptions);
    polyline.setMap(this.map);
    console.log("[drawPolyline] Polyline drawn on map.");

    if (!isWalking) {
      // Add markers at the start and end of transport routes
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
      console.log("[drawPolyline] Markers added for start and end of transport.");
    }
  }

  handleCardClick(event) {
    const moveType = event.currentTarget.dataset.move || '';

    console.log(`[handleCardClick] Move type: ${moveType}`);

    const routeData = this.element.dataset.route;
    let route;
    try {
        route = JSON.parse(routeData);
        console.log("[handleCardClick] Parsed route data successfully:", route);
    } catch (error) {
        console.error("[handleCardClick] Failed to parse route data:", error);
        return;
    }

    if (moveType === "walk") {
        // Get all walk sections grouped into sets with their bounding boxes
        const walkSections = this.getCoordinatesForWalkSections(route.shapes.features);

        // Determine which walk section to focus on based on the order of the walk sections
        const walkIndex = this.getWalkSectionIndex(route.sections, event.currentTarget);

        if (walkIndex >= 0 && walkIndex < walkSections.length) {
            console.log(`[handleCardClick] Focusing on walk section ${walkIndex + 1}`);
            this.fitMapToBounds(walkSections[walkIndex].bounds);
        } else {
            console.error(`[handleCardClick] No matching walk section found for index: ${walkIndex}`);
        }
    } else if (moveType === "transport") {
        const transportCoordinates = this.getCoordinatesForMoveType(route.shapes.features, "transport");
        if (transportCoordinates.length > 0) {
            console.log("[handleCardClick] Matching transport route found. Panning and zooming to fit.");
            this.fitMapToCoordinates(transportCoordinates);
        } else {
            console.error("[handleCardClick] No matching transport route found.");
        }
    } else if (moveType === "point" && event.currentTarget.dataset.coordinates) {
        const coordinates = event.currentTarget.dataset.coordinates.split(',').map(parseFloat);
        if (coordinates.length === 2) {
            console.log(`[handleCardClick] Point location found. Zooming into: lat=${coordinates[0]}, lng=${coordinates[1]}`);
            this.zoomTo({ lat: coordinates[0], lng: coordinates[1] });
        } else {
            console.error(`[handleCardClick] Invalid coordinates format for point: ${coordinates}`);
        }
    } else {
        console.error(`[handleCardClick] No matching section found.`);
    }
  }

  fitMapToBounds(bounds) {
    this.map.fitBounds(bounds);
    console.log("[fitMapToBounds] Map bounds adjusted to fit coordinates.");
  }

  zoomTo(coordinates) {
    this.map.setCenter(coordinates);
    this.map.setZoom(18);

    new google.maps.Marker({
      position: coordinates,
      map: this.map,
    });
  }

  getCoordinatesForWalkSections(shapes) {
    const walkSections = [];
    let currentSection = [];
    let currentBounds = new google.maps.LatLngBounds();

    shapes.forEach((shape) => {
        if (shape.properties.ways === "walk") {
            shape.geometry.coordinates.forEach(coord => {
                const latLng = { lat: coord[1], lng: coord[0] };
                currentSection.push(latLng);
                currentBounds.extend(latLng);
            });
        } else if (currentSection.length > 0) {
            // Save the current walk section with its bounds when a non-walk section is encountered
            walkSections.push({ coordinates: currentSection, bounds: currentBounds });
            currentSection = [];
            currentBounds = new google.maps.LatLngBounds(); // Reset for the next section
        }
    });

    // Push the last collected walk section if it wasn't pushed yet
    if (currentSection.length > 0) {
        walkSections.push({ coordinates: currentSection, bounds: currentBounds });
    }

    console.log("[getCoordinatesForWalkSections] Collected walk sections:", walkSections);
    return walkSections;
  }

  getWalkSectionIndex(sections, targetElement) {
    console.log(`[getWalkSectionIndex] Looking for the clicked walk section.`);

    let walkIndex = 0;

    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      console.log(`[getWalkSectionIndex] Checking section ${i}: Move=${section.move}`);

      if (section.move === "walk") {
        // Match the occurrence of walk sections in the order they appear
        if (targetElement.dataset.index === walkIndex.toString()) {
          console.log(`[getWalkSectionIndex] Found matching walk section at index ${walkIndex}`);
          return walkIndex;
        }
        walkIndex++;
      }
    }

    console.error(`[getWalkSectionIndex] No matching section found for the clicked element.`);
    return -1; // If no matching section is found
  }

  getCoordinatesForMoveType(shapes, moveType) {
    const coordinates = [];
    shapes.forEach((shape) => {
      const shapeWays = shape.properties.ways;

      if (shapeWays === moveType) {
        shape.geometry.coordinates.forEach((coord) => {
          coordinates.push({ lat: coord[1], lng: coord[0] });
        });
      }
    });

    console.log(`[getCoordinatesForMoveType] Found ${coordinates.length} coordinates for move type: ${moveType}`);
    return coordinates;
  }

  getCoordinatesForSection(sections, sectionId) {
    let coordinates = [];
    sections.forEach((section) => {
      if (section.node_id === sectionId && section.coord) {
        coordinates.push({ lat: section.coord.lat, lng: section.coord.lon });
      }
    });
    console.log(`[getCoordinatesForSection] Found ${coordinates.length} coordinates for section ID: ${sectionId}`);
    return coordinates;
  }

  fitMapToCoordinates(coordinates) {
    const bounds = new google.maps.LatLngBounds();
    coordinates.forEach(coord => bounds.extend(coord));
    this.map.fitBounds(bounds);
    console.log("[fitMapToCoordinates] Map bounds adjusted to fit coordinates.");
  }
}
