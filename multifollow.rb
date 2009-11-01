require 'rubygems'
require 'sinatra'
require "twitter"
require 'erb'

get '/' do
  erb :multifollow
end

get '/:name' do
  user = Twitter.user( params[ :name ] )
  if user.has_key?( 'name' )
    list_followed_twitters( params[ :name ] )
  else 
    erb "false"
  end
end

post '/login' do
  httpauth = Twitter::HTTPAuth.new( params[ :name ], params[ :password ] )
  client = Twitter::Base.new(httpauth)
  begin
    @client_data = client.verify_credentials
    erb :client_data
    rescue StandardError
      erb "false"
  end
end

def list_followed_twitters( user )
  @users_list = Array.new
  Twitter.friend_ids( user ).each do | friend |
    @users_list << Twitter.user( friend )
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