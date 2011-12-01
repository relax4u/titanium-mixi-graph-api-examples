(function(){
	your_namespace.ui.checkin = {};
	
	$.iphoneOnly(function(){
		Ti.Geolocation.purpose = L("purpose_message");
	});
	
	your_namespace.ui.checkin.createWindow = function(){
		var win = Ti.UI.createWindow($.mixin({
			title: L("checkin_api"),
			layout: 'vertical'
		}, $$.window));
		
		var search = Ti.UI.createButton($.mixin({
			title: L("search_spot")
		}, $$.button));
		search.addEventListener('click', function(){
			mixi.graphApi.searchSpot({
				parameters: {fields: ['name', 'address.geohash']},
				success: function(json){
					alert(JSON.stringify(json));
				}
			})
		});
		
		win.add(search);
		
		return win;
	};
})();
