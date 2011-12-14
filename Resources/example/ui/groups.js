(function(){
	ex.ui.groups = {};
	
	ex.ui.groups.createWindow = function(){
		var win = Ti.UI.createWindow($.mixin({
			title: L("groups_api"),
			layout: 'vertical'
		}, $$.window));
		
		var groups = Ti.UI.createButton($.mixin({
			title: L("group_list")
		}, $$.button));
		groups.addEventListener('click', function(){
			ex.ui.open(ex.ui.groups.createListWindow({
				title: L("group_list")
			}));
		});
		
		win.add(groups);
		
		return win;
	};
	
	ex.ui.groups.createListWindow = function(config){
		var win = Ti.UI.createWindow($.mixin({
			title: config.title || L("people_api")
		}, $$.window));
		
		win.addEventListener('open', function(){
			var tableView = Ti.UI.createTableView({
				backgroundSelectedColor: '#fff'
			});
			tableView.addEventListener('click', function(e){
				ex.ui.open(ex.ui.people.createListWindow({
					title: e.rowData.title,
					groupId: e.rowData.groupId
				}));
			});
			win.add(tableView);
			
			var indicator = ex.ui.createIndicator();
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
				error: function(e){
					indicator.hide();
					alert(e.error);
				}
			});
		});
		
		return win;
	};
})();
