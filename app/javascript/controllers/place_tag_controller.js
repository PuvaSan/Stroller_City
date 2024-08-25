import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="place-tag"
export default class extends Controller {
  connect() {
    console.log('place tag controller connected')
  }

  // editTags() {
  //   const checkboxes = document.querySelectorAll('.modal-body input')
  //   for (const p of document.querySelectorAll("#tags-container p")) {
  //     if (p.textContent.includes("stroller rentals")) {
  //       console.log(p)
  //     }
  //   }
  // }

  sendStuff(event) {
    event.preventDefault()
    if (document.getElementById("placeTagsForm").action.endsWith('/places')) {
      const checkboxes = document.querySelectorAll('.modal-body input')
      let tags = []
      for (const checkbox of checkboxes) {
        if (checkbox.checked) {
          tags.push(checkbox.name)
        }
      }
      const placeId = document.getElementById('hiddenPlaceId').value;
      console.log(`placeid:${placeId}`)
      console.log(`tags:${tags}`)
      fetch(`/places`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
        },
        body: JSON.stringify({ tags: tags, placeId: placeId })
      })
        .then(response => response.json())
        .then((data) => {
          console.log(`first fetch data: ${data}`)
          fetch(`/pages/render_tags?id=${data.id}`)
            .then(response => response.text())
            .then(html => {
              document.getElementById('tags-container').insertAdjacentHTML("afterbegin", html);
              let modalInputs = document.querySelectorAll('.modal-body input');
              let placeTags = [...document.querySelectorAll('.aya-tags')].map(tag => tag.innerText);
              modalInputs.forEach(input => {
                if (placeTags.includes(input.name)) {
                  input.checked = true;
                }
              });
              document.getElementById("placeTagsForm").action = `/places/${data.id}`;
              document.getElementById('hiddenPlaceId').value = data.id;
            });
          document.getElementById('addTagsModal').classList.remove('show');
          document.querySelectorAll('.modal-backdrop').forEach(m =>{
            m.classList.remove('show');
          })
        })
    }

    if (/\/places\/\d+$/.test(document.getElementById("placeTagsForm").action)) {
      const checkboxes = document.querySelectorAll('.modal-body input')
      let tags = []
      for (const checkbox of checkboxes) {
        if (checkbox.checked) {
          tags.push(checkbox.name)
        }
      }
      const placeId = document.getElementById('hiddenPlaceId').value;
      console.log(`placeid:${placeId}`)
      console.log(`tags:${tags}`)
      fetch(`/places/${placeId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
        },
        body: JSON.stringify({ tags: tags, placeId: placeId })
      })
        .then(response => response.json())
        .then((data) => {
          console.log(`first fetch data: ${data}`)
          fetch(`/pages/render_tags?id=${data.id}`)
            .then(response => response.text())
            .then(html => {
              document.getElementById('tags-container').innerHTML = '';
              document.getElementById('tags-container').insertAdjacentHTML("afterbegin", html);
              let modalInputs = document.querySelectorAll('.modal-body input');
              let placeTags = [...document.querySelectorAll('.aya-tags')].map(tag => tag.innerText);
              modalInputs.forEach(input => {
                if (placeTags.includes(input.name)) {
                  input.checked = true;
                }
              });
              document.getElementById("placeTagsForm").action = `/places/${data.id}`;
              document.getElementById('hiddenPlaceId').value = data.id;
            });
          document.getElementById('addTagsModal').classList.remove('show');
          document.querySelectorAll('.modal-backdrop').forEach(m =>{
            m.classList.remove('show');
          })
        })
    }
  }
}
