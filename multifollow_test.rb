require 'multifollow'
require 'test/unit'
require 'rack/test'

set :environment, :test

class MultifollowTest < Test::Unit::TestCase
  include Rack::Test::Methods

  def app
    Sinatra::Application
  end

  def setup
    @name = 'my twitter login name'
    @password = 'my twitter login password'
    @twitter_account_id = 'id of my twitter account'
    @followers_source_name = 'source twitter name'
    @new_friend_name = 'twitter account name for new follow request'
  end

  def test_if_logging_works
    post '/login', :name => @name, :password => @password

    assert last_response.ok?
    assert_match /var client_data = {\n    id: #@twitter_account_id,\n    name: '#@name'\n  }/, last_response.body
  end

  def test_of_getting_follower_list
    get '/' + @followers_source_name

    assert last_response.ok?
    assert_not_equal 'false', last_response.body
    assert_match /var user = new User\( \d+, '\w+\s\w+', '\w+', /, last_response.body
  end

  def test_of_follow_request
    client = login( @name, @password )
    assert_equal false, client.friendship_exists?( @name, @new_friend_name )

    put '/', :name => @name, :password => @password, :requested_follow_ids => @new_friend_name

    assert last_response.ok?
    assert_equal 'Follow requests sucessfully completed.', last_response.body
    assert_equal true, client.friendship_exists?( @name, @new_friend_name )
  end

end