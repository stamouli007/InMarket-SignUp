var db;

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
				' date DATE NOT NULL, admin_email TEXT NOT NULL, ' +
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
	var $view_data = $("#view_data_ct");
	
	// determine if there is a user account
	var isUser = localStorage.getItem('username');
	if(isUser) {
		$("#reset-password").show();
	} else {
		$("#reset-password").hide();
	}
	
	$blanket.click(function() {
		if($create_account.is(":visible")) closeCreateAccount();
		if($view_data.is(":visible")) closeViewData();
		
	});
	
	// CONTROLS
	$("li.refresh").click(function() {
		location.reload(true);
	});
	// OPEN VIEW DATA SCREEN
	$("li.export").click(function() {
		// prompt for username/password
		var loggedin = true;
		
		// if successful, show the view data screen
		if(loggedin) {
			var $screen = $("#view_data_ct");
			$screen.show();
			
			$blanket.fadeIn('fast',function() {
			
				$screen.animate({
					left: '112px'
				}, 150, function() {
						// Animation complete.
						pullData();
				});
			
			});
		
		}
	});
	
	// close create account screen
	$("#view_data_closeX").click(function() { closeViewData() });
	
	function closeViewData() {
		
		$blanket.fadeOut('fast');
		$view_data.animate({
				left: '1024px'
			}, 300, function() {
					$view_data.hide();
			});
	}
	
	// PULL DATA and display in table
	function pullData() {
		
		// refresh table
		$('#view_ct tbody tr').each(function() {
			if(!$(this).is(":first-child")) $(this).remove();
		});
		
		db.transaction(
			function(transaction){
				transaction.executeSql(
					'SELECT * FROM entries WHERE admin_email = ? ORDER BY date;',
					[localStorage.getItem('email')],
					function(transaction,result) {
						for (var i = 0; i < result.rows.length; i++) {
							var row = result.rows.item(i);
							var newEntryRow = $("#data_template").clone();
							newEntryRow.removeAttr('id');
							newEntryRow.removeAttr('style');
							newEntryRow.data('entryId', row.id);
							newEntryRow.appendTo('#view_ct tbody');
							var dt = new Date(row.date);
							newEntryRow.find('.label_date').text(showLocalDate(dt));
							newEntryRow.find('.label_fname').text(row.firstname);
							newEntryRow.find('.label_lname').text(row.lastname);
							newEntryRow.find('.label_email').text(row.email);
						}
					},
					errorHandler
				);
			}
		);
		
	}
	
	var mmToMonth = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
	function showLocalDate(dt)
	{
	  var mm = dt.getMonth() + 1;
	  if(mm<10) mm = "0"+mm.toString();
	  var dd = dt.getDate();
	  if(dd<10) dd = "0"+dd.toString();
	  var hh = dt.getHours();
	  if(hh<10) hh = "0"+hh.toString();
	  var mn = dt.getMinutes();
	  if(mn<10) mn = "0"+mn.toString();
	  
	  return mm+"-"+dd+"-"+dt.getFullYear()+" "+hh+":"+mn;
	}
	
	// LOGIN form submit
	$("#btn-sign-in").click(function() {
		
		// TODO validate fields
		
		var localUserName = localStorage.getItem('username');
		var localPW = localStorage.getItem('password');
		var username = $(".login_username").val();
		var password = $(".login_password").val();
		
		if(username==localUserName && password==localPW) { //  && username && password
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
		
		$blanket.fadeOut('fast');
		$create_account.animate({
				left: '1024px'
			}, 300, function() {
					$create_account.hide();
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
	
	function errorHandler(transaction, error) {
		alert('Oops. Error was '+error.message+' (Code '+error.code+')');
		return true;
	}
	
	// signup form submit
	$("#btn-submit").click(function() {
		
		// timestamp
		var date = new Date().toLocaleString()+':'+new Date().getMilliseconds();
		// the admin email
		var admin_email = localStorage.getItem('email');
		
		// gather the data
		var fname = $("#entry_fname").val();
		var lname = $("#entry_lname").val();
		var email = $("#entry_email").val();
		var address = $("#entry_address").val();
		var city = $("#entry_city").val();
		var state = $("#entry_state").val();
		var zipcode = $("#entry_zipcode").val();
		var dob = $("#entry_dob").val();
		
		var valid = true;
		
		// TODO validate fields
		
		if(valid) {
			
			// TODO check to see if this email is already in the table
			var email_exists = false;
			
			if(email_exists) {
				
				// alert email exists
				
			} else {
			
				db.transaction(
					function(transaction) {
						transaction.executeSql(
							'INSERT INTO entries (date,admin_email,firstname,lastname,email,address,city,state,zipcode,dob) VALUES (?,?,?,?,?,?,?,?,?,?);',
							[date,admin_email,fname,lname,email,address,city,state,zipcode,dob],
							function(){
								// callback after processing
								clearSignUpForm();
								alert("SignUp Successful!");
							},
							errorHandler
						);
					}
				);
				
			}
			
		} else {
			
			alert("NOT VALID");
			
		}
		
		/*var alertstr = fname + "\n";
		alertstr += lname + "\n";
		alertstr += email + "\n";
		alertstr += address + "\n";
		alertstr += city + "\n";
		alertstr += state + "\n";
		alertstr += zipcode + "\n";
		alertstr += dob + "\n";*/
		
		//alert(alertstr)
		
	});
	
	function clearSignUpForm() {
		
		$("#entry_fname").val("");
		$("#entry_lname").val("");
		$("#entry_email").val("");
		$("#entry_address").val("");
		$("#entry_city").val("");
		
		var myselect = $("select#entry_state");
		myselect[0].selectedIndex = 0;
		myselect.selectmenu("refresh");
		
		$("#entry_zipcode").val("");
		$("#entry_dob").val("");
		
	}
	
	
	
});