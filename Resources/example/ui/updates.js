(function(){
	ex.ui.updates = {};
	
	ex.ui.updates.createWindow = function() {
		var win = Ti.UI.createWindow($.mixin({
			title: L("updates_api"),
			layout: 'vertical'
		}, $$.window));
		
		var button = Ti.UI.createButton($.mixin({
			title: L("updates")
		}, $$.button));
		button.addEventListener('click', function(){
			ex.ui.open(ex.ui.updates.createListWindow({
				groupId: "@self",
				title: L("updates")
			}));
		});
		
		var friendButton = Ti.UI.createButton($.mixin({
			title: L("friend_updates")
		}, $$.button));
		friendButton.addEventListener('click', function(){
			ex.ui.open(ex.ui.updates.createListWindow({
				groupId: "@friends",
				title: L("friend_updates")
			}));
		});
		
		win.add(button);
		win.add(friendButton);
		
		return win;
	};
	
	ex.ui.updates.createListWindow = function(config) {
		var win = Ti.UI.createWindow($.mixin({
			title: config.title || L('updates')
		}, $$.window));
		
		win.addEventListener('open', function(){
			var tableView = Ti.UI.createTableView();
			win.add(tableView);
			
			var indicator = ex.ui.createIndicator();
			win.add(indicator);
			indicator.show();
			
			mixi.graphApi.updates({
				groupId: config.groupId,
				success: function(json){
					json.items.forEach(function(item){
						var row = Ti.UI.createTableViewRow($$.updatesTableRow);
						
						row.add(Ti.UI.createImageView($.mixin({
							image: item.actor.image.url
						}, $$.updatesThumbnail)));
						
						row.add(Ti.UI.createLabel($.mixin({
							text: item.actor.displayName
						}, $$.updatesTableRowNameLabel)));
						
						row.add(Ti.UI.createLabel($.mixin({
							text: L("updates_message")
								.replace("#{objectType}", L("updates_" + item.object.objectType))
								.replace("#{title}", item.object.displayName)
								.replace("#{verb}", L("updates_" + item.verb)),
						}, $$.updatesTableRowCommentLabel)));
						
						tableView.appendRow(row);
					});
					indicator.hide();
				},
				error: function(e){
					indicator.hide();
					alert(e.error);
				}
			});
		});
		
		return win;
	};
})();
