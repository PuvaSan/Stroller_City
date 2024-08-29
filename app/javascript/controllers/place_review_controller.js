import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="place-review"
export default class extends Controller {
  connect() {
  }

  sendStuff(event) {
    event.preventDefault()

    fetch(`/reviews`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
      },
      body: new FormData(document.getElementById('placeReviewsForm'))
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === "success") {
          console.log("success")
          // Fetch the reviews partial and insert it into the reviews section
          fetch(`/pages/render_reviews?id=${data.id}`)
            .then(response => response.text())
            .then(html => {
              document.getElementById('reviews-container').innerHTML = html;
            });

            const modal = document.getElementById('addReviewsModal');
            const bootstrapModal = bootstrap.Modal.getInstance(modal);
            if (bootstrapModal) {
              bootstrapModal.hide();
            }
        } else {
          console.error("Error:", data.message);
        }
      });
  }
}
