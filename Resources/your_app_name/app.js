/**
 * alias (namespace.util)
 */
var $ = (your_namespace.util = require('/utilities/util'));

/**
 * console API 
 */
var console = require('/utilities/console');

Ti.include(
	"/your_app_name/config.js",
	"/mixi_config.js"
);

(function(){
	your_namespace.app = {
	};
	
	var MixiGraphApi = require('/mixi').GraphApi;
	mixi.graphApi = new MixiGraphApi(mixi.config);
})();

Ti.include(
	"/your_app_name/style.js",
	"/your_app_name/ui/ui.js"
);
