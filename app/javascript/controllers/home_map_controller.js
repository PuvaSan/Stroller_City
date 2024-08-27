import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="another-map"
export default class extends Controller {
  static targets = [ "name", "address", "photo", "originInput", "phone", "info", "recent", "recommended","recent"]
  connect() {
    console.log("home map connected")
    //get recent search history from local storage
    const recent = JSON.parse(localStorage.getItem('recent'))
    recent.slice(Math.max(recent.length - 5, 0)).forEach(place => {
              this.recentTarget.insertAdjacentHTML("beforeend", `<div id="${place.id}" data-action="click->home-map#javi" class="card-category me-3" style="width: 180px; background-image: linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${place.photo.trim()})">${place.name}</div>`);
            });
    document.getElementById("current-location").innerText = this.getCurrentPosition();
    this.initMap();
    document.getElementById('tags-container').innerHTML = '';
    let modalInputs = document.querySelectorAll('.modal-body input');
    modalInputs.forEach(input => {
      input.checked = false;
    });
    document.getElementById('hiddenPlaceId').value = "";
  }

  apiKey = "AIzaSyA4qrApURx9lwvAae-pPmNbV07vPqlbHxo";

  //Switches the Ikumi container based on the button clicked
  ikumibutton(event) {
    const buttonId = event.currentTarget.id;
    const selectedContainer = document.getElementById(`${buttonId}-container`);
    const containers = document.querySelectorAll(".ikumi-container > *");
    containers.forEach(container => {
      if (!container.classList.contains("d-none")) {
        container.classList.add("d-none");
      }
    });
    selectedContainer.classList.remove("d-none");
  }

  originAutocomplete = null;
  destinationAutocomplete = null;

  origin = null;

  map = null;

