(function(){
	ex.ui.updates = {};
	
	ex.ui.updates.createWindow = function() {
		var win = Ti.UI.createWindow($.mixin({
			title: L("updates_api"),
			layout: 'vertical'
		}, $$.window));
		
		var button = Ti.UI.createButton($.mixin({
			title: L("updates")
		}, $$.button));
		button.addEventListener('click', function(){
			mixi.graphApi.updates({
				success: function(json){
					alert(json);
				}
			})
		});
		
		win.add(button);
		
		return win;
	};
})();
