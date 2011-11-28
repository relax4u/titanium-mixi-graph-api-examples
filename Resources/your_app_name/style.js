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
})();

Ti.include("/your_app_name/specific_style.js");
