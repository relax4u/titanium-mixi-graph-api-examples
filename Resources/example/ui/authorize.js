(function(){
	ex.ui.authorize = {};
	
	ex.ui.authorize.createWindow = function(){
		var win = Ti.UI.createWindow($.mixin({
			title: L('authorize'),
			layout: 'vertical'
		}, $$.window));
		
		var auth = Ti.UI.createButton($.mixin({
			title: L('authorize')
		}, $$.button));
		auth.addEventListener('click', function(){
			mixi.graphApi.authorize({
				success: function(){
					label.text = "authorized = " + mixi.graphApi.isAuthorized();
				}
			});
		});
		
		var logout = Ti.UI.createButton($.mixin({
			title: L('logout')
		}, $$.button));
		logout.addEventListener('click', function(){
			mixi.graphApi.logout();
			label.text = "authorized = " + mixi.graphApi.isAuthorized();
		});
		
		var label = Ti.UI.createLabel($.mixin({
			top: $$.button.top,
			text: "authorized = " + mixi.graphApi.isAuthorized()
		}, $$.label));
		
		win.add(auth);
		win.add(logout);
		win.add(label);
		
		return win;
	};
})();
