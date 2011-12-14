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
		myCheckinList.addEventListener('click', function(){
			ex.ui.open(ex.ui.checkin.createCheckinListWindow({
				title: L("my_checkin_list"),
				userId: "@me",
				groupId: "@self"
			}));
		});
		
		var friendCheckinList = Ti.UI.createCheckinList = Ti.UI.createButton($.mixin({
			title: L("friend_checkin_list")
		}, $$.button));
		friendCheckinList.addEventListener('click', function(){
			ex.ui.open(ex.ui.checkin.createCheckinListWindow({
				title: L("friend_checkin_list"),
				userId: "@me",
				groupId: "@friends"
			}));
		});
		
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
		win.add(friendCheckinList);
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
	
	ex.ui.checkin.createCheckinListWindow = function(config){
		var win = Ti.UI.createWindow($.mixin({
			title: config.title || L("checkin_api")
		}, $$.window));
		
		var _init = function(){
			var tableView = Ti.UI.createTableView({
				editable: true
			});
			win.add(tableView);
			
			tableView.addEventListener('delete', function(e){
				mixi.graphApi.checkinsDestroy({
					spotId: e.rowData.spotId,
					checkinId: e.rowData.checkinId,
					success: function(json){
						alert(json);
					},
					error: function(e){
						alert(e.error);
					}
				})
			});
			
			tableView.addEventListener('click', function(e){
				switch (e.source.type) {
					case "comments":
					case "favorites":
						break;
					default:
						mixi.graphApi.checkin({
							userId: e.rowData.userId,
							checkinId: e.rowData.checkinId,
							success: function(json){
								alert(json);
							},
							error: function(e){
								alert(e.error);
							}
						});
						break;
				}
			});
			
			var indicator = ex.ui.createIndicator();
			indicator.show();
			
			mixi.graphApi.checkins({
				userId: config.userId,
				groupId: config.groupId,
				success: function(json) {
					json.entry.forEach(function(checkin){
						var row = Ti.UI.createTableViewRow($.mixin({
							spotId: checkin.spot.id,
							checkinId: checkin.id,
							userId: checkin.user.id
						}, $$.checkinTableRow));
						
						row.add(Ti.UI.createImageView($.mixin({
							image: checkin.user.thumbnailUrl
						}, $$.checkinThumbnail)));
						
						row.add(Ti.UI.createLabel($.mixin({
							text: checkin.user.displayName
						}, $$.checkinTableRowNameLabel)));
						
						row.add(Ti.UI.createLabel($.mixin({
							text: String.format(L("checkin_to"), checkin.spot.name.formatted),
						}, $$.checkinTableRowCommentLabel)));
						
						var commentsButton = Ti.UI.createButton($$.checkinTableRowCommentsButton);
						commentsButton.addEventListener('click', function(){
							ex.ui.open(ex.ui.checkin.createCommentsWindow({
								title: L("comments"),
								postId: checkin.spot.id,
								checkinId: checkin.id,
								userId: checkin.user.id
							}));
						});
						row.add(commentsButton);
						
						var favoritesButton = Ti.UI.createButton($$.checkinTableRowFavoritesButton);
						favoritesButton.addEventListener('click', function(){
							ex.ui.open(ex.ui.checkin.createFavoritesWindow({
								title: L("favorites"),
								postId: checkin.spot.id,
								checkinId: checkin.id,
								userId: checkin.user.id
							}));
						});
						row.add(favoritesButton);
						
						tableView.appendRow(row);
					});
					
					indicator.hide();
				},
				error : function(e) {
					indicator.hide();
					alert(e.error);
				}
			})
		};
		
		$.osEach({
			iphone: _init,
			android: function(){
				win.addEventListener('open', _init);
			}
		});
		
		return win;
	};
	
	ex.ui.checkin.createCommentsWindow = function(config){
		var win = Ti.UI.createWindow($.mixin({
			title: config.title || L("checkin_api")
		}, $$.window));
		
		var _openForm = function(){
			var form = ex.ui.checkin.createCommentFormWindow({
				list: win,
				userId: config.userId,
				checkinId: config.checkinId
			});
			ex.ui.open(form);
		};
		ex.ui.setAddButton(win, _openForm);
		
		var _init = function(){
			var tableView = Ti.UI.createTableView({
				editable: true
			});
			tableView.addEventListener('delete', function(e){
				mixi.graphApi.checkinCommentsDestroy({
					userId: config.userId,
					checkinId: config.checkinId,
					commentId: e.rowData.commentId,
					success: function(json) {
						alert(json);
					},
					error: function(e) {
						alert(e.error);
					}
				});
			})
			win.add(tableView);
			
			win.addEventListener('reload', function(){
				tableView.setData([]);
				
				var indicator = ex.ui.createIndicator();
				win.add(indicator);
				indicator.show();
				
				mixi.graphApi.checkinComments({
					userId: config.userId,
					checkinId: config.checkinId,
					success: function(json) {
						json.entry.forEach(function(comment){
							var row = Ti.UI.createTableViewRow($.mixin({
								commentId: comment.id
							}, $$.checkinCommentTableRow));
							
							row.add(Ti.UI.createImageView($.mixin({
								image: comment.user.thumbnailUrl
							}, $$.checkinCommentThumbnail)));
							
							row.add(Ti.UI.createLabel($.mixin({
								text: comment.user.displayName
							}, $$.checkinCommentTableRowNameLabel)));
							
							row.add(Ti.UI.createLabel($.mixin({
								text: comment.text
							}, $$.checkinCommentTableRowCommentLabel)));
							
							tableView.appendRow(row);
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
	
	ex.ui.checkin.createFavoritesWindow = function(config){
		var win = Ti.UI.createWindow($.mixin({
			title: config.title || L("checkin_api")
		}, $$.window));
		
		var _like = function(){
			var indicator = ex.ui.createFrontIndicator(win, {message: L("sending")});
			indicator.show();
			
			mixi.graphApi.checkinFavoritesCreate({
				userId: config.userId,
				checkinId: config.checkinId,
				success: function(json){
					indicator.hide();
					alert(json);
					win.fireEvent('reload');
				},
				error: function(e){
					indicator.hide();
					alert(e.error);
				}
			});
		};
		
		$.osEach({
			iphone: function(){
				var addButton = Ti.UI.createButton({
					title: L("like")
				});
				addButton.addEventListener('click', _like);
				win.rightNavButton = addButton;
			},
			android: function(){
				win.activity.onCreateOptionsMenu = function(e){
					var menu = e.menu;
					var menuItem = menu.add({title: L('like')});
					menuItem.addEventListener('click', _like);
				};
			}
		});
		
		var _init = function(){
			var tableView = Ti.UI.createTableView({
				editable: true
			});
			tableView.addEventListener('click', function(e){
				ex.ui.open(ex.ui.people.createDetailWindow({
					title: e.rowData.displayName,
					userId: e.rowData.userId
				}));
			});
			tableView.addEventListener('delete', function(e){
				mixi.graphApi.checkinFavoritesDestroy({
					userId: config.userId,
					checkinId: config.checkinId,
					favoriteUserId: e.rowData.userId,
					success: function(json){
						alert(json);
					},
					error: function(e){
						alert(e.error);
					}
				});
			});
			win.add(tableView);
			
			win.addEventListener('reload', function(){
				tableView.setData([]);
				
				var indicator = ex.ui.createIndicator();
				win.add(indicator);
				indicator.show();
				
				mixi.graphApi.checkinFavorites({
					userId: config.userId,
					checkinId: config.checkinId,
					success: function(json){
						json.entry.forEach(function(user){
							var row = Ti.UI.createTableViewRow($.mixin({
								userId: user.id,
								displayName: user.displayName
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
					error: function(e){
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
	
	ex.ui.checkin.createCommentFormWindow = function(config){
		var win = Ti.UI.createWindow($.mixin({
			title: config.title || L('new_comment'),
			layout: 'vertical'
		}, $$.window));
		
		var textArea = Ti.UI.createTextArea($.mixin({
			value: L('this_is_test')
		}, $$.textArea, true));
		
		var button = Ti.UI.createButton($.mixin({
			title: L('post_comment')
		}, $$.button, true));
		button.addEventListener('click', function(){
			if (!$.isDefined(textArea.value)) {
				alert(L('please_input_comment'));
				return;
			}
			
			var indicator = ex.ui.createFrontIndicator(win, {message: L("sending")});
			indicator.show();
			
			mixi.graphApi.checkinCommentsCreate({
				userId: config.userId,
				checkinId: config.checkinId,
				parameters: {text: textArea.value},
				success: function(json) {
					indicator.hide();
					ex.ui.close(win);
					alert(json);
					config.list.fireEvent('reload');
				},
				error: function(e) {
					indicator.hide();
					alert(e.error);
				}
			});
		});
		
		win.add(textArea);
		win.add(button);
		
		return win;
	};
})();
