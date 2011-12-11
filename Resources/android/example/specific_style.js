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
		title: L("comments"),
		bottom: '10dp',
		right: '10dp'
	}, $$.photoTableRowButton);
	
	$$.photoTableRowFavoritesButton = $.merge({
		title: L("favorites"),
		bottom: '40dp',
		right: '10dp'
	}, $$.photoTableRowButton);
})();
