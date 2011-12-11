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
			your_namespace.ui.open(your_namespace.ui.groups.createListWindow({
				title: L("group_list")
			}));
		});
		
		win.add(groups);
		
		return win;
	};
	
	your_namespace.ui.groups.createListWindow = function(config){
		var win = Ti.UI.createWindow($.mixin({
			title: config.title || L("people_api")
		}, $$.window));
		
		win.addEventListener('open', function(){
			var tableView = Ti.UI.createTableView({
				backgroundSelectedColor: '#fff'
			});
			tableView.addEventListener('click', function(e){
				your_namespace.ui.open(your_namespace.ui.people.createListWindow({
					title: e.rowData.title,
					groupId: e.rowData.groupId
				}));
			});
			win.add(tableView);
			
			var indicator = your_namespace.ui.createIndicator();
			win.add(indicator);
			indicator.show();
			
			mixi.graphApi.groups({
				success: function(json){
					json.entry.forEach(function(group){
						tableView.appendRow({
							title: group.title,
							groupId: group.id,
							color: "#000",
							hasChild: true
						});
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
