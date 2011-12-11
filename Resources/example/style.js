/**
 * alias (namespace.style)
 */
var $$ = (ex.style = {});

(function(){
	$$.backgroundColor = '#fff';
	
	$$.root = {
		backgroundColor: $$.backgroundColor
	};
	
	$$.window = {
		backgroundColor: $$.backgroundColor
	};
})();

Ti.include("/example/specific_style.js");
