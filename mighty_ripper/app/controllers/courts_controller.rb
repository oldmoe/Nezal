class CourtsController < ApplicationController 
  
  set :views, ::File.dirname(::File.dirname(__FILE__)) +  '/views/courts'
  
  get '' do 
    @game_id = env['rack_router.params'][:game_id]
    @courts = Court.find(@game_id)
    @court = @courts[0] if @courts && !@courts.empty?
    erb :show , {:layout => :app}
  end
  
end
