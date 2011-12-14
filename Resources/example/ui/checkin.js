(function(){
	ex.ui.checkin = {};
	
	$.iphoneOnly(function(){
		Ti.Geolocation.purpose = L("purpose_message");
	});
	
	ex.ui.checkin.createWindow = function(){
		var win = Ti.UI.createWindow($.mixin({
			title: L("checkin_api"),
			layout: 'vertical'
		}, $$.window));
		
		var mySpots = Ti.UI.createButton($.mixin({
			title: L("my_spots")
		}, $$.button));
		mySpots.addEventListener('click', function(){
			ex.ui.open(ex.ui.checkin.createSpotListWindow({
				title: L("my_spots"),
				userId: "@me"
			}));
		});
		
		var friendSpots = Ti.UI.createButton($.mixin({
			title: L("friend_spots")
		}, $$.button));
		friendSpots.addEventListener('click', function(){
			ex.ui.open(ex.ui.people.createListWindow({
				groupId: "@friends",
				callback: function(e){
					ex.ui.open(ex.ui.checkin.createSpotListWindow({
						title: e.rowData.displayName,
						userId: e.rowData.userId
					}));
				}
			}));
		});
		
		var search = Ti.UI.createButton($.mixin({
			title: L("search_spot")
		}, $$.button));
		search.addEventListener('click', function(){
			ex.ui.open(ex.ui.checkin.createSearchMapWindow());
		});
		
		var myCheckinList = Ti.UI.createButton($.mixin({
			title: L("my_checkin_list")
		}, $$.button));
		
		var friendcheckinList = Ti.UI.createCheckinList = Ti.UI.createButton($.mixin({
			title: L("friend_checkin_list")
		}, $$.button));
		
		var checkin = Ti.UI.createButton($.mixin({
			title: L("checkin")
		}, $$.button));
		checkin.addEventListener('click', function(){
			ex.ui.open(ex.ui.checkin.createSpotListWindow({
				title: L("my_spots"),
				userId: "@me",
				callback: function(e) {
					ex.ui.open(ex.ui.checkin.createCheckinFormWindow({
						spotId: e.rowData.spotId
					}));
				}
			}));
		});
		
		win.add(mySpots);
		win.add(friendSpots);
		win.add(search);
		win.add(myCheckinList);
		win.add(friendcheckinList);
		win.add(checkin);
		
		return win;
	};
	
	ex.ui.checkin.createSpotListWindow = function(config){
		config = $.mixin({
			title: L("checkin_api"),
			callback: function(e) {
				mixi.graphApi.spot({
					spotId: e.rowData.spotId,
					success: function(json) {
						alert(json);
					},
					error: function(e) {
						alert(e.error);
					}
				});
			}
		}, config, true);
		
		var win = Ti.UI.createWindow($.mixin({
			title: config.title
		}, $$.window));
		
		if (config.userId == "@me") {
			var _openForm = function(){
				ex.ui.open(ex.ui.checkin.createMySpotFormWindow({
					list: win
				}));
			}
			ex.ui.setAddButton(win, _openForm);
		}
		
		var _init = function(){
			var tableView = Ti.UI.createTableView({
				editable: config.userId == "@me"
			});
			win.add(tableView);
			
			tableView.addEventListener('delete', function(e){
				mixi.graphApi.spotsDestroy({
					userId: config.userId,
					spotId: e.rowData.spotId,
					success: function(json) {
						alert(json);
					},
					error: function(e) {
						alert(e.error);
					}
				});
			});
			
			tableView.addEventListener('click', config.callback);
			
			win.addEventListener('reload', function(){
				tableView.setData([]);
				
				var indicator = ex.ui.createIndicator();
				win.add(indicator);
				indicator.show();
				
				mixi.graphApi.spots({
					userId: config.userId,
					success: function(json) {
						json.entry.forEach(function(spot){
							tableView.appendRow({
								spotId: spot.id,
								address: spot.address,
								title: spot.name.formatted,
								description: spot.description,
								hasChild: true
							});
						});
						indicator.hide();
					},
					error: function(e) {
						indicator.hide();
						alert(e.error);
					}
				});
			});
			win.fireEvent('reload');
		};
		
		$.osEach({
			iphone: _init,
			android: function(){
				win.addEventListener('open', _init);
			}
		});
		
		return win;
	};
	
	ex.ui.checkin.createSearchMapWindow = function(){
		var win = Ti.UI.createWindow($.mixin({
			title: L("search_spot")
		}, $$.window));
		
		var _init = function(){
			if (!ex.app.geolocationEnabled()) {
				alert("disable_geolocation");
				return;
			}
			
			Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST;
			Ti.Geolocation.getCurrentPosition(function(event){
				var mapView = Ti.Map.createView({
					mapType: Titanium.Map.STANDARD_TYPE,
					region: {latitude: event.coords.latitude, longitude: event.coords.longitude, latitudeDelta: 0.025, longitudeDelta: 0.025},
					animate: true,
					regionFit: true,
					userLocation: true,
				});
				mapView.addEventListener('regionChanged', function(){});
				win.add(mapView);
				
				mixi.graphApi.searchSpots({
					parameters: {fields: ['name', 'description', 'address.geohash']},
					success: function(json){
						json.entry.forEach(function(spot){
							var annotation = Ti.Map.createAnnotation({
								title: spot.name.formatted,
								subtitle: spot.description,
								latitude: spot.address.latitude,
								longitude: spot.address.longitude,
								animate: true
							});
							mapView.addAnnotation(annotation);
						});
					},
					error: function(e){
						alert(e.error);
					}
				});
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
	
	ex.ui.checkin.createMySpotFormWindow = function(config){
		var win = Ti.UI.createWindow($.mixin({
			title: L("add_spot"),
			layout: 'vertical'
		}, $$.window));
		
		var textField = Ti.UI.createTextField($.mixin({
			hintText: L("please_input_title"),
			value: L("test_spot")
		}, $$.textField));
		
		var textArea = Ti.UI.createTextArea($.mixin({
			value: L('this_is_test')
		}, $$.textArea));
		
		var button = Ti.UI.createButton($.mixin({
			title: L('add_spot')
		}, $$.button));
		button.addEventListener('click', function(){
			if ($.isBlank(textField.value) || $.isBlank(textArea.value)) {
				alert(L("please_input_title"));
				return;
			}
			
			var indicator = ex.ui.createFrontIndicator(win, {message: L("sending")});
			indicator.show();
			
			mixi.graphApi.spotsCreate({
				parameters: {name: textField.value, description: textArea.value},
				success: function(json){
					indicator.hide();
					alert(json);
					ex.ui.close(win);
					config.list.fireEvent('reload');
				},
				error: function(e){
					indicator.hide();
					alert(e.error);
				}
			})
		});
		
		win.add(textField);
		win.add(textArea);
		win.add(button);
		
		return win;
	};
	
	ex.ui.checkin.createCheckinFormWindow = function(config){
		var win = Ti.UI.createWindow($.mixin({
			title: L("checkin"),
			layout: 'vertical'
		}, $$.window));
		
		var photo = null;
		
		var _openCamera = function(config){
			Ti.Media.openPhotoGallery({
				success: function(e) {
					photo = e.media;
				},
				mediaTypes: [Ti.Media.MEDIA_TYPE_PHOTO]
			});
		};
		
		$.osEach({
			iphone: function(){
				var addButton = Ti.UI.createButton({
					systemButton: Ti.UI.iPhone.SystemButton.CAMERA
				});
				addButton.addEventListener('click', _openCamera);
				win.rightNavButton = addButton;
			},
			android: function(){
				win.activity.onCreateOptionsMenu = function(e){
					var menu = e.menu;
					var menuItem = menu.add({title: L('add_photo')});
					menuItem.addEventListener('click', _openCamera);
				};
			}
		});
		
		var textArea = Ti.UI.createTextArea($.mixin({
			value: L('this_is_test')
		}, $$.textArea));
		
		var button = Ti.UI.createButton($.mixin({
			title: L('checkin')
		}, $$.button));
		button.addEventListener('click', function(){
			var indicator = ex.ui.createFrontIndicator(win, {message: L("sending")});
			indicator.show();
			
			mixi.graphApi.checkinsCreate({
				spotId: config.spotId,
				parameters: {
					message: textArea.value,
					photo: photo,
					privacy: {
						visibility: "self"
					}
				},
				success: function(json) {
					indicator.hide();
					ex.ui.close(win);
					alert(json);
				},
				error: function(e) {
					indicator.hide();
					alert(e.error);
				}
			})
		});
		
		win.add(textArea);
		win.add(button);
		
		return win;
	};
})();
