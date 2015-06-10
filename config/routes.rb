Rails.application.routes.draw do
  root 'static_pages#index'
  #routes that send GET requests to the companies table
  resources :companies, :only => [:index, :show] 
  #routes that send GET requests to the patents table
  resources :patents, :only => [:index, :show]

  get 'test', to: 'companies#test'
end
