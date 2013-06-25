Ajaxtodo::Application.routes.draw do
  root :to => 'home#index'
  resources :tasks, only: [:new, :index, :create]
  resources :priorities, only: [:new, :index, :create]
  post 'sort' => 'tasks#sort'
end
