Rails.application.routes.draw do
  resources :routes
  resources :places do
    resources :reviews, only: [:new, :create]
  end
  post "reviews", to: "reviews#create"

  devise_for :users
  root to: "pages#home"

  #this sends the api placename to the controller
  post 'pages/receive_place_name', to: 'pages#receive_place_name'

  #this sends the api placename to the controller
  get 'pages/render_reviews', to: 'pages#render_reviews'
  get 'pages/render_tags', to: 'pages#render_tags'


  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"
  get "end_reviews/:place_ids", to: "reviews#end_reviews", as: :end_reviews

  patch "places/:id", to: "places#update"

  post "/places/end_reviews", to: "places#end_reviews"

  delete "reviews/:id", to: "reviews#destroy", as: :delete_review
end
