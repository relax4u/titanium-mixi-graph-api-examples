(function(){
	ex.ui.check = {};
	
	ex.ui.check.createWindow = function() {
		var win = Ti.UI.createWindow($.mixin({
			title: L("check_api"),
			layout: 'vertical'
		}, $$.window));
		
		var check = Ti.UI.createButton($.mixin({
			title: L("check")
		}, $$.button));
		check.addEventListener('click', function(){
			mixi.graphApi.share({
				parameters: {
					key: mixi.key,
					title: "いいね！タイトル",
					primary_url: mixi.primary_url,
					privacy: {visibility: "self"}
				},
				success: function(json){
					alert(json);
				}
			});
		});
		
		win.add(check);
		
		return win;
	};
})();
