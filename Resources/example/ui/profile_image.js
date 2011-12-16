(function(){
	ex.ui.profileImage = {};
	
	ex.ui.profileImage.createWindow = function(){
		var win = Ti.UI.createWindow($.mixin({
			title: L("profile_image_api"),
			layout: 'vertical'
		}, $$.window));
		
		var myProfileImage = Ti.UI.createButton($.mixin({
			title: L("my_profile_image")
		}, $$.button));
		myProfileImage.addEventListener('click', function(){
			ex.ui.open(ex.ui.profileImage.createScrollableWindow({
				title: L("my_profile_image"),
				userId: "@me"
			}));
		});
		
		var friends = Ti.UI.createButton($.mixin({
			title: L("friend_profile_image_list")
		}, $$.button));
		friends.addEventListener('click', function(){
			ex.ui.open(ex.ui.profileImage.createFriendListWindow());
		});
		
		win.add(myProfileImage);
		win.add(friends);
		
		return win;
	};
	
	ex.ui.profileImage.createFriendListWindow = function(config){
		var win = ex.ui.people.createListWindow({
			title: L("friend_profile_image_list"),
			groupId: "@friends",
			callback: function(e){
				ex.ui.open(ex.ui.profileImage.createScrollableWindow({
					title: e.rowData.displayName,
					userId: e.rowData.userId
				}));
			}
		});
		
		return win;
	};
	
	ex.ui.profileImage.createScrollableWindow = function(config){
		var win = Ti.UI.createWindow($.mixin({
			title: config.title || L('profile_image_api'),
			backgroundColor: "#000"
		}, $$.window));
		
		var _init = function(){
			var indicator = ex.ui.createIndicator();
			indicator.show();
			
			mixi.graphApi.peopleImages({
				userId: config.userId,
				success: function(json){
					var scrollableView = Ti.UI.createScrollableView({
						showPagingControl: true,
						views: json.entry.map(function(image){
							var view = Ti.UI.createView({
								backgroundColor: "#000"
							});
							view.add(Ti.UI.createImageView({
								width: 'auto',
								height: 'auto',
								image: image.thumbnailUrl
							}));
							return view;
						})
					});
					win.add(scrollableView);
					indicator.hide();
				},
				error: function(){
					indicator.hide();
					alert(e.error);
				}
			});
		}
		
		$.osEach({
			iphone: _init,
			android: function(){
				win.addEventListener('open', _init);
			}
		});
		
		return win;
	};
})();
