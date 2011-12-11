(function(){
	ex.ui.voice = {};
	
	ex.ui.voice.createWindow = function(){
		var win = Ti.UI.createWindow($.mixin({
			title: L("voice_api"),
			layout: 'vertical'
		}, $$.window));
		
		var userTimeline = Ti.UI.createButton($.mixin({
			title: L("user_timeline")
		}, $$.button));
		userTimeline.addEventListener('click', function(){
			mixi.graphApi.voiceStatusesUserTimeline({
				success: function(json){
					alert(json);
				}
			})
		});
		
		var friendTimeline = Ti.UI.createButton($.mixin({
			title: L("friend_timeline")
		}, $$.button));
		friendTimeline.addEventListener('click', function(){
			mixi.graphApi.voiceStatusesFriendTimeline({
				success: function(json){
					alert(json);
				}
			})
		});
		
		win.add(userTimeline);
		win.add(friendTimeline);
		
		$.osEach({
			iphone: function(){
				var button = Ti.UI.createButton({
					systemButton: Ti.UI.iPhone.SystemButton.ADD
				});
				button.addEventListener('click', function(){
					var win = ex.ui.voice.createUpdateWindow();
					ex.ui.open(win);
				});
				
				win.rightNavButton = button;
			},
			android: function(){
				win.activity.onCreateOptionsMenu = function(e){
					var menu = e.menu;
					var menuItem = menu.add({title: L('add_voice')});
					menuItem.addEventListener('click', function(){
						var win = ex.ui.voice.createUpdateWindow();
						ex.ui.open(win);
					});
				};
			}
		});
		
		return win;
	};
	
	ex.ui.voice.createUpdateWindow = function(){
		var image = null;
		
		var win = Ti.UI.createWindow($.mixin({
			title: L('new_voice'),
			layout: 'vertical'
		}, $$.window, true));
		
		var textArea = Ti.UI.createTextArea($.mixin({
			value: L('test_voice')
		}, $$.textArea, true));
		
		var button = Ti.UI.createButton($.mixin({
			title: L('post_voice')
		}, $$.button, true));
		button.addEventListener('click', function(){
			if (!$.isDefined(textArea.value)) {
				alert(L('please_input_voice'));
				return;
			}
			
			var params = {status: textArea.value};
			if ($.isDefined(image)) params.photo = image;
			
			mixi.graphApi.voiceStatusesUpdate({
				parameters: params,
				success: function(json) {
					win.close();
					alert(L('post_successful'));
				}
			});
		});
		
		win.add(textArea);
		win.add(button);
		
		$.osEach({
			iphone: function(){
				var button = Ti.UI.createButton({
					systemButton: Ti.UI.iPhone.SystemButton.CAMERA
				});
				button.addEventListener('click', function(){
					Ti.Media.openPhotoGallery({
						success: function(event){
							image = event.media;
						}
					});
				});
				win.rightNavButton = button;
			},
			android: function(){
				win.activity.onCreateOptionsMenu = function(e){
					var menu = e.menu;
					var menuItem = menu.add({title: L('add_photo')});
					menuItem.addEventListener('click', function(){
						Ti.Media.openPhotoGallery({
							success: function(event){
								image = event.media;
							}
						});
					});
				};
			}
		});
		
		$.iphoneOnly(function(){
			var button = Ti.UI.createButton({
				systemButton: Ti.UI.iPhone.SystemButton.CANCEL
			});
			button.addEventListener('click', function(){
				ex.ui.close(win);
			});
			win.leftNavButton = button;
		});
		
		return win;
	};
})();
