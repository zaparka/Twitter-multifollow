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

  search: function() {
    var target_account = $( '#target_account' ).val();
    if ( target_account == '' )
			alert( 'You mast fill "twitter account source".' );
		else {
		  var a = this;	
  		this.ajax_call( 'GET', '/' + target_account, '', function( response ) {
  		       eval( response );
  		       if ( response == 'false')
  		          a.target_false();
  		       else
  		          a.update_users_list( users_list );
  		    }
  		);
		} 
  },
  
  update_users_list: function( users_list ) {
	  $( '#message_box span' ).text( 'Twitter account source finded.' );
	  $( "#users_list" ).empty();
    jQuery.each( users_list, function( i, user ) {
      $( "#users_list" ).append( '<input name="friends" type="checkbox" value="' + user.name + '"/>' + user.name + '<br/>' );
    });
	},

	target_false: function() {
	  $( '#message_box span' ).text( 'Twitter account source finder failed.' );
	},
  
  login: function() {
		this.name = $( '#name' ).val();
		this.password = $( '#pass' ).val();

		if ( this.name == '' || this.password == '' )
			alert( 'You mast fill name and login.' );

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
		    }
		);
  },

	updateLoginState: function( client_data ) {
	  $( '#message_box span' ).text( 'Login sucess.' );
		$( '#login_form *' ).hide();
		$( '#login_form' ).html( '<span> Welcome '+ client_data.name + '</span>' );
		this.state = 'signed';
	},

	login_false: function() {
	  $( '#message_box span' ).text( 'Login failed, please try again.' );
	},

	ajax_call: function( type, url, data, on_success_method ){
	    $.ajax({
	     type: type,
	     url: url,
	     dataType: "script",
	     data: data,
	     success: on_success_method
	    });
	  }

};

$(document).ready(function () {
  var twitterManager = new TwitterManager();
  $( '#login_form input.login' ).bind( 'click', function(){ twitterManager.login(); } );
  $( '#target_twitter_account input.search' ).bind( 'click', function(){ twitterManager.search(); } );
});//document ready