// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"
import "controllers"
import "@popperjs/core"
import "bootstrap"

import { Application } from "@hotwired/stimulus"
// import { autoload } from "@hotwired/stimulus-loading"

const application = Application.start()
// autoload("controllers", application)
document.addEventListener("turbo:load", function() {
  // Suggested button
  document.getElementById('suggested-btn').addEventListener('click', function(event) {
    event.preventDefault();
    showSuggested();
    // Update button styles
    suggestedBtn.classList.add('btn-primary');
    suggestedBtn.classList.remove('btn-light');
    mylistBtn.classList.add('btn-light');
    mylistBtn.classList.remove('btn-primary');
    createBtn.classList.add('btn-light');
    createBtn.classList.remove('btn-primary');

    // Show/Hide content sections
    suggestedContent.classList.remove('d-none');
    mylistContent.classList.add('d-none');
    createContent.classList.add('d-none');
  });

  // My List button
  document.getElementById('mylist-btn').addEventListener('click', function(event) {
    event.preventDefault();
    showMyList();
    // Update button styles
    mylistBtn.classList.add('btn-primary');
    mylistBtn.classList.remove('btn-light');
    suggestedBtn.classList.add('btn-light');
    suggestedBtn.classList.remove('btn-primary');
    createBtn.classList.add('btn-light');
    createBtn.classList.remove('btn-primary');

    // Show/Hide content sections
    mylistContent.classList.remove('d-none');
    suggestedContent.classList.add('d-none');
    createContent.classList.add('d-none');
  });

  // Create button
  document.getElementById('create-btn').addEventListener('click', function(event) {
    event.preventDefault();
    showCreate();
    // Update button styles
    createBtn.classList.add('btn-primary');
    createBtn.classList.remove('btn-light');
    mylistBtn.classList.add('btn-light');
    mylistBtn.classList.remove('btn-primary');
    suggestedBtn.classList.add('btn-light');
    suggestedBtn.classList.remove('btn-primary');

    // Show/Hide content sections
    createContent.classList.remove('d-none');
    mylistContent.classList.add('d-none');
    suggestedContent.classList.add('d-none');
  });

  // Show suggested section
  function showSuggested() {
    document.getElementById('suggested-btn').classList.add('btn-primary');
    document.getElementById('suggested-btn').classList.remove('btn-light');
    document.getElementById('mylist-btn').classList.add('btn-light');
    document.getElementById('mylist-btn').classList.remove('btn-primary');

    document.getElementById('suggested-content').classList.remove('d-none');
    document.getElementById('mylist-content').classList.add('d-none');
    document.getElementById('create-content').classList.add('d-none');
  }

  // Show My List section
  function showMyList() {
    document.getElementById('mylist-btn').classList.add('btn-primary');
    document.getElementById('mylist-btn').classList.remove('btn-light');
    document.getElementById('suggested-btn').classList.add('btn-light');
    document.getElementById('suggested-btn').classList.remove('btn-primary');

    document.getElementById('mylist-content').classList.remove('d-none');
    document.getElementById('suggested-content').classList.add('d-none');
    document.getElementById('create-content').classList.add('d-none');
  }

  // Show Create section
  function showCreate() {
    document.getElementById('create-btn').classList.add('btn-primary');
    document.getElementById('create-btn').classList.remove('btn-light');
    document.getElementById('mylist-btn').classList.add('btn-light');
    document.getElementById('mylist-btn').classList.remove('btn-primary');
    document.getElementById('suggested-btn').classList.add('btn-light');
    document.getElementById('suggested-btn').classList.remove('btn-primary');

    document.getElementById('create-content').classList.remove('d-none');
    document.getElementById('suggested-content').classList.add('d-none');
    document.getElementById('mylist-content').classList.add('d-none');
  }
});
