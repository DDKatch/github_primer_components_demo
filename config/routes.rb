Rails.application.routes.draw do
  resources :proposals
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"
  post "/proposal_form_validate/destination", to: "auto_check#validate_destination", as: :proposal_form_validate_destination
end
