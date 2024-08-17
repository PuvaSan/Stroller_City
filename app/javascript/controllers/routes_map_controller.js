import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["content", "map"]

  connect() {
    console.log("Routes map controller connected");
    this.initMap();
  }

  initMap() {
    this.map = new google.maps.Map(this.mapTarget, {
      center: { lat: 35.652832, lng: 139.839478 },
      zoom: 13
    });

    const transitLayer = new google.maps.TransitLayer();
    transitLayer.setMap(this.map);
  }

  zoomTo(event) {
    const lat = parseFloat(event.currentTarget.dataset.lat);
    const lng = parseFloat(event.currentTarget.dataset.lng);
    const position = { lat, lng };

    this.map.setCenter(position);
    this.map.setZoom(18);

    new google.maps.Marker({
      position,
      map: this.map,
    });
  }
}
