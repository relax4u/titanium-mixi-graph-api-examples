(function(){
	ex.ui.people = {};
	
	ex.ui.people.createWindow = function(){
		var win = Ti.UI.createWindow($.mixin({
			title: L("people_api"),
			layout: 'vertical'
		}, $$.window));
		
		var myProfile = Ti.UI.createButton($.mixin({
			title: L("my_profile")
		}, $$.button));
		myProfile.addEventListener('click', function(){
			ex.ui.open(ex.ui.people.createDetailWindow({
				title: L("my_profile"),
				userId: "@me"
			}));
		});
		
		var friends = Ti.UI.createButton($.mixin({
			title: L("friend_list")
		}, $$.button));
		friends.addEventListener('click', function(){
			ex.ui.open(ex.ui.people.createListWindow({
				title: L("friend_list"),
				groupId: "@friends"
			}));
		});
		
		win.add(myProfile);
		win.add(friends);
		
		return win;
	};
	
	ex.ui.people.createDetailWindow = function(config){
		var win = Ti.UI.createWindow($.mixin({
			title: config.title || L("people_api")
		}, $$.window));
		
		win.addEventListener('open', function(){
			var tableView = Ti.UI.createTableView({
				backgroundSelectedColor: '#fff'
			});
			win.add(tableView);
			
			var indicator = ex.ui.createIndicator();
			win.add(indicator);
			indicator.show();
			
			mixi.graphApi.people({
				userId: config.userId,
				parameters: {fields: "@all"},
				success: function(json){
					var user = json.entry;
					
					var row = Ti.UI.createTableViewRow($.mixin({
						header: L("display_name")
					}, $$.peopleTableRowDisplayName));
					
					row.add(Ti.UI.createImageView($.mixin({
						image: user.thumbnailUrl
					}, $$.peopleTableRowThumbnail)));
					
					row.add(Ti.UI.createLabel($.mixin({
						text: user.displayName
					}, $$.peopleTableRowName)));
					
					tableView.appendRow(row);
					
					row = Ti.UI.createTableViewRow($.mixin({
						header: L("sex")
					}, $$.peopleTableRow));
					row.add(Ti.UI.createLabel($.mixin({
						text: L(user.gender || "unknown")
					}, $$.peopleTableRowLabel)));
					tableView.appendRow(row);
					
					row = Ti.UI.createTableViewRow($.mixin({
						header: L("birthday")
					}, $$.peopleTableRow));
					row.add(Ti.UI.createLabel($.mixin({
						text: user.birthday || L("unknown")
					}, $$.peopleTableRowLabel)));
					tableView.appendRow(row);
					
					row = Ti.UI.createTableViewRow($.mixin({
						header: L("about_me"),
						height: 'auto'
					}, $$.peopleTableRow));
					row.add(Ti.UI.createLabel($.mixin({
						text: user.aboutMe || L("unknown")
					}, $$.peopleTableRowLabel)));
					tableView.appendRow(row);
					
					row = Ti.UI.createTableViewRow($.mixin({
						header: L("interests")
					}, $$.peopleTableRow));
					row.add(Ti.UI.createLabel($.mixin({
						text: user.interests.join(", ")
					}, $$.peopleTableRowLabel)));
					tableView.appendRow(row);
					
					indicator.hide();
				},
				failure: function(e){
					indicator.hide();
					alert(e.error);
				}
			});
		});
		
		return win;
	};
	
	ex.ui.people.createListWindow = function(config){
		var win = Ti.UI.createWindow($.mixin({
			title: config.title || L("people_api")
		}, $$.window));
		
		win.addEventListener('open', function(){
			var tableView = Ti.UI.createTableView();
			tableView.addEventListener('click', function(e){
				ex.ui.open(ex.ui.people.createDetailWindow({
					title: e.rowData.displayName,
					userId: e.rowData.userId
				}));
			});
			win.add(tableView);
			
			var indicator = ex.ui.createIndicator();
			win.add(indicator);
			indicator.show();
			
			mixi.graphApi.people({
				groupId: config.groupId,
				success: function(json){
					json.entry.forEach(function(user){
						var row = Ti.UI.createTableViewRow($.mixin({
							userId: user.id,
							displayName: user.displayName,
						},$$.peopleTableRowFriendList));
						
						row.add(Ti.UI.createImageView($.mixin({
							image: user.thumbnailUrl
						}, $$.peopleTableRowThumbnail)));
						
						row.add(Ti.UI.createLabel($.mixin({
							text: user.displayName
						}, $$.peopleTableRowName)));
						
						tableView.appendRow(row);
					});
					indicator.hide();
				},
				failure: function(e){
					indicator.hide();
					alert(e.error);
				}
			});
		});
		
		return win;
	};
})();
