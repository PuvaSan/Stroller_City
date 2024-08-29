import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["content", "map", "coordinates"];

  connect() {
    console.log("[RoutesMapController] Connected successfully.");
    this.initMap();
    this.addMyLocationButton();
  }

  initMap() {
    const mapOptions = {
      zoom: 11,
      center: { lat: 35.690916, lng: 139.785495 },
      mapTypeId: "terrain",
      disableDefaultUI: true,
      zoomControl: true,
      zoomControlOptions: {
        position: google.maps.ControlPosition.RIGHT_BOTTOM,
      },
      streetViewControl: true,
    };

    this.map = new google.maps.Map(this.mapTarget, mapOptions);
    console.log("[initMap] Map initialized with center:", mapOptions.center);

    // Add a custom My Location button to the map
    const locationButton = document.createElement("button");
    //locationButton.textContent = "My Location";
    locationButton.classList.add("custom-map-control-button");
    locationButton.classList.add("fa-solid");
    locationButton.classList.add("fa-location-crosshairs");
    this.map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(locationButton);

    // Add a custom Back button to the map
    const backButton = document.createElement("button");
    backButton.classList.add("simple-back-button");
    backButton.classList.add("shadow-sm");
    backButton.classList.add("text-primary");
    backButton.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';
    this.map.controls[google.maps.ControlPosition.LEFT_TOP].push(backButton);
    //backbutton performs window.history.back() when clicked
    backButton.addEventListener("click", () => {
      window.history.back();
    });

    // Add event listener to the button to zoom to the current location
    locationButton.addEventListener("click", () => {
      this.zoomToCurrentLocation();
    });

    // Get the coordinates for walk sections and draw the full polyline route
    this.walkSections = this.getCoordinatesForWalkSections();
    this.transportSections = this.getCoordinatesForTransportSections();
    this.drawFullPolylineRoute();

    // adds transit layer over our map
    const transitLayer = new google.maps.TransitLayer();
    transitLayer.setMap(this.map);

    // adds retro style to our map
    this.map.setOptions({
      styles: [
        { elementType: "geometry", stylers: [{ color: "#ebe3cd" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#523735" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#f5f1e6" }] },
        {
          featureType: "administrative",
          elementType: "geometry.stroke",
          stylers: [{ color: "#c9b2a6" }],
        },
        {
          featureType: "administrative.land_parcel",
          elementType: "geometry.stroke",
          stylers: [{ color: "#dcd2be" }],
        },
        {
          featureType: "administrative.land_parcel",
          elementType: "labels.text.fill",
          stylers: [{ color: "#ae9e90" }],
        },
        {
          featureType: "landscape.natural",
          elementType: "geometry",
          stylers: [{ color: "#dfd2ae" }],
        },
        {
          featureType: "poi",
          elementType: "geometry",
          stylers: [{ color: "#dfd2ae" }],
        },
        {
          featureType: "poi",
          elementType: "labels.text.fill",
          stylers: [{ color: "#93817c" }],
        },
        {
          featureType: "poi.park",
          elementType: "geometry.fill",
          stylers: [{ color: "#a5b076" }],
        },
        {
          featureType: "poi.park",
          elementType: "labels.text.fill",
          stylers: [{ color: "#447530" }],
        },
        {
          featureType: "road",
          elementType: "geometry",
          stylers: [{ color: "#f5f1e6" }],
        },
        {
          featureType: "road.arterial",
          elementType: "geometry",
          stylers: [{ color: "#fdfcf8" }],
        },
        {
          featureType: "road.highway",
          elementType: "geometry",
          stylers: [{ color: "#f8c967" }],
        },
        {
          featureType: "road.highway",
          elementType: "geometry.stroke",
          stylers: [{ color: "#e9bc62" }],
        },
        {
          featureType: "road.highway.controlled_access",
          elementType: "geometry",
          stylers: [{ color: "#e98d58" }],
        },
        {
          featureType: "road.highway.controlled_access",
          elementType: "geometry.stroke",
          stylers: [{ color: "#db8555" }],
        },
        {
          featureType: "road.local",
          elementType: "labels.text.fill",
          stylers: [{ color: "#806b63" }],
        },
        {
          featureType: "transit.line",
          elementType: "geometry",
          stylers: [{ color: "#dfd2ae" }],
        },
        {
          featureType: "transit.line",
          elementType: "labels.text.fill",
          stylers: [{ color: "#8f7d77" }],
        },
        {
          featureType: "transit.line",
          elementType: "labels.text.stroke",
          stylers: [{ color: "#ebe3cd" }],
        },
        {
          featureType: "transit.station",
          elementType: "geometry",
          stylers: [{ color: "#dfd2ae" }],
        },
        {
          featureType: "water",
          elementType: "geometry.fill",
          stylers: [{ color: "#b9d3c2" }],
        },
        {
          featureType: "water",
          elementType: "labels.text.fill",
          stylers: [{ color: "#92998d" }],
        },
      ],
    });





  }

  addMyLocationButton() {
    const myLocationButton = document.getElementById("myLocationButton");

    myLocationButton.addEventListener("click", () => {
      this.zoomToCurrentLocation();
    });
  }

  zoomToCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          this.map.setCenter(pos);
          this.map.setZoom(16); // Adjust zoom level as needed

          // Remove the old marker if it exists
          if (this.currentLocationMarker) {
            this.currentLocationMarker.setMap(null);
          }

          // Optionally, add a marker at the user's current location
          new google.maps.Marker({
            position: pos,
            map: this.map,
            title: "Your current location",
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              fillColor: "#4A7DE8", // blue color for the current location
              fillOpacity: 1,
              scale: 6,
              strokeColor: "#FFFFFF",
              strokeWeight: 2,
            },
          });

          console.log("[zoomToCurrentLocation] Zoomed to current location:", pos);
        },
        () => {
          console.error("[zoomToCurrentLocation] Error: The Geolocation service failed.");
        }
      );
    } else {
      console.error("[zoomToCurrentLocation] Error: Your browser doesn't support geolocation.");
    }
  }



  addFacilityMarkers() {
    // Example JSON data
    const facilities = [
      {
        "Name": { "Description": "Adachi Ward Labor Welfare Hall" },
        "geographic coordinates": {
          "Longitude": "139.821582",
          "Latitude": "35.761076"
        }
      },
      {
        "Name": { "Description": "Ninoe Community Hall" },
        "geographic coordinates": {
          "Longitude": "139.880804",
          "Latitude": "35.676988"
        }
      },
      {
        "Name": { "Description": "Akishima City Health and Welfare Center" },
        "geographic coordinates": {
          "Longitude": "139.364108",
          "Latitude": "35.710679"
        }
      }
      // Add more facilities as needed
    ];

    facilities.forEach(facility => {
      const lat = parseFloat(facility['geographic coordinates']['Latitude']);
      const lng = parseFloat(facility['geographic coordinates']['Longitude']);

      const WashroomIcon = {
        url: 'http://res.cloudinary.com/dckq0zged/image/upload/v1724848852/taf1k3frhuuelqqxmniw.png', // washroom icon img
        scaledSize: new google.maps.Size(20, 20), // Adjust the size of the icon
        origin: new google.maps.Point(0, 0), // The origin point of the icon (optional)
        anchor: new google.maps.Point(15, 15) // The anchor point of the icon (optional, usually the center)
      };

      new google.maps.Marker({
        position: { lat: lat, lng: lng },
        map: this.map,
        title: facility.Name.Description,
        icon: WashroomIcon, // Use the custom end icon
      });

      console.log(`[addFacilityMarkers] Added marker for ${facility.Name.Description} at lat: ${lat}, lng: ${lng}`);
    });
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
        shape.geometry.coordinates.forEach((coord) => {
          const latLng = { lat: coord[1], lng: coord[0] };
          currentSection.push(latLng);
          currentBounds.extend(latLng);
        });
      } else if (currentSection.length > 0) {
        walkSections.push({ coordinates: currentSection, bounds: currentBounds });
        currentSection = [];
        currentBounds = new google.maps.LatLngBounds(); // Reset for the next section
      }
    });

    if (currentSection.length > 0) {
      walkSections.push({ coordinates: currentSection, bounds: currentBounds });
    }

    console.log("[getCoordinatesForWalkSections] Collected walk sections:", walkSections);
    return walkSections;
  }


  getCoordinatesForTransportSections() {
    const routeData = this.element.dataset.route;
    let route;
    try {
      route = JSON.parse(routeData);
      console.log("[getCoordinatesForTransportSections] Parsed route data successfully:", route);
    } catch (error) {
      console.error("[getCoordinatesForTransportSections] Failed to parse route data:", error);
      return [];
    }

    let proximityThreshold = 250; // Start with 250 meters
    let transportSections = [];

    // Function to collect transport sections based on proximity threshold
    const collectTransportSections = (threshold) => {
      let currentSection = [];
      let currentBounds = new google.maps.LatLngBounds();
      let tempSections = [];

      route.shapes.features.forEach((shape) => {
        if (shape.properties.ways === "transport") {
          shape.geometry.coordinates.forEach((coord) => {
            const latLng = { lat: coord[1], lng: coord[0] };

            // Check against all transfer points
            let isNearTransfer = route['sections'].some(section => {
              if (section['type'] === 'point' && section['node_id'] && !section['gateway']) {
                const transferCoords = { lat: section['coord']['lat'], lng: section['coord']['lon'] };
                const distance = google.maps.geometry.spherical.computeDistanceBetween(
                  new google.maps.LatLng(latLng),
                  new google.maps.LatLng(transferCoords)
                );
                return distance <= threshold;
              }
              return false;
            });

            if (isNearTransfer) {
              // If near a transfer point and currentSection has more than 1 coordinate, finalize this section
              if (currentSection.length > 1) {
                tempSections.push({ coordinates: currentSection, bounds: currentBounds });
              }
              // Start a new section
              currentSection = [];
              currentBounds = new google.maps.LatLngBounds();
            }

            currentSection.push(latLng);
            currentBounds.extend(latLng);
          });
        }
      });

      // Push the last collected transport section if it wasn't pushed yet and has more than one coordinate
      if (currentSection.length > 1) {
        tempSections.push({ coordinates: currentSection, bounds: currentBounds });
      }

      return tempSections;
    };

    // Continue reducing proximity threshold until all sections have more than one coordinate
    while (proximityThreshold > 0) {
      transportSections = collectTransportSections(proximityThreshold);
      const allSectionsValid = transportSections.every(section => section.coordinates.length > 1);

      if (allSectionsValid) {
        break; // Stop adjusting when all sections have more than one coordinate
      }

      proximityThreshold -= 50; // Decrement by 50m and check again
    }

    console.log("[getCoordinatesForTransportSections] Collected transport sections:", transportSections);
    return transportSections;
  }



  handleCardClick(event) {
    const moveType = event.currentTarget.dataset.move; // Get the move type (walk, transport, point, etc.)
    const cardIndex = event.currentTarget.dataset.index; // Get the index of the card

    //modal target
    if (moveType === "point" && event.currentTarget.dataset.coordinates) {
      const coordinates = event.currentTarget.dataset.coordinates.split(',').map(parseFloat);
      if (coordinates.length === 2) {
        console.log(`[handleCardClick] Point location found. Zooming into: lat=${coordinates[0]}, lng=${coordinates[1]}`);
        this.zoomTo({ lat: coordinates[0], lng: coordinates[1] });
      } else {
        console.error(`[handleCardClick] Invalid coordinates format for point: ${coordinates}`);
      }
    } else {
      console.error(`[handleCardClick] No matching section found for ID: ${cardIndex}`);
    }

    console.log(`[handleCardClick] Move type: ${moveType}`);
    console.log(`[handleCardClick] Index: ${cardIndex}`);

    if (moveType === "walk") {
      console.log(`[handleCardClick] This is a walk card with index: ${cardIndex}`);

      const walkSection = this.walkSections[cardIndex];

      if (walkSection) {
        console.log(`[handleCardClick] Focusing on walk section for index: ${cardIndex}`);
        this.fitMapToBounds(walkSection.bounds);
      } else {
        console.error(`[handleCardClick] No matching walk section found for index: ${cardIndex}`);
      }
    } else if (moveType === "transport") {
      console.log(`[handleCardClick] This is a transport card with index: ${cardIndex}`);

      const transportSection = this.transportSections[cardIndex];

      if (transportSection) {
        console.log(`[handleCardClick] Focusing on transport section for index: ${cardIndex}`);
        this.fitMapToBounds(transportSection.bounds);
      } else {
        console.error(`[handleCardClick] No matching transport section found for index: ${cardIndex}`);
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
      console.error(`[handleCardClick] No matching section found for ID: ${cardIndex}`);
    }
  }

  // Function to handle image clicks and open the modal
  openImageModal(event) {
    const imgSrc = event.currentTarget.getAttribute("src");
    const index = event.currentTarget.id.split('-')[1];
    const modal = new bootstrap.Modal(document.getElementById('imageModal'));
    document.getElementById('modalImage').setAttribute('src', imgSrc);
    document.getElementById('imageModalLabel').innerText = document.getElementById(`imageComment${index}`).innerText
    modal.show();
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
      strokeOpacity: isWalking ? 0 : 0.7,
      strokeWeight: 8,
      map: this.map,
      strokeLinecap: properties.inline.strokelinecap || 'round',
      strokeLinejoin: properties.inline.strokelinejoin || 'round',
    };

    if (isWalking) {
      const lineSymbol = {
        path: 'M 0,-1 0,1',
        scale: 3,
        strokeColor: '#2d7dd2', // Set the color for walking lines
        strokeOpacity: 0.7,
      };

      polylineOptions.icons = [{
        icon: lineSymbol,
        offset: '0',
        repeat: '20px'
      }];
    } else {
      polylineOptions.strokeColor = "#2364AA"; // Set the color for transport lines
    }

    const polyline = new google.maps.Polyline(polylineOptions);
    polyline.setMap(this.map);

    if (!isWalking) {
      // Custom icon for the start marker
      const startIcon = {
        path: google.maps.SymbolPath.CIRCLE, // Simple circle icon
        fillColor: 'yellow', // Green color for start
        fillOpacity: 1,
        scale: 4,
        strokeColor: 'yellow',
        strokeWeight: 2,
      };

      new google.maps.Marker({
        position: pathCoordinates[0],
        map: this.map,
        title: "Start of Transport",
        icon: startIcon, // Use the custom start icon
      });

      // Custom icon for the end marker
      const endIcon = {
        path: google.maps.SymbolPath.CIRCLE, // Arrow icon
        // fillColor: 'red', // Red color for end
        fillOpacity: 0,
        scale: 4,
        strokeColor: 'red',
        strokeWeight: 2,
      };

      new google.maps.Marker({
        position: pathCoordinates[pathCoordinates.length - 1],
        map: this.map,
        title: "End of Transport",
        icon: endIcon, // Use the custom end icon
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

    const zoomIcon = {
      path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW, // Arrow icon
        // fillColor: 'white', // Red color for end
        fillOpacity: 0,
        scale: 4,
        strokeColor: '#6C9DD1',
        strokeWeight: 1,
    };


    new google.maps.Marker({
      position: coordinates,
      map: this.map,
      icon: zoomIcon, // Use the custom end icon
      title: "Zoomed Location",
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
