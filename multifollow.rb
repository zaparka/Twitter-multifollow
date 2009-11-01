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
  puts client.friendship_exists?( 'multifollow','zaparka')
  if false == ( client.friendship_exists?('multifollow','zaparka') )
   puts client.friendship_create( 49387111, true )
  else
   puts client.friendship_destroy( 49387111 )
  end
end

def login( name, login )
  httpauth = Twitter::HTTPAuth.new( name, login )
  client = Twitter::Base.new(httpauth)
  client
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