(function(){
	ex.ui.message = {};
	
	ex.ui.message.createWindow = function(){
		var win = Ti.UI.createWindow($.mixin({
			title: L("message_api"),
			layout: 'vertical'
		}, $$.window));
		
		var inboxButton = Ti.UI.createButton($.mixin({
			title: L("inbox")
		}, $$.button));
		inboxButton.addEventListener('click', function(){
			ex.ui.open(ex.ui.message.createListWindow({
				boxId: "@inbox",
				title: L("inbox")
			}));
		});
		
		var outboxButton = Ti.UI.createButton($.mixin({
			title: L("outbox")
		}, $$.button));
		outboxButton.addEventListener('click', function(){
			ex.ui.open(ex.ui.message.createListWindow({
				boxId: "@outbox",
				title: L("outbox")
			}));
		});
		
		win.add(inboxButton);
		win.add(outboxButton);
		
		return win;
	};
	
	ex.ui.message.createListWindow = function(config){
		var win = Ti.UI.createWindow($.mixin({
			title: L("message_api")
		}, $$.window));
		
		var _init = function(){
			var tableView = Ti.UI.createTableView({
				editable: true
			});
			win.add(tableView);
			
			tableView.addEventListener('delete', function(e){
				mixi.graphApi.messagesDestroy({
					boxId: config.boxId,
					messageId: e.rowData.messageId,
					success: function(json) {
						alert(json);
					},
					error: function(e){
						alert(e.error);
					}
				});
			});
			
			win.addEventListener('reload', function(){
				var indicator = ex.ui.createIndicator();
				indicator.show();
				
				mixi.graphApi.messages({
					boxId: config.boxId,
					parameters: {fields: "@all"},
					success: function(json){
						json.entry.forEach(function(message){
							var row = Ti.UI.createTableViewRow($.mixin({
								messageId: message.id
							}, $$.messageTableRow));
							
							var user = $.specify(config.boxId, {
								"@inbox": "sender",
								"@outbox": "recipient"
							});
							
							if ($.isPresent(message[user].thumbnailUrl)) {
								row.add(Ti.UI.createImageView($.mixin({
									image: message[user].thumbnailUrl
								}, $$.messageThumbnail)));
							}
							
							row.add(Ti.UI.createLabel($.mixin({
								text: message.title
							}, $$.messageTableRowTitleLabel)));
							
							row.add(Ti.UI.createLabel($.mixin({
								text: message.body
							}, $$.messageTableRowBodyLabel)));
							
							var replyButton = Ti.UI.createButton($$.messageTableRowReplyButton);
							replyButton.addEventListener('click', function(){
								ex.ui.open(ex.ui.message.createSendFormWindow({
									title: L("reply"),
									inReplyTo: message.id,
									messageTitle: "Re: " + message.title
								}));
							});
							row.add(replyButton);
							
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
	
	ex.ui.message.createSendFormWindow = function(config){
		var win = Ti.UI.createWindow($.mixin({
			title: config.title || L("message_api"),
			layout: 'vertical'
		}, $$.window));
		
		if ($.isBlank(config.inReplyTo)) {
			// TODO: 新規メッセージ作成時のユーザー選択UIを実装する
		}
		
		var textField = Ti.UI.createTextField($.mixin({
			hintText: L("please_input_title"),
			value: config.messageTitle || L('this_is_test')
		}, $$.textField, true));
		
		var textArea = Ti.UI.createTextArea($.mixin({
			value: L('this_is_test')
		}, $$.textArea, true));
		
		var button = Ti.UI.createButton($.mixin({
			title: $.isBlank(config.inReplyTo) ? L('send') : L('reply')
		}, $$.button, true));
		button.addEventListener('click', function(){
			if ($.isBlank(textField.value)) {
				alert(L("please_input_title"));
				return;
			}
			
			if ($.isBlank(textArea.value)) {
				alert(L("please_input_body"));
				return;
			}
			
			var indicator = ex.ui.createFrontIndicator(win, {message: L("sending")});
			indicator.show();
			
			var parameters = {
				title: textField.value,
				body: textArea.value
			};
			
			if ($.isPresent(config.inReplyTo)) {
				parameters.inReplyTo = config.inReplyTo;
			}
			
			mixi.graphApi.messagesSend({
				parameters: parameters,
				success: function(json){
					indicator.hide();
					ex.ui.close(win);
					alert(json);
				},
				error: function(e){
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
})();
