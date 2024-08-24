import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [ "count" ]

  handleClick(event) {
    event.preventDefault();
    const reviewId = event.currentTarget.getAttribute('data-review-id');

    fetch(`/reviews/${reviewId}/like`, {
      method: 'POST',
      headers: {
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
        'Accept': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      document.getElementById(`likes-count-${reviewId}`).textContent = data.likes_count;
    })
    .catch(error => console.error('Error:', error));
  }
}
