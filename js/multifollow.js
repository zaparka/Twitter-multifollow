// JavaScript Document
// Autor: Petr Zaparka petr@zaparka.cz
// Date: 31.10.2009
// used libraries: jquery.js

function User( id, name, twitter_name ) {
  this.id = id;
  this.name = name;
  this.twitter_name = twitter_name;
}

User.prototype = {
  id: 0,
  name: '',
  twitter_name: ''
}

function TwitterManager() {
  this.twitter_account = new Array();
};

TwitterManager.prototype = {
  twitter_account: null,
  twitter_login_state: 'unsigned',
  name: null,
  pass: null,
  loder_end: false,
  users_list: null,

  follow: function() {
    if( this.twitter_login_state == 'signed' ) {
      var requested_follow_ids = new Array();
      jQuery.each( $( '#users_list :checked' ), function( i, user ) {
        requested_follow_ids[ i ] = user.value;
      });
      var a = this;	
      this.ajax_call( 'PUT', '/', {
          name: this.name,
          password: this.password,
          requested_follow_ids: requested_follow_ids.join(',')
        }, function( response ) {
           $( '#users_list' ).empty();
           $( '#users_list_box span' ).text( response );
        });
    }
  },

  search: function() {
    var target_account = $( '#target_account' ).val();
    if ( target_account == '' )
      alert( 'You mast fill "twitter account source".' );
    else {
      var a = this;
      this.ajax_call( 'GET', '/find/' + target_account, '', function( response ) {
           eval( response );
           if ( response == 'false') {
             $( 'img.loading' ).hide();
             a.target_false();
           }
           else {
            a.get_follower_users_detail( users_list, a );
           }
      });
    }
  },

  get_follower_users_detail: function( users_list, obj ) {
     $( '#users_list_box' ).slideDown( 'slow' );
     $( '#target_twitter_account span' ).removeClass( 'red' );
     $( '#target_twitter_account span' ).text( 'Twitter account source finded.' );
     $( '#users_list' ).empty().show();
     a = obj;
     jQuery.each( users_list, function( i, user ) {
       a.ajax_call( 'GET', '/' + user, '', function( response ) {
            eval( response );
            if ( response == 'false') {
              $( 'img.loading' ).hide();
              a.target_false();
            }
            else {
             a.update_users_list( user );
            }
       });
     });
    
  },

  update_users_list: function( user ) {
    $( '#users_list' ).append( '<input name="friends" type="checkbox" value="' + user.id
       + '"/><span>' + user.name + '</span><br/>' );
  },

  target_false: function() {
    $( '#target_twitter_account span' ).addClass( 'red' );
    $( '#target_twitter_account span' ).text( 'Twitter account source finder failed.' );
  },

  login: function() {
    this.name = $( '#name' ).val();
    this.password = $( '#pass' ).val();

    if ( this.name == '' || this.password == '' )
      alert( 'You mast fill name and login.' );
    else
      var a = this;
      this.ajax_call( 'POST', '/login', {
            name: this.name,
            password: this.password,
          }, function( response ) {
             eval( response );
             if ( response == 'false')
                a.login_false()
             else
                a.updateLoginState( client_data );
      });
  },

  updateLoginState: function( client_data ) {
    $( '#target_twitter_account' ).slideDown( 'slow' );
    $( '#login_form input, #login_form label' ).fadeOut( 'slow' );
    $( '#message_box span' ).text( 'Login sucess.' ).show();
    $( '#login_form h2' ).text( 'Login successfull: Welcome '+ client_data.name );
    this.twitter_login_state = 'signed';
  },

  login_false: function() {
    $( '#message_box span' ).text( 'Login failed, please try again.' );
  },

  ajax_call: function( type, url, data, on_success_method ) {
    $.ajax({
      type: type,
      url: url,
      dataType: 'script',
      data: data,
      success: on_success_method,
      complete: function(){
        $( 'img.loading' ).hide();
      }
    });
  }
};

$(document).ready(function () {
  var twitterManager = new TwitterManager();
  $( '#login_form input.login' ).bind( 'click', function() {
      twitterManager.login();
      $( '#login_form img.loading' ).show();
   });
  $( '#target_twitter_account input.search' ).bind( 'click', function(){
     twitterManager.search();
     $( '#target_twitter_account img.loading' ).show();
    });
  $( '#users_list_box input.follow' ).bind( 'click', function() {
     twitterManager.follow();
     $( '#users_list_box img.loading' ).show();
  });
});//document ready