  initMap() {
    this.map = new google.maps.Map(document.getElementById('map'),{
      center:{lat:35.652832,lng:139.839478},
      zoom:13,
      disableDefaultUI: true,
    })
    google.maps.event.addListener(this.map,"click",function(event) {
      this.setOptions({scrollwheel:true})
    })

    // adds transit layer over our map
    const transitLayer = new google.maps.TransitLayer();
    transitLayer.setMap(this.map);


    this.map.setOptions({ styles: this.retro });

    // autocompletes location inputs for origin and destination
    this.originAutocomplete = new google.maps.places.Autocomplete(document.getElementById('origin'))
    this.destinationAutocomplete = new google.maps.places.Autocomplete(document.getElementById('destination'))

    this.originAutocomplete.addListener('place_changed', () => {
      this.origin = this.originAutocomplete.getPlace();
    });

    this.destinationAutocomplete.addListener('place_changed', () => {
      let place = this.destinationAutocomplete.getPlace();
      // recenters map when input is changed to a google place
      if (place.geometry && place.geometry.location) {
        this.map.setCenter( place.geometry.location );
        this.map.setZoom(15);
        // Add marker to the selected place
        const marker = new google.maps.Marker({
          position: place.geometry.location,
          map: this.map,
          title: place.name
        });

        this.getCurrentPosition();

        // displays place name, address, and photos
        this.nameTarget.innerText = place.name;
        this.addressTarget.innerText = place.formatted_address;
        this.phoneTarget.innerText = place.formatted_phone_number
        if (place.editorial_summary) {
          this.infoTarget.innerText = place.editorial_summary
        }
        this.photoTarget.innerHTML = "";
        place.photos.slice(0, 5).forEach((photo) => {
          const placeImage = photo.getUrl();

          const imgElement = `<img height=80 width=80 class="me-2" src="${placeImage}" />`;
          this.photoTarget.insertAdjacentHTML("beforeend", imgElement);
        });
        document.querySelector("#draggable-panel").style.height = "350px";
        document.querySelector("#draggable-panel").style.borderRadius = "16px 16px 0 0";
        document.querySelector("#initial-content").classList.toggle("d-none");
        document.querySelector("#place-description").classList.toggle("d-none");
        document.getElementById("first-back-button").classList.toggle("d-none");
        this.originInputTarget.classList.toggle("d-none")
        document.getElementById("destination").parentElement.classList.add("d-none")

        if (localStorage.getItem('recent') === null) {
          let recent = [];
          recent.push({ name: place.name, photo: place.photos[0].getUrl(), id: place.place_id });
          localStorage.setItem('recent', JSON.stringify(recent));
        } else {
          let recent = JSON.parse(localStorage.getItem('recent'));
          recent.push({ name: place.name, photo: place.photos[0].getUrl(), id: place.place_id });
          localStorage.setItem('recent', JSON.stringify(recent));
        }

        // Send the place name to Rails controller via AJAX
        if (place.name) {
          fetch('/pages/receive_place_name', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
            },
            body: JSON.stringify({ place_name: place.name })
          })
          .then(response => response.json())
          .then(data => {
            console.log("Place name sent successfully", data);
            if (data.status === "success") {
              // Fetch the reviews partial and insert it into the reviews section
              fetch(`/pages/render_reviews?id=${data.id}`)
                .then(response => response.text())
                .then(html => {
                  document.getElementById('reviews-container').innerHTML = html;
                });

              fetch(`/pages/render_tags?id=${data.id}`)
                .then(response => response.text())
                  .then(html => {
                    document.getElementById('tags-container').insertAdjacentHTML("afterbegin", html);
                    let modalInputs = document.querySelectorAll('.modal-body input');
                    let placeTags = [...document.querySelectorAll('.aya-tags')].map(tag => tag.innerText);
                    modalInputs.forEach(input => {
                      if (placeTags.includes(input.name)) {
                        input.checked = true;
                      }
                    });
                    document.getElementById("placeTagsForm").action = `/places/${data.id}`;
                    document.getElementById('hiddenPlaceId').value = data.id;
                  });
            } else {
              console.error("Error:", data.message);
              document.getElementById("placeTagsForm").action = `/places`;
              document.getElementById('hiddenPlaceId').value = place.place_id;
            }
          })
          .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
          });
        }
      }
    });
  }

  user_lat = null;
  user_long = null;
  getCurrentPosition() {
    //sets origin to user's current location
    navigator.geolocation.getCurrentPosition((position) => {
      this.user_lat = position.coords.latitude;
      this.user_long = position.coords.longitude;
      fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.user_lat},${this.user_long}&key=${this.apiKey}`)
        .then(response => response.json())
        .then(data => {
          document.getElementById('origin').value = data.results[0].formatted_address
          const addressComponents = data.results[0].address_components;
          const localityComponent = addressComponents.find(component => component.types.includes('locality'));;
          document.getElementById("current-location").innerText = localityComponent.long_name;
        })
    })
    this.origin = undefined;
  }

  firstBack() {
    document.querySelector("#initial-content").classList.toggle("d-none");
    document.querySelector("#place-description").classList.toggle("d-none");
    document.querySelector("#reviews-container").classList.add("d-none");
    document.getElementById("first-back-button").classList.toggle("d-none");
    this.originInputTarget.classList.toggle("d-none")
    document.getElementById("destination").parentElement.classList.toggle("d-none")
    this.destinationAutocomplete = new google.maps.places.Autocomplete(document.getElementById('destination'))
    document.getElementById('tags-container').innerHTML = '';
    let modalInputs = document.querySelectorAll('.modal-body input');
    modalInputs.forEach(input => {
      input.checked = false;
    });
    document.getElementById('hiddenPlaceId').value = "";
  }

  direct(event) {
    const currentDateTime = new Date().toISOString().replace(/:/g, '%3A').split('.')[0];
    let start_lat = 0;
    let start_long = 0;
    if (this.origin) {
      start_lat = this.origin.geometry.location.lat();
      start_long = this.origin.geometry.location.lng();
    }
    else {
      start_lat = this.user_lat;
      start_long = this.user_long;
      this.origin = { name: "Your current location" };
    }

    let destination = this.destinationAutocomplete.getPlace();
    if (destination === undefined) {
      const buttonId = event.currentTarget.dataset.value;
      // const url = `https://maps.googleapis.com/maps/api/place/details/json?fields=name%2Cphoto%2Cformatted_phone%2Cformatted_address%2Cgeometry%2Cphoto&place_id=${buttonId}&key=AIzaSyA4qrApURx9lwvAae-pPmNbV07vPqlbHxo`
      const url = `https://places.googleapis.com/v1/places/${buttonId}?fields=displayName,formattedAddress,photos,location,nationalPhoneNumber,editorialSummary&key=${this.apiKey}`
      fetch(url)
        .then(response => response.json())
        .then(data => {
          destination = data;

          const end_lat = destination.location.latitude;
          const end_long = destination.location.longitude;

            // Construct the Rails route URL with query parameters
          const redirectUrl = `/routes?start_lat=${start_lat}&start_long=${start_long}&end_lat=${end_lat}&end_long=${end_long}&origin=${this.origin.name}&destination=${destination.displayName.text}`;

          // Redirect to the constructed URL
          window.location.href = redirectUrl;
      });
    }
    const end_lat = destination.geometry.location.lat();
    const end_long = destination.geometry.location.lng();

      // Construct the Rails route URL with query parameters
    const redirectUrl = `/routes?start_lat=${start_lat}&start_long=${start_long}&end_lat=${end_lat}&end_long=${end_long}&origin=${this.origin.name}&destination=${destination.name}`;

    // Redirect to the constructed URL
    window.location.href = redirectUrl;
  }

  javi(event) {
    const buttonId = event.currentTarget.id;
    // const url = `https://maps.googleapis.com/maps/api/place/details/json?fields=name%2Cphoto%2Cformatted_phone%2Cformatted_address%2Cgeometry%2Cphoto&place_id=${buttonId}&key=AIzaSyA4qrApURx9lwvAae-pPmNbV07vPqlbHxo`
    const url = `https://places.googleapis.com/v1/places/${buttonId}?fields=displayName,formattedAddress,photos,location,nationalPhoneNumber,editorialSummary&key=${this.apiKey}`
    fetch(url)
      .then(response => response.json())
      .then(data => {
        const place = data;

        // recenters map when input is changed to a google place
        if (place.location) {
          this.map.setCenter( { lat: place.location.latitude, lng: place.location.longitude });
          this.map.setZoom(15);
          // Add marker to the selected place
          const marker = new google.maps.Marker({
            position: { lat: place.location.latitude, lng: place.location.longitude },
            map: this.map,
            title: place.displayName.text
          });

          this.getCurrentPosition();

          // displays place name, address, and photos
          this.nameTarget.innerText = place.displayName.text;
          this.addressTarget.innerText = place.formattedAddress;
          this.phoneTarget.innerText = place.nationalPhoneNumber
          if (place.editorialSummary) {
            this.infoTarget.innerText = place.editorialSummary.text
          }
          this.photoTarget.innerHTML = "";
          place.photos.slice(0, 5).forEach((photo) => {
            const placeImage = `https://places.googleapis.com/v1/${photo.name}/media?maxHeightPx=400&maxWidthPx=400&key=${this.apiKey}`
            const imgElement = `<img height=80 width=80 class="me-2" src="${placeImage}" />`;
            this.photoTarget.insertAdjacentHTML("beforeend", imgElement);
          });
          document.querySelector("#draggable-panel").style.height = "350px";
          document.querySelector("#draggable-panel").style.borderRadius = "16px 16px 0 0";
          document.querySelector("#initial-content").classList.toggle("d-none");
          document.querySelector("#place-description").classList.toggle("d-none");
          document.getElementById("first-back-button").classList.toggle("d-none");
          document.getElementById("go-button").dataset.value = buttonId;
          document.getElementById('destination').value = "";
          this.destinationAutocomplete = new google.maps.places.Autocomplete(document.getElementById('destination'))
          this.originInputTarget.classList.toggle("d-none")
          document.getElementById("destination").parentElement.classList.add("d-none")

          // Send the place name to Rails controller via AJAX
          if (place.displayName) {
            fetch('/pages/receive_place_name', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
              },
              body: JSON.stringify({ place_name: place.displayName.text })
            })
            .then(response => response.json())
            .then(data => {
              console.log("Place name sent successfully", data);
              if (data.status === "success") {
                // Fetch the reviews partial and insert it into the reviews section
                fetch(`/pages/render_reviews?id=${data.id}`)
                  .then(response => response.text())
                  .then(html => {
                    document.getElementById('reviews-container').innerHTML = html;
                  });
                fetch(`/pages/render_tags?id=${data.id}`)
                  .then(response => response.text())
                  .then(html => {
                    document.getElementById('tags-container').insertAdjacentHTML("afterbegin", html);
                    let modalInputs = document.querySelectorAll('.modal-body input');
                    let placeTags = [...document.querySelectorAll('.aya-tags')].map(tag => tag.innerText);
                    modalInputs.forEach(input => {
                      if (placeTags.includes(input.name)) {
                        input.checked = true;
                      }
                    });
                    document.getElementById("placeTagsForm").action = `/places/${data.id}`;
                    document.getElementById('hiddenPlaceId').value = data.id;
                  });
              } else {
                console.error("Error:", data.message);
                document.getElementById("placeTagsForm").action = `/places`;
                document.getElementById('hiddenPlaceId').value = buttonId;
              }
            })
            .catch(error => {
              console.error('There was a problem with the fetch operation:', error);
            });
          }
      }
    });
  }

  //map styling
  retro = [
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
  ];

}
