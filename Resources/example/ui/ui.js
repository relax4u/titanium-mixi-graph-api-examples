(function(){
	ex.ui = {};
	
	var nav = null;
	var frontIndicator = null;
	
	ex.ui.createApplicationWindow = function(){
		Ti.UI.setBackgroundColor('#000');
		
		var root = ex.ui.createRootWindow();
		
		// for iphone indicator
		$.iphoneOnly(function(){
			
		});
		
		return $.osEach({
			iphone: function(){
				nav = Ti.UI.iPhone.createNavigationGroup({
					window: root
				});
				var win = Ti.UI.createWindow({
					backgroundColor: $$.backgroundColor
				});
				win.add(nav);
				
				frontIndicator = Ti.UI.createView({
					backgroundColor: "#000",
					opacity: 0.5,
					zIndex: 1000,
					visible: false
				});
				
				var indicator =  ex.ui.createIndicator();
				frontIndicator.add(indicator);
				indicator.show();
			
				nav.add(frontIndicator);
				
				return win;
			},
			android: root
		});
	};
	
	ex.ui.open = function(win, properties) {
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
	
	ex.ui.close = function(win) {
		$.osEach({
			iphone: function(){
				nav.close(win);
			},
			android: function(){
				win.close();
			}
		});
	};
	
	ex.ui.createRootWindow = function(){
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
				{title: L("message_api"), color: "#000", ui: "message", hasChild: true},
				{title: L("dialy_api"), color: "#000", ui: "dialy", hasChild: true},
				{title: L("checkin_api"), color: "#000", ui: "checkin", hasChild: true},
				{title: L("profile_image_api"), color: "#000", ui: "profileImage", hasChild: true}
			]
		});
		tableView.addEventListener('click', function(e){
			var next = ex.ui[e.rowData.ui].createWindow();
			ex.ui.open(next);
		});
		win.add(tableView);
		
		return win;
	};
	
	ex.ui.createIndicator = function(config) {
		var options = $.merge($$.indicator);
		
		$.androidOnly(function(){
			options = $.mixin(options, config, true);
		});
		
		return Ti.UI.createActivityIndicator(options);
	};
	
	ex.ui.createFrontIndicator = function(parent, config){
		return new (function(){
			var self = this;
			
			this.ui = $.osEach({
				iphone: frontIndicator,
				android: ex.ui.createIndicator(config)
			});
			
			this.show = function(){
				$.osEach({
					iphone: function(){
						self.ui.show();
					},
					android: function(){
						parent.add(self.ui);
						self.ui.show();
					}
				});
			};
			
			this.hide = function(){
				self.ui.hide();
			};
		})();
	};
	
	ex.ui.createDarkIndicator = function(config) {
		var indicator = ex.ui.createIndicator(config);
		
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
	
	ex.ui.setAddButton = function(win, callback, config) {
		$.osEach({
			iphone: function(){
				var addButton = Ti.UI.createButton({
					systemButton: Ti.UI.iPhone.SystemButton.ADD
				});
				addButton.addEventListener('click', callback);
				win.rightNavButton = addButton;
			},
			android: function(){
				win.activity.onCreateOptionsMenu = function(e){
					var menu = e.menu;
					var menuItem = menu.add({title: L('add')});
					menuItem.addEventListener('click', callback);
				};
			}
		});
	};
})();

Ti.include(
	"/example/ui/authorize.js",
	"/example/ui/people.js",
	"/example/ui/groups.js",
	"/example/ui/people_lookup.js",
	"/example/ui/updates.js",
	"/example/ui/voice.js",
	"/example/ui/check.js",
	"/example/ui/photo.js",
	"/example/ui/message.js",
	"/example/ui/dialy.js",
	"/example/ui/checkin.js",
	"/example/ui/profile_image.js"
);
