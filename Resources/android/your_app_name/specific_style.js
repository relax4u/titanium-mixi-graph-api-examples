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
	
	$.displayEach({
		"480x800": function(){
			$$.button = {
				top: 40,
				width: 350,
				height: 70
			};
			
			$$.textField = {
				top: 40,
				width: 440,
				height: 70,
				borderRadius: 10,
				borderColor: '#999'
			};
			
			$.mixin($$.label, {
				color: '#000',
				font: {fontSize: 30}
			}, true);
		}
	})
})();
