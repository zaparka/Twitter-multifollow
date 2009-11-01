require 'rubygems'
require 'sinatra'
require "twitter"
require 'erb'

get '/' do
  erb :multifollow
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

get '/js/multifollow.js' do
  headers 'Content-Type' => 'text/javascript; charset=utf-8'
  File.read( File.join( File.dirname( __FILE__ ), 'js', 'multifollow.js' ) )
end

get '/js/jquery-1.3.2.min.js' do
  headers 'Content-Type' => 'text/javascript; charset=utf-8'
  File.read( File.join( File.dirname( __FILE__ ), 'js', 'jquery-1.3.2.min.js' ) )
end