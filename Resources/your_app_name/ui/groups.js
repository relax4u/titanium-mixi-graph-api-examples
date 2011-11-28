(function(){
	your_namespace.ui.groups = {};
	
	your_namespace.ui.groups.createWindow = function(){
		var win = Ti.UI.createWindow($.mixin({
			title: L("groups_api"),
			layout: 'vertical'
		}, $$.window));
		
		var groups = Ti.UI.createButton($.mixin({
			title: L("group_list")
		}, $$.button));
		groups.addEventListener('click', function(){
			mixi.graphApi.groups({
				success: function(json){
					alert(json);
				}
			})
		});
		
		win.add(groups);
		
		return win;
	};
})();
