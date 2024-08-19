import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["content", "map", "coordinates"];

  connect() {
    console.log("[RoutesMapController] Connected successfully.");
    this.initMap();
  }

  initMap() {
    const mapOptions = {
      zoom: 11,
      center: { lat: 35.690916, lng: 139.785495 },
      mapTypeId: "terrain",
    };

    this.map = new google.maps.Map(this.mapTarget, mapOptions);
    console.log("[initMap] Map initialized with center:", mapOptions.center);

    this.walkSections = this.getCoordinatesForWalkSections();
    this.drawFullPolylineRoute();
  }

  getCoordinatesForWalkSections() {
    const routeData = this.element.dataset.route;
    let route;
    try {
        route = JSON.parse(routeData);
        console.log("[getCoordinatesForWalkSections] Parsed route data successfully:", route);
    } catch (error) {
        console.error("[getCoordinatesForWalkSections] Failed to parse route data:", error);
        return [];
    }

    const walkSections = [];
    let currentSection = [];
    let currentBounds = new google.maps.LatLngBounds();

    route.shapes.features.forEach((shape) => {
        if (shape.properties.ways === "walk") {
            // Add coordinates to the current walk section
            shape.geometry.coordinates.forEach((coord) => {
                const latLng = { lat: coord[1], lng: coord[0] };
                currentSection.push(latLng);
                currentBounds.extend(latLng);
            });
        } else if (currentSection.length > 0) {
            // If we're switching from walk to transport, finalize the current walk section
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



  handleCardClick(event) {
    const moveType = event.currentTarget.dataset.move;
    const index = event.currentTarget.dataset.index;

    console.log(`[handleCardClick] Move type: ${moveType}`);
    console.log(`[handleCardClick] Index: ${index}`);

    if (moveType === "walk" && index !== undefined) {
        const walkSection = this.walkSections[index];

        if (walkSection) {
            console.log(`[handleCardClick] Focusing on walk section for index: ${index}`);
            this.fitMapToBounds(walkSection.bounds);
        } else {
            console.error(`[handleCardClick] No matching walk section found for index: ${index}`);
        }
    } else if (moveType === "transport") {
        const transportCoordinates = this.getCoordinatesForMoveType("transport");
        if (transportCoordinates.length > 0) {
            this.fitMapToCoordinates(transportCoordinates);
        } else {
            console.error("[handleCardClick] No matching transport route found.");
        }
    } else if (moveType === "point" && event.currentTarget.dataset.coordinates) {
        const coordinates = event.currentTarget.dataset.coordinates.split(',').map(parseFloat);
        if (coordinates.length === 2) {
            this.zoomTo({ lat: coordinates[0], lng: coordinates[1] });
        } else {
            console.error(`[handleCardClick] Invalid coordinates format for point: ${coordinates}`);
        }
    } else {
        console.error(`[handleCardClick] No matching section found for index: ${index}`);
    }
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

    const shapes = route.shapes.features;
    const bounds = new google.maps.LatLngBounds();

    shapes.forEach((shape, index) => {
      const shapeCoordinates = shape.geometry.coordinates.map((coord) => {
        return { lat: coord[1], lng: coord[0] };
      });

      shapeCoordinates.forEach(coord => bounds.extend(coord));
      this.drawPolyline(shapeCoordinates, shape.properties);
    });

    this.map.fitBounds(bounds);
    console.log("[drawFullPolylineRoute] Map bounds adjusted to fit entire route.");
  }

  drawPolyline(pathCoordinates, properties) {
    const isWalking = properties.ways === "walk";

    const polylineOptions = {
      path: pathCoordinates,
      strokeOpacity: isWalking ? 0 : 0.5,
      strokeWeight: 10,
      map: this.map,
      strokeLinecap: properties.inline.strokelinecap || 'round',
      strokeLinejoin: properties.inline.strokelinejoin || 'round',
    };

    if (isWalking) {
      const lineSymbol = {
        path: 'M 0,-1 0,1',
        scale: 4,
        strokeColor: properties.inline.color,
        strokeOpacity: 0.5,
      };

      polylineOptions.icons = [{
        icon: lineSymbol,
        offset: '0',
        repeat: '20px'
      }];
    } else {
      polylineOptions.strokeColor = properties.inline.color;
    }

    const polyline = new google.maps.Polyline(polylineOptions);
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

  getCoordinatesForMoveType(moveType) {
    const coordinates = [];
    const shapes = JSON.parse(this.element.dataset.route).shapes.features;
    shapes.forEach((shape) => {
      if (shape.properties.ways === moveType) {
        shape.geometry.coordinates.forEach((coord) => {
          coordinates.push({ lat: coord[1], lng: coord[0] });
        });
      }
    });

    console.log(`[getCoordinatesForMoveType] Found ${coordinates.length} coordinates for move type: ${moveType}`);
    return coordinates;
  }
}
