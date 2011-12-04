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
		
		var create = Ti.UI.createButton($.mixin({
			title: L("add_spot")
		}, $$.button));
		create.addEventListener('click', function(){
			your_namespace.ui.checkin.createMySpotFormWindow().open({modal: true});
		});
		
		var search = Ti.UI.createButton($.mixin({
			title: L("search_spot")
		}, $$.button));
		search.addEventListener('click', function(){
			mixi.graphApi.searchSpots({
				parameters: {fields: ['name', 'address.geohash']},
				success: function(json){
					alert(JSON.stringify(json));
				}
			})
		});
		
		win.add(create);
		win.add(search);
		
		return win;
	};
	
	your_namespace.ui.checkin.createMySpotFormWindow = function(){
		var win = Ti.UI.createWindow($.mixin({
			title: L("add_spot"),
			layout: 'vertical'
		}, $$.window));
		
		$.iphoneOnly(function(){
			var close = Ti.UI.createButton({
				systemButton: Ti.UI.iPhone.SystemButton.CANCEL
			});
			close.addEventListener('click', function(){
				win.close();
			});
			win.leftNavButton = close;
		});
		
		var textField = Ti.UI.createTextField($.mixin({
			hintText: L("please_input_title"),
			value: L("test_spot")
		}, $$.textField));
		
		var textArea = Ti.UI.createTextArea($.mixin({
			value: L('this_is_test')
		}, $$.textArea));
		
		var button = Ti.UI.createButton($.mixin({
			title: L('add_spot')
		}, $$.button));
		button.addEventListener('click', function(){
			mixi.graphApi.spotsCreate({
				parameters: {name: textField.value, description: textArea.value},
				success: function(json){
					alert(json);
				}
			})
		});
		
		win.add(textField);
		win.add(textArea);
		win.add(button);
		
		return win;
	};
})();
