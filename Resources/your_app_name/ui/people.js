(function(){
	your_namespace.ui.people = {};
	
	your_namespace.ui.people.createWindow = function(){
		var win = Ti.UI.createWindow($.mixin({
			title: L("people_api"),
			layout: 'vertical'
		}, $$.window));
		
		var myProfile = Ti.UI.createButton($.mixin({
			title: L("my_profile")
		}, $$.button));
		myProfile.addEventListener('click', function(){
			mixi.graphApi.people({
				success: function(json){
					alert(json);
				}
			})
		});
		
		var friends = Ti.UI.createButton($.mixin({
			title: L("friend_list")
		}, $$.button));
		friends.addEventListener('click', function(){
			mixi.graphApi.people({
				groupId: "@friends",
				success: function(json){
					alert(json);
				}
			});
		});
		
		var birthday = Ti.UI.createButton($.mixin({
			title: L("friend_birthday")
		}, $$.button));
		birthday.addEventListener('click', function(){
			mixi.graphApi.people({
				groupId: "@friends",
				sortBy: "displayName",
				parameters: {
					fields: ["birthday", "thumbnailUrl"]
				},
				success: function(json){
					alert(json);
				}
			});
		});
		
		win.add(myProfile);
		win.add(friends);
		win.add(birthday);
		
		return win;
	}
})();
