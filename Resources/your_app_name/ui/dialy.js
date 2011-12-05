(function(){
	your_namespace.ui.dialy = {};
	
	your_namespace.ui.dialy.createWindow = function() {
		var win = Ti.UI.createWindow($.mixin({
			title: L("dialy_api"),
			layout: 'vertical'
		}, $$.window));
		
		var title = Ti.UI.createTextField($.mixin({
			hintText: L("please_input_title"),
			value: L("this_is_test")
		}, $$.textField));
		
		var body = Ti.UI.createTextArea($.mixin({
			value: L("this_is_test")
		}, $$.textArea));
		
		var button = Ti.UI.createButton($.mixin({
			title: L("post_dialy")
		}, $$.button));
		button.addEventListener('click', function(){
			mixi.graphApi.dialyCreate({
				parameters: {
					title: title.value,
					body: body.value,
					privacy: {
						visibility: "self",
						show_users: 0
					}
				},
				success: function(json) {
					alert(JSON.stringify(json));
				}
			});
		});
		
		win.add(title);
		win.add(body);
		win.add(button);
		
		return win;
	};
})();
