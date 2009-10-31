require 'rubygems'
require 'sinatra'
require "twitter"
require 'erb'

get '/' do
  erb :multifollow
end