// JavaScript Document
// Autor: Petr Zaparka petr@zaparka.cz
// Date: 31.10.2009
// used libraries: jquery.js

function TwitterManager() {
	this.twitter_account = new Array();
};

TwitterManager.prototype = {
  twitter_account: null,
	twitter_login_state: 'unsigned',
	name: null,
	pass: null,

  login: function() {
		this.name = $( '#name' ).val();
		this.password = $( '#pass' ).val();

		if ( this.name == '' || this.password == '')
			alert( 'You mast fill name and login.' );

		var a = this;	
		this.ajax_call( 'POST', '/login', {
		      name: this.name,
		      password: this.password,
		    }, function( response ) {
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
});//document ready