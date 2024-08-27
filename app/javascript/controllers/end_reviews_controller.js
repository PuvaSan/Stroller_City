import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="end-reviews"
export default class extends Controller {
  connect() {
    let places = [...document.querySelectorAll('h4')].map(place => place.innerText)
    let idInputs = document.querySelectorAll('input[type="hidden"]')
    const url = 'https://places.googleapis.com/v1/places:searchText';
    const apiKey = "AIzaSyCWOSZTJ-G738Y4qoVuyVHh1YYjtWUSlao";
    const headers = {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': 'places.id'
    };
    places.forEach((place, index) => {
      fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ textQuery: place })
      })
        .then(response => response.json())
        .then(data => {
          let id = data.places[0].id
          idInputs[index].value = id
        })
    });
  }

}
