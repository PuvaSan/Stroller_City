import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="another-map"
export default class extends Controller {
  static targets = [ "name", "address", "photo", "originInput", "phone", "recent"]
  connect() {
    console.log("home map connected")
    console.log(this.nameTarget, this.addressTarget)
    document.querySelector("#draggable-panel").style.height = "80vh";
        //get recent search history from local storage
        const recent = JSON.parse(localStorage.getItem('recent'))
        recent.slice(Math.max(recent.length - 5, 0)).forEach(place => {
        this.recentTarget.insertAdjacentHTML("beforeend", `<li>${place}</li>`)
        })
  }

  originAutocomplete = null;
  destinationAutocomplete = null;

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

    // autocompletes location inputs for origin and destination
    this.originAutocomplete = new google.maps.places.Autocomplete(document.getElementById('origin'))
    this.destinationAutocomplete = new google.maps.places.Autocomplete(document.getElementById('destination'))

    var paragraphs = document.querySelectorAll('#description');
    paragraphs.forEach(function(p) {
      p.style.fontSize = '10px';
    });

    this.destinationAutocomplete.addListener('place_changed', () => {
      let place = this.destinationAutocomplete.getPlace();

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
        document.querySelector("#place-description").classList.toggle("d-none");
        document.querySelector("#reviews-container").classList.toggle("d-none");
        console.log(place.name)

        if (localStorage.getItem('recent') === null) {
          let recent = [];
          recent.push(place.name);
          localStorage.setItem('recent', JSON.stringify(recent));
        } else {
          let recent = JSON.parse(localStorage.getItem('recent'));
          recent.push(place.name);
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
    const currentDateTime = new Date().toISOString().replace(/:/g, '%3A').split('.')[0];
    const origin = this.originAutocomplete.getPlace();
    const start_lat = origin.geometry.location.lat();
    const start_long = origin.geometry.location.lng();
    const destination = this.destinationAutocomplete.getPlace();
    const end_lat = destination.geometry.location.lat();
    const end_long = destination.geometry.location.lng();

    // Use the coordinates to construct the URL for the API request
    const url = `https://navitime-route-totalnavi.p.rapidapi.com/route_transit?start=${start_lat}%2C${start_long}&goal=${end_lat}%2C${end_long}&datum=wgs84&term=1440&walk_route=babycar&limit=5&start_time=${currentDateTime}&coord_unit=degree`;
    console.log(url);

    // Make the API request
    fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-rapidapi-key': 'ee4ee6a653msh2bda56689a8b341p1b0f92jsnc9c233194414',
        'x-rapidapi-host': 'navitime-route-totalnavi.p.rapidapi.com',
      },
    })
    .then(response => response.json())
    .then(data => {
      // Handle the response data
      console.log(data);

      // Construct the Rails route URL with query parameters
      const redirectUrl = `/routes?start_lat=${start_lat}&start_long=${start_long}&end_lat=${end_lat}&end_long=${end_long}&origin=${origin.name}&destination=${destination.name}`;

      // Redirect to the constructed URL
      window.location.href = redirectUrl;
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
  }

}
