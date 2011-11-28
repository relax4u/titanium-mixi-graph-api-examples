(function(){
	your_namespace.ui = {};
	
	var nav = null;
	
	your_namespace.ui.createApplicationWindow = function(){
		Ti.UI.setBackgroundColor('#000');
		
		return $.osEach({
			iphone: function(){
				nav = Ti.UI.iPhone.createNavigationGroup({
					window: your_namespace.ui.createRootWindow()
				});
				var win = Ti.UI.createWindow({
					backgroundColor: $$.backgroundColor
				});
				win.add(nav);
				return win;
			},
			android: function(){
				return your_namespace.ui.createRootWindow();
			}
		});
	};
	
	your_namespace.ui.open = function(win, properties) {
		properties = properties || {};
		
		$.osEach({
			iphone: function(){
				nav.open(win, properties);
			},
			android: function(){
				win.open(properties);
			}
		});
	};
	
	your_namespace.ui.close = function(win) {
		$.osEach({
			iphone: function(){
				nav.close(win);
			},
			android: function(){
				win.close();
			}
		});
	};
	
	your_namespace.ui.createRootWindow = function(){
		var win = Ti.UI.createWindow($.mixin({
			title: L('mixi_graph_api_sample')
		}, $$.root));
		
		var tableView = Ti.UI.createTableView({
			data: [
				{title: L("authorize"), ui: "authorize", hasChild: true},
				{title: L("people_api"), ui: "people", hasChild: true},
				{title: L("voice_api"), ui: "voice", hasChild: true},
			]
		});
		tableView.addEventListener('click', function(e){
			var next = your_namespace.ui[e.rowData.ui].createWindow();
			your_namespace.ui.open(next);
		});
		win.add(tableView);
		
		return win;
	};
})();

Ti.include(
	"/your_app_name/ui/authorize.js",
	"/your_app_name/ui/people.js",
	"/your_app_name/ui/voice.js"
);
