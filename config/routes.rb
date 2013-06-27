Ajaxtodo::Application.routes.draw do
  root :to => 'home#index'
  resources :tasks, only: [:update, :new, :index, :create, :destroy]
  resources :priorities, only: [:new, :index, :create]
  post 'sort' => 'tasks#sort'

  resources :tasks do
    put :arrowup
    put :arrowdown
  end
end
