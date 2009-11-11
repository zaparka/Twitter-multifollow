require 'rubygems'
require 'sinatra'
require "twitter"
require 'erb'

get '/' do
  erb :multifollow
end

get '/find/:name' do
  user = Twitter.user( params[ :name ] )
  if user.has_key?( 'name' )
    list_followed_twitters( params[ :name ] )
  else
    erb "false"
  end
end

get '/:id' do
  @user = Twitter.user( params[ :id ] )
  if @user.has_key?( 'name' )
    erb :user
  else
    erb "false"
  end
end

post '/login' do
  client = login( params[ :name ], params[ :password ] )
  begin
    @client_data = client.verify_credentials
    erb :client_data
  rescue StandardError
    erb "false"
  end
end

put '/' do
  client = login( params[ :name ], params[ :password ] )
  params[ :requested_follow_ids ].split( ',' ).each do | request_id |
    if  !( client.friendship_exists?( params[ :name ], request_id ) )
      client.friendship_create( request_id, true )
    end
  end
  erb "Follow requests sucessfully completed."
end

def login( name, login )
  httpauth = Twitter::HTTPAuth.new( name, login )
  Twitter::Base.new( httpauth )
end

def list_followed_twitters( user )
  @users_list = Array.new
  Twitter.friend_ids( user ).each do | friend |
    @users_list << friend
  end
  erb :users_list
end

get '/js/multifollow.js' do
  headers 'Content-Type' => 'text/javascript; charset=utf-8'
  File.read( File.join( File.dirname( __FILE__ ), 'js', 'multifollow.js' ) )
end

get '/js/jquery-1.3.2.min.js' do
  headers 'Content-Type' => 'text/javascript; charset=utf-8'
  File.read( File.join( File.dirname( __FILE__ ), 'js', 'jquery-1.3.2.min.js' ) )
end

get '/css/multifollow.css' do
  headers 'Content-Type' => 'text/css; charset=utf-8'
  File.read(File.join(File.dirname(__FILE__), 'css', 'multifollow.css' ) )
end

get '/img/loader.gif' do
  headers 'Content-Type' => 'image/jpeg;'
  File.read(File.join(File.dirname(__FILE__), 'img', 'loader.gif' ) )
end