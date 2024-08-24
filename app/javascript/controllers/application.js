import { Application } from "@hotwired/stimulus"

const application = Application.start()

// likes is not working when useing the code below
// application.register("like", LikeController)

// Configure Stimulus development experience
application.debug = false
window.Stimulus   = application

export { application }
