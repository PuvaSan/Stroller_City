import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="another-map"
export default class extends Controller {
  static targets = [ "name", "address", "photo", "originInput", "phone"]
  connect() {
    console.log("home map connected")
    console.log(this.nameTarget, this.addressTarget)
    document.querySelector("#draggable-panel").style.height = "92vh";

  }

  directionsService = null
  directionsRenderer = null

  async initMap() {
    let map = new google.maps.Map(document.getElementById('map'),{
      center:{lat:35.652832,lng:139.839478},
      zoom:13
    })
    google.maps.event.addListener(map,"click",function(event) {
      this.setOptions({scrollwheel:true})
    })

    // adds transit layer over our map
    const transitLayer = new google.maps.TransitLayer();
    transitLayer.setMap(map);

    // initializes direction renderer on map
    this.directionsService = new google.maps.DirectionsService()
    this.directionsRenderer = new google.maps.DirectionsRenderer()
    this.directionsRenderer.setMap(map)

    // autocompletes location inputs for origin and destination
    let originAutocomplete = new google.maps.places.Autocomplete(document.getElementById('origin'))
    let destinationAutocomplete = new google.maps.places.Autocomplete(document.getElementById('destination'))

    var paragraphs = document.querySelectorAll('#description');
    paragraphs.forEach(function(p) {
      p.style.fontSize = '10px';
    });
    // recenters map when input is changed to a google place
    destinationAutocomplete.addListener('place_changed', () => {
      let place = destinationAutocomplete.getPlace();

      // recenters map when input is changed to a google place
      if (place.geometry && place.geometry.location) {
        map.setCenter(place.geometry.location);
        map.setZoom(15);

        // displays place name, address, and photos
        this.nameTarget.innerText = place.name;
        this.addressTarget.innerText = place.formatted_address;
        this.phoneTarget.innerText = place.formatted_phone_number
        this.photoTarget.innerHTML = "";
        console.log(place)
        place.photos.slice(0, 3).forEach((photo) => {
          const placeImage = photo.getUrl();
          const imgElement = `<img height=100 class="m-3" src="${placeImage}" />`;
          this.photoTarget.insertAdjacentHTML("beforeend", imgElement);
        });
        document.querySelector("#draggable-panel").style.height = "80vh";
        document.querySelector("#draggable-panel").style.borderRadius = "0px";
        document.querySelector("#initial-content").outerHTML = "";
        document.querySelectorAll("#icon").forEach(element => {
          element.classList.toggle("d-none");
        });
        document.querySelector("#directions-button").classList.toggle("d-none");
        console.log(place.name)

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
            } else {
              console.error("Error:", data.message);
            }
          })
          .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
          });

        }
      }
    });
  }

  showStuff() {
    this.originInputTarget.classList.toggle("d-none")
    document.getElementById("go-button").classList.toggle("d-none")
  }

  direct() {
    // DONT REMOVE THESE, IT'S FOR FUTURE IMPLEMENTATION
    // map renderer
    // this.directionsService.route({
    //   origin: document.getElementById('origin').value,
    //   destination: document.getElementById('destination').value,
    //   travelMode: 'WALKING'
    // }, (response, status) => {
    //   if(status === 'OK') {
    //     console.log(response)
    //     this.directionsRenderer.setDirections(response);
    //   } else {
    //     window.alert('Directions request failed due to ' + status);
    //   }
    // });

    // displays directions panel
    // let panel = document.getElementById('directions-panel');
    // this.directionsRenderer.setPanel(panel);

    //route index
    fetch(`/routes`)
      .then(response => response.text())
      .then(html => {
        document.getElementById('panel-content').innerHTML = html;
      });
  }
}
