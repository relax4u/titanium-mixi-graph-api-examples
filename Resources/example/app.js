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
		geolocationEnabled: function() {
			if (!Ti.Geolocation.locationServicesEnabled) return false;
		
			if (Ti.Platform.osname != "android") {
				switch (Ti.Geolocation.locationServicesAuthorization) {
					case Ti.Geolocation.AUTHORIZATION_DENIED:
					case Ti.Geolocation.AUTHORIZATION_RESTRICTED:
						return false;
				}
			}
			
			return true;
		}
	};
	
	var MixiGraphApi = require('/mixi').GraphApi;
	mixi.graphApi = new MixiGraphApi(mixi.config);
})();

Ti.include(
	"/example/style.js",
	"/example/ui/ui.js"
);
