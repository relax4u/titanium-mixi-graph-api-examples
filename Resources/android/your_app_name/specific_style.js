(function(){
	// for android style.
	$.mixin($$.root, {
		fullscreen: false,
		exitOnClose: true     // don't remove
	});
	
	$.mixin($$.window, {
		fullscreen: false,
		exitOnClose: false    // don't remove
	});
	
	$$.textArea = {
		top: '20dp',
		width: '200dp', height: '100dp',
		font: {fontSize: '15dp'}
	};
	
	$$.textField = {
		top: '20dp',
		width: '200dp',
		height: '40dp'
	};
	
	$$.button = {
		top: '20dp',
		width: '160dp',
		height: '40dp'
	};
	
	$$.label = {
		font: {fontSize: '20dp', fontFamily: 'Helvetica Neue'},
		textAlign: 'center',
		width: 'auto',
		height: 'auto'
	};
})();
