
$(document).ready(function() {
	
	// LOCAL DATABASE
	var shortName = 'InMarket';
	var version = '1.0';
	var displayName = 'InMarket';
	var maxSize = 65536;
	db = openDatabase(shortName, version, displayName, maxSize);
	db.transaction(
		function(transaction) {
			transaction.executeSql(
				'CREATE TABLE IF NOT EXISTS entries ' +
				' (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' +
				' date DATE NOT NULL, user_email TEXT NOT NULL, ' +
				' firstname TEXT NOT NULL, ' +
				' lastname TEXT NOT NULL, ' +
				' email TEXT NOT NULL, ' +
				' address TEXT NOT NULL, ' +
				' city TEXT NOT NULL, ' +
				' state TEXT NOT NULL, ' +
				' zipcode TEXT NOT NULL, ' +
				' dob TEXT NOT NULL ' +
				');'
			);
		}
	);
	
	var $blanket = $("#blanket");
	var $create_account = $("#create_account_ct");
	
	// determine if there is a user account
	var isUser = localStorage.getItem('username');
	if(isUser) {
		$("#reset-password").show();
	} else {
		$("#reset-password").hide();
	}
	
	$blanket.click(function() {
		if($create_account.is(":visible:")) closeCreateAccount();
		
	});
	
	// CONTROLS
	$("li.refresh").click(function() {
		location.reload(true);
	});
	
	$("li.export").click(function() {
		alert("EXPORT DATA")
	});
	
	// LOGIN form submit
	$("#btn-sign-in").click(function() {
		
		// TODO validate fields
		
		var localUserName = localStorage.getItem('username');
		var localPW = localStorage.getItem('password');
		var username = $(".login_username").val();
		var password = $(".login_password").val();
		
		if(username==localUserName && password==localPW && username && password) {
			// authenticated
			$("#login_ct").fadeOut('fast',function() {
				$("#entry_ct").fadeIn('fast');
				$("li.export").css('visibility','visible');
			});
			
		} else {
			
			alert("Login Failed");
			
		}
		
	});
	
	// CREATE ACCOUNT screen
	$("#btn-create-account").click(function() {
		
		// clear the fields
		$(".create_name").val("");
		$(".create_email").val("");
		$(".create_username").val("");
		$(".create_password").val("");
		
		var $screen = $("#create_account_ct");
		$screen.show();
		
		$blanket.fadeIn('fast',function() {
		
			$screen.animate({
				left: '112px'
			}, 150, function() {
					// Animation complete.
			});
		
		});
		
	});
	
	// close create account screen
	$("#create_account_closeX").click(function() { closeCreateAccount() });
	
	function closeCreateAccount() {
		
		var $screen = $("#create_account_ct");
		
		$blanket.fadeOut('fast');
		$screen.animate({
				left: '1024px'
			}, 300, function() {
					$screen.hide();
			});
	}
	
	// CREATE ACCOUNT
	$("#btn-create").click(function() {
		
		var valid = true;
		
		// TODO validate fields
		
		// check the database for this user's email
		var email_exists = false;
		
		if(valid && !email_exists) {
			var name = $(".create_name").val();
			var email = $(".create_email").val();
			var username = $(".create_username").val();
			var password = $(".create_password").val();
			
			localStorage.setItem('name',name);
			localStorage.setItem('email',email);
			localStorage.setItem('username',username);
			localStorage.setItem('password',password);
			
			$("#reset-password").show();
			
			closeCreateAccount()
			
		}
		
	});
	
	// RESET PASSWORD
	$("#reset-password").click(function() {
		
		// TODO test for network, email password to user
		
		// for now just clear the values
		localStorage.setItem('name','');
		localStorage.setItem('email','');
		localStorage.setItem('username','');
		localStorage.setItem('password','');
		
		$("#reset-password").fadeOut('fast');
		
		
	});
	
	// signup form submit
	$("#btn-submit").click(function() {
		
		// submit the form
		alert("SUBMIT SIGNUP FORM");
		
	});
	
	
	
});