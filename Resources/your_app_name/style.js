/**
 * alias (namespace.style)
 */
var $$ = (your_namespace.style = {});

(function(){
	$$.backgroundColor = '#fff';
	
	$$.root = {
		backgroundColor: $$.backgroundColor
	};
	
	$$.window = {
		backgroundColor: $$.backgroundColor
	};
	
	$$.textField = {
		top: 20,
		width: 300,
		height: 40,
		borderRadius: 5,
		borderColor: '#999'
	}
	
	$$.button = {
		top: 20,
		width: 250,
		height: 40
	};
	
	$$.label = {
		font: {fontSize: 20, fontFamily: 'Helvetica Neue'},
		textAlign: 'center',
		width: 'auto',
		height: 'auto'
	};
})();

Ti.include("/your_app_name/specific_style.js");
