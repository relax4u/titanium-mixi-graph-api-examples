(function(){
	ex.ui.photo = {};
	
	ex.ui.photo.createWindow = function(){
		var win = Ti.UI.createWindow($.mixin({
			title: L("photo_api"),
			layout: 'vertical'
		}, $$.window));
		
		var albums = Ti.UI.createButton($.mixin({
			title: L("album_list")
		}, $$.button));
		albums.addEventListener('click', function(){
			var win = ex.ui.photo.createAlbumListWindow({type: 'mine'});
			ex.ui.open(win);
		});
		
		var friendAlbums = Ti.UI.createButton($.mixin({
			title: L("friend_album_list")
		}, $$.button));
		friendAlbums.addEventListener('click', function(){
			var win = ex.ui.photo.createAlbumListWindow({type: 'friend'});
			ex.ui.open(win);
		});
		
		win.add(albums);
		win.add(friendAlbums);
		
		return win;
	};
	
	ex.ui.photo.createAlbumListWindow = function(config) {
		var win = Ti.UI.createWindow($.mixin({
			title: L('select_album')
		}, $$.window));
		
		$.specify(config.type, {
			"mine": function(){
				var _openForm = function(){
					var form = ex.ui.photo.createAlbumForm({
						list: win
					});
					form.open({modal: true});
				};
				ex.ui.setAddButton(win, _openForm);
			}
		});
		
		var _init = function(){
			var tableView = Ti.UI.createTableView({
				editable: config.type == "mine"
			});
			
			$.specify(config.type, {
				"mine": function(){
					tableView.addEventListener('delete', function(e){
						mixi.graphApi.photoAlbumsDestroy({
							albumId: e.rowData.albumId,
							success: function(json){
								alert(json);
							},
							failure: function(e){
								alert(e.error);
							}
						});
					});
				}
			});
			
			tableView.addEventListener('click', function(e){
				switch(e.source.type) {
					case "comments":
						break;
					default:
						ex.ui.open(ex.ui.photo.createMediaItemListWindow({
							type: config.type,
							title: e.rowData.name,
							albumId: e.rowData.albumId
						}));
						break;
				}
			});
			win.add(tableView);
			
			win.addEventListener('reload', function(event){
				tableView.setData([]);
				
				var indicator = ex.ui.createIndicator();
				win.add(indicator);
				indicator.show();
				
				var name = $.specify(config.type, {
					"mine": "photoAlbums",
					"friend": "photoFriendAlbums"
				});
				
				mixi.graphApi[name]({
					success: function(json) {
						json.entry.forEach(function(album){
							var row = Ti.UI.createTableViewRow($.mixin({
								type: 'row',
								name: album.title,
								albumId: album.id
							},$$.photoTableRow));
							
							row.add(Ti.UI.createImageView($.mixin({
								image: album.thumbnailUrl
							}, $$.photoThumbnail)));
							
							row.add(Ti.UI.createLabel($.mixin({
								text: album.title
							}, $$.photoTableRowLabel)));
							
							var commentsButton = Ti.UI.createButton($$.photoTableRowCommentsButton);
							commentsButton.addEventListener('click', function(){
								var win = ex.ui.photo.createCommentListWindow({
									type: config.type,
									title: L("comments"),
									indexApi: mixi.graphApi.photoAlbumComments,
									createApi: mixi.graphApi.photoAlbumCommentsCreate,
									deleteApi: mixi.graphApi.photoAlbumCommentsDestroy,
									userId: album.ownerId,
									albumId: album.id
								});
								ex.ui.open(win);
							});
							row.add(commentsButton);
							
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
	
	ex.ui.photo.createMediaItemListWindow = function(config){
		var win = Ti.UI.createWindow($.mixin({
			title: config.title || L('select_album')
		}, $$.window));
		
		var _openCamera = function(_config){
			_config = $.mixin({
				photoGarallery: false
			}, _config, true);
			
			var options = {
				success: function(e) {
					var dialog = Ti.UI.createAlertDialog({
						message: L('may_i_upload'),
						buttonNames: [L('upload'), L('cancel')],
						cancel: 1
					});
					dialog.addEventListener('click', function(f){
						if (f.index != 0) return;
						
						mixi.graphApi.photoMediaItemsCreate({
							albumId: config.albumId,
							parameters: {
								image: e.media
							},
							success: function(json){
								alert(json);
								win.fireEvent('reload');
							},
							failure: function(e){
								alert(e.error);
							}
						});
					});
					dialog.show();
				},
				mediaTypes: [Ti.Media.MEDIA_TYPE_PHOTO]
			};
			
			if (_config.photoGarallery) {
				Ti.Media.openPhotoGallery(options);
			} else {
				options.error = function(){
					var dialog = Ti.UI.createAlertDialog({
						message: L('camera_is_not_supported'),
						buttonNames: [L('open'), L('cancel')],
						cancel: 1
					});
					dialog.addEventListener('click', function(e){
						if (e.index != 0) return;
						_openCamera({photoGarallery: true});
					})
					dialog.show();
				};
				Ti.Media.showCamera(options);
			}
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
		
		var _init = function(){
			var tableView = Ti.UI.createTableView({
				editable: true
			});
			tableView.addEventListener('delete', function(e){
				mixi.graphApi.photoMediaItemsDestroy({
					albumId: e.rowData.albumId,
					mediaItemId: e.rowData.mediaItemId,
					success: function(json){
						alert(json);
					},
					failure: function(e){
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
				
				mixi.graphApi.photoMediaItems({
					albumId: config.albumId,
					success: function(json){
						json.entry.forEach(function(photo){
							var row = Ti.UI.createTableViewRow($.mixin({
								albumId: photo.albumId,
								mediaItemId: photo.id
							}, $$.photoTableRow));
							
							row.add(Ti.UI.createImageView($.mixin({
								image: photo.thumbnailUrl
							}, $$.photoThumbnail)));
							
							row.add(Ti.UI.createLabel($.mixin({
								text: photo.title
							}, $$.photoTableRowLabel)));
							
							var commentsButton = Ti.UI.createButton($$.photoTableRowCommentsButton);
							commentsButton.addEventListener('click', function(){
								var win = ex.ui.photo.createCommentListWindow({
									title: L("comments"),
									indexApi: mixi.graphApi.photoMediaItemComments,
									createApi: mixi.graphApi.photoMediaItemCommentsCreate,
									deleteApi: mixi.graphApi.photoMediaItemCommentsDestroy,
									userId: photo.owner.id,
									albumId: photo.albumId,
									mediaItemId: photo.id
								});
								ex.ui.open(win);
							});
							row.add(commentsButton);
							
							var favoritesButton = Ti.UI.createButton($$.photoTableRowFavoritesButton);
							favoritesButton.addEventListener('click', function(){
								var win = ex.ui.photo.createFavoritesWindow({
									title: L("favorites"),
									albumId: photo.albumId,
									mediaItemId: photo.id
								});
								ex.ui.open(win);
							});
							row.add(favoritesButton);
							
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
	
	ex.ui.photo.createCommentListWindow = function(config){
		var win = Ti.UI.createWindow($.mixin({
			title: config.title || L('comments')
		}, $$.window));
		
		var _openForm = function(){
			var form = ex.ui.photo.createCommentForm({
				list: win,
				api: config.createApi,
				userId: config.userId,
				albumId: config.albumId,
				mediaItemId: config.mediaItemId
			});
			form.open({modal: true});
		};
		ex.ui.setAddButton(win, _openForm);
		
		var _init = function(){
			var tableView = Ti.UI.createTableView({
				editable: true
			});
			tableView.addEventListener('delete', function(e){
				config.deleteApi({
					userId: config.userId,
					albumId: config.albumId,
					mediaItemId: config.mediaItemId,
					commentId: e.rowData.commentId,
					success: function(json) {
						alert(json);
					},
					failure: function(e) {
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
				
				config.indexApi({
					userId: config.userId,
					albumId: config.albumId,
					mediaItemId: config.mediaItemId,
					success: function(json) {
						for (var i = 0; i < json.entry.length; i++) {
							tableView.appendRow(createCommentRow(json.entry[i]));
						}
						
						indicator.hide();
					},
					failure: function(e) {
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
	
	ex.ui.photo.createFavoritesWindow = function(config) {
		console.log(config);
		var win = Ti.UI.createWindow($.mixin({
			title: config.title || L('favorites')
		}, $$.window));
		
		// var _like = function(){
			// mixi.graphApi.photoMediaItemFavoritesCreate({
				// albumId: config.albumId,
				// mediaItemId: config.mediaItemId,
				// success: function(json){
					// alert(json);
				// },
				// failure: function(e){
					// alert(e.error);
				// }
			// })
		// };
// 		
		// $.osEach({
			// iphone: function(){
				// var addButton = Ti.UI.createButton({
					// title: L("like")
				// });
				// addButton.addEventListener('click', _like);
				// win.rightNavButton = addButton;
			// },
			// android: function(){
				// win.activity.onCreateOptionsMenu = function(e){
					// var menu = e.menu;
					// var menuItem = menu.add({title: L('like')});
					// menuItem.addEventListener('click', _like);
				// };
			// }
		// });
		
		var _init = function(){
			var tableView = Ti.UI.createTableView({
				editable: true
			});
			tableView.addEventListener('delete', function(e){
				mixi.graphApi.photoMediaItemFavoritesDestroy({
					albumId: config.albumId,
					mediaItemId: config.mediaItemId,
					favoriteUserId: e.rowData.userId,
					success: function(json){
						alert(json);
					},
					failure: function(e){
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
				
				mixi.graphApi.photoMediaItemFavorites({
					albumId: config.albumId,
					mediaItemId: config.mediaItemId,
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
	
	ex.ui.photo.createAlbumForm = function(config) {
		var win = Ti.UI.createWindow($.mixin({
			title: config.title || L('new_album'),
			layout: 'vertical'
		}, $$.window));
		
		$.iphoneOnly(function(){
			var button = Ti.UI.createButton({
				systemButton: Ti.UI.iPhone.SystemButton.CANCEL
			});
			button.addEventListener('click', function(){
				win.close();
			});
			win.leftNavButton = button;
		});
		
		var textField = Ti.UI.createTextField($.mixin({
			hintText: L("please_input_title"),
			value: L('new_album_title')
		}, $$.textField, true));
		
		var textArea = Ti.UI.createTextArea($.mixin({
			value: L('this_is_test')
		}, $$.textArea, true));
		
		var button = Ti.UI.createButton($.mixin({
			title: L('post_comment')
		}, $$.button, true));
		button.addEventListener('click', function(){
			if (!$.isDefined(textField.value) || !$.isDefined(textArea.value)) {
				alert(L('please_input_title'));
				return;
			}
			
			var indicator = ex.ui.createDarkIndicator({
				message: L("uploading")
			});
			win.add(indicator);
			indicator.show();
			
			mixi.graphApi.photoAlbumsCreate({
				parameters: {
					title: textField.value,
					description: textArea.value,
					visibility: "self"
				},
				success: function(json) {
					indicator.hide();
					win.close();
					alert(json);
					config.list.fireEvent('reload');
				},
				failure: function(e) {
					indicator.hide();
					alert(e.error);
				}
			});
		});
		
		win.add(textField);
		win.add(textArea);
		win.add(button);
		
		return win;
	};
	
	ex.ui.photo.createCommentForm = function(config) {
		var win = Ti.UI.createWindow($.mixin({
			title: config.title || L('new_comment'),
			layout: 'vertical'
		}, $$.window));
		
		$.iphoneOnly(function(){
			var button = Ti.UI.createButton({
				systemButton: Ti.UI.iPhone.SystemButton.CANCEL
			});
			button.addEventListener('click', function(){
				win.close();
			});
			win.leftNavButton = button;
		});
		
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
			
			var indicator = ex.ui.createDarkIndicator({
				message: L("uploading")
			});
			win.add(indicator);
			indicator.show();
			
			config.api({
				userId: config.userId,
				albumId: config.albumId,
				mediaItemId: config.mediaItemId,
				parameters: {text: textArea.value},
				success: function(json) {
					indicator.hide();
					win.close();
					alert(json);
					config.list.fireEvent('reload');
				},
				failure: function(e) {
					indicator.hide();
					alert(e.error);
				}
			});
		});
		
		win.add(textArea);
		win.add(button);
		
		return win;
	};
	
	function createCommentRow(comment) {
		var row = Ti.UI.createTableViewRow($.mixin({
			commentId: comment.id
		}, $$.photoCommentTableRow));
		
		row.add(Ti.UI.createImageView($.mixin({
			image: comment.user.thumbnailUrl
		}, $$.photoCommentThumbnail)));
		
		row.add(Ti.UI.createLabel($.mixin({
			text: comment.user.displayName
		}, $$.photoCommentTableRowNameLabel)));
		
		row.add(Ti.UI.createLabel($.mixin({
			text: comment.text
		}, $$.photoCommentTableRowCommentLabel)))
		
		return row;
	}
})();
