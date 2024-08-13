document.addEventListener('DOMContentLoaded', function () {
  // Suggested button
  document.getElementById('suggested-btn').addEventListener('click', function(event) {
    event.preventDefault();
    showSuggested();
  });

  // My List button
  document.getElementById('mylist-btn').addEventListener('click', function(event) {
    event.preventDefault();
    showMyList();
  });

  // Create button
  document.getElementById('create-btn').addEventListener('click', function(event) {
    event.preventDefault();
    showCreate();
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
