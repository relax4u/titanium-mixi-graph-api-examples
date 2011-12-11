/**
 * alias (namespace.util)
 */
var $ = (ex.util = require('/utilities/util'));

/**
 * console API 
 */
var console = require('/utilities/console');

Ti.include(
	"/example/config.js",
	"/mixi_config.js"
);

(function(){
	ex.app = {
	};
	
	var MixiGraphApi = require('/mixi').GraphApi;
	mixi.graphApi = new MixiGraphApi(mixi.config);
})();

Ti.include(
	"/example/style.js",
	"/example/ui/ui.js"
);
