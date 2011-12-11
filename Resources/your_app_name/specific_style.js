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
})();
