(function(){
	// for android style.
	$.mixin($$.root, {
		fullscreen: false,
		exitOnClose: true     // don't remove
	});
	
	$.mixin($$.window, {
		fullscreen: false,
		exitOnClose: false    // don't remove
	});
	
	$$.textArea = {
		top: '20dp',
		width: '200dp', height: '100dp',
		font: {fontSize: '15dp'}
	};
	
	$$.textField = {
		top: '20dp',
		width: '200dp',
		height: '40dp'
	};
	
	$$.button = {
		top: '20dp',
		width: '160dp',
		height: '40dp'
	};
	
	$$.label = {
		color: '#000',
		font: {fontSize: '20dp', fontFamily: 'Helvetica Neue'},
		textAlign: 'center',
		width: 'auto',
		height: 'auto'
	};
	
	$$.indicator = {
		font: {fontSize: '20dp', fontFamily: 'Helvetica Neue'},
		width: 'auto',
		height: 'auto',
		color: "#fff",
		message: L("loading")
	};
	
	$$.thumbnail = {
		width: '50dp',
		height: '50dp',
		borderRadius: 5,
		hires: true
	};
	
	// for People details
	$$.peopleTableRow = {
		height: 'auto',
		touchEnabled : false
	};	
	$$.peopleTableRowDisplayName = $.merge($$.peopleTableRow, {height: '70dp'}, true);
	$$.peopleTableRowThumbnail = $.merge($$.thumbnail, {left: '10dp'});
	$$.peopleTableRowName = $.merge($$.label, {left: '70dp', textAlign: 'left'}, true);
	
	$$.peopleTableRowLabel = $.merge($$.label, {left: '10dp', textAlign: 'left'}, true);
	
	// for Friend list
	$$.peopleTableRowFriendList = $.merge($$.peopleTableRow, {
		height: '70dp',
		touchEnabled : true,
		hasChild: true
	}, true);
	
	// for Updates list
	$$.updatesTableRow = {
		height: '100dp',
		touchEnabled : false,
		selectionStyle : Ti.UI.iPhone.TableViewCellSelectionStyle.NONE
	};
	
	$$.updatesThumbnail = $.merge({
		top: '10dp',
		left: '10dp'
	}, $$.thumbnail);
	
	$$.updatesTableRowNameLabel = $.merge({
		top: '10dp',
		left: '70dp',
		font: {fontSize: '20dp', fontWeight: 'bold', fontFamily: 'Helvetica Neue'}
	}, $$.label);
	
	$$.updatesTableRowCommentLabel = $.merge({
		top: '40dp',
		left: '70dp',
		font: {fontSize: '12dp', fontFamily: 'Helvetica Neue'},
		textAlign: 'left'
	}, $$.label);
	
	// for voice list
	$$.voiceTableRow = $$.updatesTableRow;
	$$.voiceThumbnail = $$.updatesThumbnail;
	$$.voiceTableRowNameLabel = $$.updatesTableRowNameLabel;
	$$.voiceTableRowCommentLabel = $$.updatesTableRowCommentLabel;
	$$.voiceTableRowButton = {
		width: '80dp',
		height: '20dp',
		font: {fontSize: '10dp', fontFamily: 'Helvetica Neue'}
	};
	$$.voiceTableRowRepliesButton = $.merge({
		type: "replies",
		title: L("replies"),
		bottom: '10dp',
		right: '10dp'
	}, $$.voiceTableRowButton);
	$$.voiceTableRowFavoritesButton = $.merge({
		type: "favorites",
		title: L("favorites"),
		bottom: '40dp',
		right: '10dp'
	}, $$.voiceTableRowButton);
	
	// for Message list
	$$.messageTableRow = $$.updatesTableRow;
	$$.messageThumbnail = $$.updatesThumbnail;
	$$.messageTableRowTitleLabel = $.merge({
		top: '10dp',
		left: '70dp',
		height: '15dp',
		font: {fontSize: '10dp', fontWeight: 'bold', fontFamily: 'Helvetica Neue'}
	}, $$.label);
	$$.messageTableRowBodyLabel = $.merge({
		top: '40dp',
		left: '70dp',
		height: '30dp',
		font: {fontSize: '10dp', fontFamily: 'Helvetica Neue'},
		textAlign: 'left'
	}, $$.label);
	$$.messageTableRowReplyButton = $.merge({
		type: "reply",
		title: L("reply"),
		bottom: '10dp',
		right: '10dp'
	}, $$.voiceTableRowButton);
	
	// for Photo list
	$$.photoTableRow = {
		height: '100dp',
		touchEnabled : false,
		selectionStyle : Ti.UI.iPhone.TableViewCellSelectionStyle.NONE
	};
	
	$$.photoThumbnail = {
		height: '80dp', width: '80dp',
		top: '10dp', left: '10dp'
	};
	
	$$.photoTableRowLabel = $.merge($$.label, {top: '10dp', left: '120dp', textAlign: 'left'}, true);
	
	$$.photoTableRowButton = {
		width: '80dp',
		height: '20dp',
		font: {fontSize: '10dp', fontFamily: 'Helvetica Neue'}
	};
	
	$$.photoTableRowCommentsButton = $.merge({
		type: "comments",
		title: L("comments"),
		bottom: '10dp',
		right: '10dp'
	}, $$.photoTableRowButton);
	
	$$.photoTableRowFavoritesButton = $.merge({
		type: "favorites",
		title: L("favorites"),
		bottom: '40dp',
		right: '10dp'
	}, $$.photoTableRowButton);
	
	$$.photoCommentTableRow = {
		height: '100dp',
		touchEnabled : false,
		selectionStyle : Ti.UI.iPhone.TableViewCellSelectionStyle.NONE
	};
	
	$$.photoCommentThumbnail = $.merge({
		top: '10dp',
		left: '10dp'
	}, $$.thumbnail);
	
	$$.photoCommentTableRowNameLabel = $.merge({
		top: '10dp',
		left: '70dp',
		font: {fontSize: '20dp', fontWeight: 'bold', fontFamily: 'Helvetica Neue'}
	}, $$.label);
	
	$$.photoCommentTableRowCommentLabel = $.merge({
		top: '40dp',
		left: '70dp',
		font: {fontSize: '12dp', fontFamily: 'Helvetica Neue'}
	}, $$.label);
	
	// for check-in list
	$$.checkinTableRow = $$.updatesTableRow;
	$$.checkinThumbnail = $$.updatesThumbnail;
	$$.checkinTableRowNameLabel = $$.updatesTableRowNameLabel;
	$$.checkinTableRowCommentLabel = $$.updatesTableRowCommentLabel;
	$$.checkinTableRowCommentsButton = $$.photoTableRowCommentsButton;
	$$.checkinTableRowFavoritesButton = $$.voiceTableRowFavoritesButton;
	
	$$.checkinCommentTableRow = $$.photoCommentTableRow;
	$$.checkinCommentThumbnail = $$.photoCommentThumbnail;
	$$.checkinCommentTableRowNameLabel = $$.photoCommentTableRowNameLabel;
	$$.checkinCommentTableRowCommentLabel = $$.photoCommentTableRowCommentLabel;
})();
