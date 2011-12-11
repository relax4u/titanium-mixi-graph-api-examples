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
				{title: L("authorize"), color: "#000", ui: "authorize", hasChild: true},
				{title: L("people_api"), color: "#000", ui: "people", hasChild: true},
				{title: L("groups_api"), color: "#000", ui: "groups", hasChild: true},
				{title: L("people_lookup_api"), color: "#000", ui: "peopleLookup", hasChild: true},
				{title: L("updates_api"), color: "#000", ui: "updates", hasChild: true},
				{title: L("voice_api"), color: "#000", ui: "voice", hasChild: true},
				{title: L("check_api"), color: "#000", ui: "check", hasChild: true},
				{title: L("photo_api"), color: "#000", ui: "photo", hasChild: true},
				{title: L("dialy_api"), color: "#000", ui: "dialy", hasChild: true},
				{title: L("checkin_api"), color: "#000", ui: "checkin", hasChild: true}
			]
		});
		tableView.addEventListener('click', function(e){
			var next = your_namespace.ui[e.rowData.ui].createWindow();
			your_namespace.ui.open(next);
		});
		win.add(tableView);
		
		return win;
	};
	
	your_namespace.ui.createIndicator = function(config) {
		var options = $.merge($$.indicator);
		
		$.androidOnly(function(){
			options = $.mixin(options, config, true);
		});
		
		return Ti.UI.createActivityIndicator($$.indicator);
	};
	
	your_namespace.ui.createDarkIndicator = function(config) {
		var indicator = your_namespace.ui.createIndicator(config);
		
		return $.osEach({
			iphone: function(){
				var view = Ti.UI.createView({
					backgroundColor: "#000",
					opacity: 0.5,
					zIndex: 1000
				});
				view.add(indicator);
				indicator.show();
				
				return view;
			},
			android: indicator
		});
	};
})();

Ti.include(
	"/your_app_name/ui/authorize.js",
	"/your_app_name/ui/people.js",
	"/your_app_name/ui/groups.js",
	"/your_app_name/ui/people_lookup.js",
	"/your_app_name/ui/updates.js",
	"/your_app_name/ui/voice.js",
	"/your_app_name/ui/check.js",
	"/your_app_name/ui/photo.js",
	"/your_app_name/ui/dialy.js",
	"/your_app_name/ui/checkin.js"
);
