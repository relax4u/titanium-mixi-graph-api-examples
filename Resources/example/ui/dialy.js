(function(){
	ex.ui.dialy = {};
	
	ex.ui.dialy.createWindow = function() {
		var win = Ti.UI.createWindow($.mixin({
			title: L("dialy_api")
		}, $$.window));
		
		var view = Ti.UI.createView({
			layout: 'vertical'
		});
		win.add(view);
		
		var title = Ti.UI.createTextField($.mixin({
			hintText: L("please_input_title"),
			value: L("this_is_test")
		}, $$.textField));
		
		var body = Ti.UI.createTextArea($.mixin({
			value: L("this_is_test")
		}, $$.textArea));
		
		var photos = [];
		
		var photoButton = Ti.UI.createButton($.mixin({
			title: L("add_photo")
		}, $$.button));
		photoButton.addEventListener('click', function(){
			$.osEach({
				iphone: function(){
					alert(L("iphone_is_not_supported"));
				},
				android: function(){
					Ti.Media.showCamera({
						success: function(e){
							photos.push(e.media);
						},
						error: function(){
							alert(L("unknown_error"));
						},
						mediaTypes: [Ti.Media.MEDIA_TYPE_PHOTO]
					});
				}
			});
		});
		
		var button = Ti.UI.createButton($.mixin({
			title: L("post_dialy")
		}, $$.button));
		button.addEventListener('click', function(){
			var parameters = {
				title: title.value,
				body: body.value,
				privacy: {
					visibility: "self",
					show_users: 0
				}
			};
			
			if (photos.length > 0) {
				parameters.photos = photos;
			}
			
			var indicator = ex.ui.createFrontIndicator(win, {message: L("sending")});
			indicator.show();
			
			mixi.graphApi.dialyCreate({
				parameters: parameters,
				success: function(json) {
					indicator.hide();
					alert(JSON.stringify(json));
				},
				error: function(e) {
					indicator.hide();
					alert(JSON.stringify(e));
				}
			});
		});
		
		view.add(title);
		view.add(body);
		view.add(photoButton);
		view.add(button);
		
		return win;
	};
})();
