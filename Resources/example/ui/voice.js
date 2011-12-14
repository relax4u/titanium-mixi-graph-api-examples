(function(){
	ex.ui.voice = {};
	
	ex.ui.voice.createWindow = function(){
		var win = Ti.UI.createWindow($.mixin({
			title: L("voice_api"),
			layout: 'vertical'
		}, $$.window));
		
		var userTimeline = Ti.UI.createButton($.mixin({
			title: L("user_timeline")
		}, $$.button));
		userTimeline.addEventListener('click', function(){
			ex.ui.open(ex.ui.voice.createListWindow({
				type: "mine",
				title: L("user_timeline")
			}));
		});
		
		var friendTimeline = Ti.UI.createButton($.mixin({
			title: L("friend_timeline")
		}, $$.button));
		friendTimeline.addEventListener('click', function(){
			ex.ui.open(ex.ui.voice.createListWindow({
				type: "friend",
				title: L("friend_timeline")
			}));
		});
		
		win.add(userTimeline);
		win.add(friendTimeline);
		
		return win;
	};
	
	ex.ui.voice.createListWindow = function(config){
		var win = Ti.UI.createWindow($.mixin({
			title: config.title || L("voice_api")
		}, $$.window));
		
		var _openForm = function(){
			ex.ui.open(ex.ui.voice.createUpdateWindow({
				type: config.type,
				list: win,
				postId: config.postId
			}));
		};
		ex.ui.setAddButton(win, _openForm);
		
		var _init = function(){
			var tableView = Ti.UI.createTableView({
				editable: true
			});
			win.add(tableView);
			
			tableView.addEventListener('delete', function(e){
				mixi.graphApi.voiceStatusesDestroy({
					postId: e.rowData.postId,
					success: function(json){
						alert(json);
					},
					error: function(error){
						alert(error.error);
					}
				});
			});
			
			
			tableView.addEventListener('click', function(e){
				switch (e.source.type) {
					case "favorites":
					case "replies":
						break;
					default:
						mixi.graphApi.voiceStatuses({
							postId: e.rowData.postId,
							success: function(json) {
								alert(json);
							},
							error: function(e){
								alert(e.error);
							}
						});
				}
			});
			
			win.addEventListener('reload', function(){
				tableView.setData([]);
				
				var name = $.specify(config.type, {
					"mine": "voiceStatusesUserTimeline",
					"friend": "voiceStatusesFriendTimeline",
					"reply": "voiceReplies"
				});
				
				var indicator = ex.ui.createIndicator();
				win.add(indicator);
				indicator.show();
				
				mixi.graphApi[name]({
					postId: config.postId,
					success: function(json){
						json.forEach(function(voice){
							var row = Ti.UI.createTableViewRow($.mixin({
								postId: voice.id,
								userId: voice.user.id
							}, $$.voiceTableRow));
							
							row.add(Ti.UI.createImageView($.mixin({
								image: voice.user.profile_image_url
							}, $$.voiceThumbnail)));
							
							row.add(Ti.UI.createLabel($.mixin({
								text: voice.user.screen_name
							}, $$.voiceTableRowNameLabel)));
							
							row.add(Ti.UI.createLabel($.mixin({
								text: voice.text
							}, $$.voiceTableRowCommentLabel)));
							
							var repliesButton = Ti.UI.createButton($$.voiceTableRowRepliesButton);
							repliesButton.addEventListener('click', function(){
								ex.ui.open(ex.ui.voice.createReplyListWindow({
									title: L("replies"),
									postId: voice.id
								}));
							});
							row.add(repliesButton);
								
							var favoritesButton = Ti.UI.createButton($$.voiceTableRowFavoritesButton);
							favoritesButton.addEventListener('click', function(){
								ex.ui.open(ex.ui.voice.createFavoritesWindow({
									title: L("favorites"),
									postId: voice.id
								}));
							});
							row.add(favoritesButton);
							
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
	
	ex.ui.voice.createReplyListWindow = function(config){
		var win = Ti.UI.createWindow($.mixin({
			title: config.title || L("voice_api")
		}, $$.window));
		
		var _openForm = function(){
			ex.ui.open(ex.ui.voice.createReplyFormWindow({
				list: win,
				postId: config.postId
			}));
		};
		ex.ui.setAddButton(win, _openForm);
		
		var _init = function(){
			var tableView = Ti.UI.createTableView({
				editable: true
			});
			win.add(tableView);
			
			tableView.addEventListener('delete', function(e){
				mixi.graphApi.voiceRepliesDestroy({
					postId: config.postId,
					commentId: e.rowData.commentId,
					success: function(json){
						alert(json);
					},
					error: function(error){
						alert(error.error);
					}
				});
			});
			
			win.addEventListener('reload', function(){
				tableView.setData([]);
				
				var indicator = ex.ui.createIndicator();
				win.add(indicator);
				indicator.show();
				
				mixi.graphApi.voiceReplies({
					postId: config.postId,
					success: function(json){
						json.forEach(function(voice){
							var row = Ti.UI.createTableViewRow($.mixin({
								commentId: voice.id,
								userId: voice.user.id
							}, $$.voiceTableRow));
							
							row.add(Ti.UI.createImageView($.mixin({
								image: voice.user.profile_image_url
							}, $$.voiceThumbnail)));
							
							row.add(Ti.UI.createLabel($.mixin({
								text: voice.user.screen_name
							}, $$.voiceTableRowNameLabel)));
							
							row.add(Ti.UI.createLabel($.mixin({
								text: voice.text
							}, $$.voiceTableRowCommentLabel)));
							
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
	
	ex.ui.voice.createFavoritesWindow = function(config) {
		var win = Ti.UI.createWindow($.mixin({
			title: config.title || L('favorites')
		}, $$.window));
		
		var _like = function(){
			mixi.graphApi.voiceFavoritesCreate({
				postId: config.postId,
				success: function(json){
					alert(json);
					win.fireEvent('reload');
				},
				error: function(e){
					alert(e.error);
				}
			})
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
				mixi.graphApi.voiceFavoritesDestroy({
					postId: config.postId,
					userId: e.rowData.userId,
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
				
				mixi.graphApi.voiceFavorites({
					postId: config.postId,
					success: function(json){
						json.forEach(function(user){
							var row = Ti.UI.createTableViewRow($.mixin({
								userId: user.id,
								displayName: user.screen_name,
							},$$.peopleTableRowFriendList));
							
							row.add(Ti.UI.createImageView($.mixin({
								image: user.profile_image_url
							}, $$.peopleTableRowThumbnail)));
							
							row.add(Ti.UI.createLabel($.mixin({
								text: user.screen_name
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
	
	ex.ui.voice.createUpdateWindow = function(config){
		var image = null;
		
		var win = Ti.UI.createWindow($.mixin({
			title: L('new_voice'),
			layout: 'vertical'
		}, $$.window, true));
		
		var textArea = Ti.UI.createTextArea($.mixin({
			value: L('this_is_test')
		}, $$.textArea, true));
		
		var button = Ti.UI.createButton($.mixin({
			title: L('post_voice')
		}, $$.button, true));
		button.addEventListener('click', function(){
			if ($.isBlank(textArea.value)) {
				alert(L('please_input_voice'));
				return;
			}
			
			var params = {status: textArea.value};
			if ($.isDefined(image)) params.photo = image;
			
			var indicator = ex.ui.createIndicator();
			win.add(indicator);
			indicator.show();
			
			mixi.graphApi.voiceStatusesUpdate({
				parameters: params,
				success: function(json) {
					indicator.hide();
					ex.ui.close(win);
					config.list.fireEvent('reload');
					alert(json);
				},
				error: function(e) {
					indicator.hide();
					alert(e.error);
				}
			});
		});
		
		win.add(textArea);
		win.add(button);
		
		$.osEach({
			iphone: function(){
				var button = Ti.UI.createButton({
					systemButton: Ti.UI.iPhone.SystemButton.CAMERA
				});
				button.addEventListener('click', function(){
					Ti.Media.openPhotoGallery({
						success: function(event){
							image = event.media;
						}
					});
				});
				win.rightNavButton = button;
			},
			android: function(){
				win.activity.onCreateOptionsMenu = function(e){
					var menu = e.menu;
					var menuItem = menu.add({title: L('add_photo')});
					menuItem.addEventListener('click', function(){
						Ti.Media.openPhotoGallery({
							success: function(event){
								image = event.media;
							}
						});
					});
				};
			}
		});
		
		return win;
	};
	
	ex.ui.voice.createReplyFormWindow = function(config) {
		var win = Ti.UI.createWindow($.mixin({
			title: L('new_comment'),
			layout: 'vertical'
		}, $$.window, true));
		
		var textArea = Ti.UI.createTextArea($.mixin({
			value: L('this_is_test')
		}, $$.textArea, true));
		
		var button = Ti.UI.createButton($.mixin({
			title: L('post_comment')
		}, $$.button, true));
		button.addEventListener('click', function(){
			if ($.isBlank(textArea.value)) {
				alert(L('please_input_comment'));
				return;
			}
			
			var indicator = ex.ui.createIndicator();
			win.add(indicator);
			indicator.show();
			
			mixi.graphApi.voiceRepliesCreate({
				postId: config.postId,
				parameters: {text: textArea.value},
				success: function(json) {
					indicator.hide();
					ex.ui.close(win);
					config.list.fireEvent('reload');
					alert(json);
				},
				error: function(e){
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
