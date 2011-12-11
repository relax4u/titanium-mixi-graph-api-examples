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
			var win = ex.ui.photo.createAlbumListWindow(function(album){
				ex.ui.open(ex.ui.photo.createMediaItemListWindow({
					title: album.title,
					albumId: album.albumId
				}));
			});
			ex.ui.open(win);
		});
		
		var addAlbum = Ti.UI.createButton($.mixin({
			title: L('add_album')
		}, $$.button));
		addAlbum.addEventListener('click', function(){
			mixi.graphApi.photoAlbumsCreate({
				parameters: {
					title: L('new_album_title'),
					description: L('new_album_description'),
					visibility: "self"
				},
				success: function(json){
					alert(json);
				}
			});
		});
		
		var addPhoto = Ti.UI.createButton($.mixin({
			title: L('add_photo')
		}, $$.button));
		addPhoto.addEventListener('click', function(){
			var win = ex.ui.photo.addPhotoWindow();
			ex.ui.open(win);
		});
		
		win.add(albums);
		win.add(addAlbum);
		win.add(addPhoto);
		
		return win;
	}
	
	ex.ui.photo.addPhotoWindow = function() {
		return ex.ui.photo.createAlbumListWindow(function(data){
			Ti.Media.openPhotoGallery({
				success: function(e) {
					var dialog = Ti.UI.createAlertDialog({
						message: L('may_i_upload'),
						buttonNames: [L('upload'), L('cancel')],
						cancel: 1
					});
					dialog.addEventListener('click', function(f){
						if (f.index != 0) return;
						
						mixi.graphApi.photoMediaItemsCreate({
							albumId: data.albumId,
							parameters: {
								image: e.media
							},
							success: function(json){
								alert(json);
								win.close();
							},
							failure: function(e){
								alert(e.error);
							}
						});
					});
					dialog.show();
				},
				mediaTypes: [Ti.Media.MEDIA_TYPE_PHOTO]
			});
		});
	};
	
	
	ex.ui.photo.createAlbumListWindow = function(callback) {
		var win = Ti.UI.createWindow($.mixin({
			title: L('select_album')
		}, $$.window));
		
		win.addEventListener('open', function(){
			var tableView = Ti.UI.createTableView();
			tableView.addEventListener('click', function(e){
				switch(e.source.type) {
					case "comments":
						break;
					default:
						callback(e.rowData);
						break;
				}
			});
			win.add(tableView);
			
			var indicator = ex.ui.createIndicator();
			win.add(indicator);
			indicator.show();
			
			mixi.graphApi.photoAlbums({
				success: function(json) {
					json.entry.forEach(function(album){
						var row = Ti.UI.createTableViewRow($.mixin({
							type: 'row',
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
							ex.ui.open(ex.ui.photo.createCommentListWindow({
								title: L("comments"),
								api: mixi.graphApi.photoAlbumComments,
								albumId: album.id
							}));
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
		
		return win;
	};
	
	ex.ui.photo.createMediaItemListWindow = function(config){
		var win = Ti.UI.createWindow($.mixin({
			title: config.title || L('select_album')
		}, $$.window));
		
		win.addEventListener('open', function(){
			var tableView = Ti.UI.createTableView();
			win.add(tableView);
			
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
							ex.ui.open(ex.ui.photo.createCommentListWindow({
								title: L("comments"),
								api: mixi.graphApi.photoMediaItemComments,
								albumId: photo.albumId,
								mediaItemId: photo.id
							}));
						});
						row.add(commentsButton);
						
						var favoritesButton = Ti.UI.createButton($$.photoTableRowFavoritesButton);
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
		
		return win;
	};
	
	ex.ui.photo.createCommentListWindow = function(config){
		var win = Ti.UI.createWindow($.mixin({
			title: config.title || L('comment_list')
		}, $$.window));
		
		win.addEventListener('open', function(){
			var tableView = Ti.UI.createTableView();
			win.add(tableView);
			
			var indicator = ex.ui.createIndicator();
			win.add(indicator);
			indicator.show();
			
			config.api({
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
		
		return win;
	};
	
	function createCommentRow(comment) {
		var row = Ti.UI.createTableViewRow($$.photoCommentTableRow);
		
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
