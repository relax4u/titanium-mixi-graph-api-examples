(function(){
	your_namespace.ui.peopleLookup = {};
	
	your_namespace.ui.peopleLookup.createWindow = function(){
		var win = Ti.UI.createWindow($.mixin({
			title: L("people_lookup_api"),
			layout: 'vertical'
		}, $$.window));
		
		var textField = Ti.UI.createTextField($.mixin({
			hintText: L('please_input_email')
		}, $$.textField));
		
		var friend = Ti.UI.createButton($.mixin({
			title: L("search_friend")
		}, $$.button));
		friend.addEventListener('click', function(){
			if (!textField.value) {
				alert(L('please_input_email'));
				return;
			}
			
			mixi.graphApi.searchPeople({
				parameters: {q: [textField.value]},
				success: function(json){
					alert(JSON.stringify(json));
				}
			})
		});
		
		var all = Ti.UI.createButton($.mixin({
			title: L("search_all")
		}, $$.button));
		all.addEventListener('click', function(){
			if (!textField.value) {
				alert(L('please_input_email'));
				return;
			}
			
			mixi.graphApi.searchPeople({
				groupId: "@all",
				parameters: {q: [textField.value]},
				success: function(json){
					alert(json);
				}
			})
		});
		
		win.add(textField);
		win.add(friend);
		win.add(all);
		
		return win;
	};
})();
