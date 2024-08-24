import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["likesCount"]

  handleClick(event) {
    const reviewId = this.element.dataset.reviewId

    fetch(`/reviews/${reviewId}/like/toggle`, {
      method: "POST",
      headers: {
        "X-CSRF-Token": document.querySelector("[name='csrf-token']").content,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ review_id: reviewId })
    })
      .then(response => response.json())
      .then(data => {
        this.likesCountTarget.innerText = data.likes_count
        this.updateButtonState(data.liked)
      })
  }

  updateButtonState(liked) {
    if (liked) {
      this.element.innerHTML = '<i class="fas fa-thumbs-up"></i> <span id="likes-count-' + this.element.dataset.reviewId + '">' + this.likesCountTarget.innerText + '</span> Undo Like'
    } else {
      this.element.innerHTML = '<i class="fas fa-thumbs-up"></i> <span id="likes-count-' + this.element.dataset.reviewId + '">' + this.likesCountTarget.innerText + '</span> Like'
    }
  }
}
