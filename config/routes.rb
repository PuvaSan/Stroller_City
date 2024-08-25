Rails.application.routes.draw do
  resources :routes
  resources :places do
    resources :reviews, only: [:new, :create]
  end
  post "reviews", to: "favorites#create"
  resources :favorites do
    resources :reviews, only: [:index, :new, :create]
  end

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

  patch "places/:id", to: "places#update"
end
