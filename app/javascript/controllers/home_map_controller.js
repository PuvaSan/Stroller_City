import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="another-map"
export default class extends Controller {
  connect() {
    console.log("home map connected")
  }

  constructor() {
    super();
    this.directionsRenderer;
    this.directionsService;
  }

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
    let originAutocomplete = new google.maps.places.Autocomplete(document.getElementById('origin'))
    let destinationAutocomplete = new google.maps.places.Autocomplete(document.getElementById('destination'))

    // recenters map when input is changed to a google place
    destinationAutocomplete.addListener('place_changed', () => {
      let place = destinationAutocomplete.getPlace();
      if (place.geometry && place.geometry.location) {
        map.setCenter(place.geometry.location);
        map.setZoom(15);
        // Add a marker at the new center
        new google.maps.Marker({
          position: place.geometry.location,
          map: map
        });
        console.log("this is a place", place);
      }
    });
  }
//  def showplace(place) {
//    console.log(place)
//    document.querySelector("#place").innerHTML = `show.html.erb`
//  }

  // calculateAndDisplayRoute() {
  //   // initializes direction renderer on map
  //   this.directionsService = new google.maps.DirectionsService()
  //   this.directionsRenderer = new google.maps.DirectionsRenderer()
  //   this.directionsRenderer.setMap(map)

  //   this.directionsService.route({
  //     origin: document.getElementById('origin').value,
  //     destination: document.getElementById('destination').value,
  //     travelMode: 'TRANSIT'
  //   }, (response, status) => {
  //     if(status === 'OK') {
  //       this.directionsRenderer.setDirections(response);
  //     } else {
  //       window.alert('Directions request failed due to ' + status);
  //     }
  //   });

  //   this.showDirectionsSteps();
  // }

  // showDirectionsSteps() {
  //   let panel = document.getElementById('directions-panel');
  //   this.directionsRenderer.setPanel(panel);
  // }
}
