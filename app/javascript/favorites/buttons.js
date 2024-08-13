document.addEventListener('DOMContentLoaded', function() {
  const suggestedBtn = document.getElementById('suggested-btn');
  const mylistBtn = document.getElementById('mylist-btn');
  const createBtn = document.getElementById('create-btn');

  const suggestedContent = document.getElementById('suggested-content');
  const mylistContent = document.getElementById('mylist-content');
  const createContent = document.getElementById('create-content');

  suggestedBtn.addEventListener('click', function(event) {
    event.preventDefault();
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

  mylistBtn.addEventListener('click', function(event) {
    event.preventDefault();
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

  createBtn.addEventListener('click', function(event) {
    event.preventDefault();
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
});
