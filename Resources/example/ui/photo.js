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
			mixi.graphApi.photoAlbums({
				success: function(json){
					alert(json);
				}
			});
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
		
		var tableView = Ti.UI.createTableView();
		tableView.addEventListener('click', function(e){
			callback(e.rowData);
		});
		
		mixi.graphApi.photoAlbums({
			success: function(json) {
				for (var i = 0; i < json.entry.length; i++) {
					tableView.appendRow({
						title: json.entry[i].title,
						albumId: json.entry[i].id
					});
				}
			},
			autoAuthorize: false
		});
		
		win.add(tableView);
		
		return win;
	};
})();
