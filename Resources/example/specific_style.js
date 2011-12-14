(function(){
	// for iphone style.
	$$.textArea = {
		top: 20,
		width: 300, height: 100,
		borderColor: "#999",
		borderRadius: 5,
		font: {fontSize: 15}
	};
	
	$$.textField = {
		top: 20,
		width: 300,
		height: 40,
		borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
	}
	
	$$.button = {
		top: 20,
		width: 250,
		height: 40
	};
	
	$$.label = {
		font: {fontSize: 20, fontFamily: 'Helvetica Neue'},
		textAlign: 'center',
		width: 'auto',
		height: 'auto'
	};
	
	$$.indicator = {
		style: Ti.UI.iPhone.ActivityIndicatorStyle.DARK
	};
	
	$$.thumbnail = {
		width: 50,
		height: 50,
		borderRadius: 5,
		hires: true
	};
	
	// for People details
	$$.peopleTableRow = {
		height: 'auto',
		touchEnabled : false,
		selectionStyle : Ti.UI.iPhone.TableViewCellSelectionStyle.NONE
	};
	
	$$.peopleTableRowDisplayName = $.merge($$.peopleTableRow, {height: 70}, true);
	$$.peopleTableRowThumbnail = $.merge($$.thumbnail, {left: 10});
	$$.peopleTableRowName = $.merge($$.label, {left: 70, textAlign: 'left'}, true);
	
	$$.peopleTableRowLabel = $.merge($$.label, {left: 10, textAlign: 'left'}, true);
	
	// for Friend list
	$$.peopleTableRowFriendList = $.merge($$.peopleTableRow, {
		height: 70,
		touchEnabled : true,
		selectionStyle : Ti.UI.iPhone.TableViewCellSelectionStyle.BLUE,
		hasChild: true
	}, true);
	
	// for Updates list
	$$.updatesTableRow = {
		height: 100,
		touchEnabled : false,
		selectionStyle : Ti.UI.iPhone.TableViewCellSelectionStyle.NONE
	};
	
	$$.updatesThumbnail = $.merge({
		top: 10,
		left: 10
	}, $$.thumbnail);
	
	$$.updatesTableRowNameLabel = $.merge({
		top: 10,
		left: 70,
		font: {fontSize: 20, fontWeight: 'bold', fontFamily: 'Helvetica Neue'}
	}, $$.label);
	
	$$.updatesTableRowCommentLabel = $.merge({
		top: 40,
		left: 70,
		font: {fontSize: 12, fontFamily: 'Helvetica Neue'},
		textAlign: 'left'
	}, $$.label);
	
	// for voice list
	$$.voiceTableRow = $$.updatesTableRow;
	$$.voiceThumbnail = $$.updatesThumbnail;
	$$.voiceTableRowNameLabel = $$.updatesTableRowNameLabel;
	$$.voiceTableRowCommentLabel = $$.updatesTableRowCommentLabel;
	$$.voiceTableRowButton = {
		width: 80,
		height: 20,
		font: {fontSize: 10, fontFamily: 'Helvetica Neue'}
	};
	$$.voiceTableRowRepliesButton = $.merge({
		type: "replies",
		title: L("replies"),
		bottom: 10,
		right: 10
	}, $$.voiceTableRowButton);
	$$.voiceTableRowFavoritesButton = $.merge({
		type: "favorites",
		title: L("favorites"),
		bottom: 10,
		right: 100
	}, $$.voiceTableRowButton);
	
	// for Photo list
	$$.photoTableRow = {
		height: 120,
		touchEnabled : false,
		selectionStyle : Ti.UI.iPhone.TableViewCellSelectionStyle.NONE
	};
	
	$$.photoThumbnail = {
		height: 100, width: 100,
		top: 10, left: 10,
	};
	
	$$.photoTableRowLabel = $.merge($$.label, {top: 10, left: 120, textAlign: 'left'}, true);
	
	$$.photoTableRowButton = {
		width: 80,
		height: 20,
		font: {fontSize: 10, fontFamily: 'Helvetica Neue'}
	};
	
	$$.photoTableRowCommentsButton = $.merge({
		type: "comments",
		title: L("comments"),
		bottom: 10,
		right: 10
	}, $$.photoTableRowButton);
	
	$$.photoTableRowFavoritesButton = $.merge({
		type: "favorites",
		title: L("favorites"),
		bottom: 10,
		right: 100
	}, $$.photoTableRowButton);
	
	$$.photoCommentTableRow = {
		height: 100,
		touchEnabled : false,
		selectionStyle : Ti.UI.iPhone.TableViewCellSelectionStyle.NONE
	};
	
	$$.photoCommentThumbnail = $.merge({
		top: 10,
		left: 10
	}, $$.thumbnail);
	
	$$.photoCommentTableRowNameLabel = $.merge({
		top: 10,
		left: 70,
		font: {fontSize: 20, fontWeight: 'bold', fontFamily: 'Helvetica Neue'}
	}, $$.label);
	
	$$.photoCommentTableRowCommentLabel = $.merge({
		top: 40,
		left: 70,
		font: {fontSize: 12, fontFamily: 'Helvetica Neue'}
	}, $$.label);
	
	// for check-in list
	$$.checkinTableRow = $$.updatesTableRow;
	$$.checkinThumbnail = $$.updatesThumbnail;
	$$.checkinTableRowNameLabel = $$.updatesTableRowNameLabel;
	$$.checkinTableRowCommentLabel = $$.updatesTableRowCommentLabel;
	$$.checkinTableRowCommentsButton = $$.photoTableRowCommentsButton;
	$$.checkinTableRowFavoritesButton = $$.voiceTableRowFavoritesButton;
})();
