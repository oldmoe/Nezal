class CommentsController < ApplicationController 
  
  enable :sessions
  
  set :views, ::File.dirname(::File.dirname(__FILE__)) +  '/views/studio'
  
  get  '' do
    { :comments => Comment.after( @user[:app_id], params[:match_id]) }.to_json
  end

  get  '/:match_id' do
    { :comments => Comment.after( @user[:app_id], params[:match_id]) }.to_json
  end

  get  '/:match_id/:comment_id' do
    { :comments => Comment.after( @user[:app_id], params[:match_id], params[:comment_id]) }.to_json
  end
  
  post '' do
    comment = Comment.new(:user => @user, :match_id => params[:match_id], :message => params["message"])
    if comment.valid?
      comment.save
    end
  end

  post '/:match_id' do
    comment = Comment.new(:user => @user, :match_id => params[:match_id].to_i, :message => params["message"])
    if comment.valid?
      comment.save
    end
  end

end
