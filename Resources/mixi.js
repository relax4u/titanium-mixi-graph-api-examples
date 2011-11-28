var GraphApi = function(params) {
	this.consumerKey = params.consumerKey;
	this.consumerSecret = params.consumerSecret;
	this.scope = params.scope;
	this.redirectUrl = params.redirectUrl || "http://mixi.jp/connect_authorize_success.html";
	this.expiresAt = (new Date(0)).getTime();
	this.accessToken = null;
	this.refreshToken = _loadRefreshToken(this.scope);
	this.autoAuthorize = isDefined(params.autoAuthorize) ? params.autoAuthorize : true;
	this.timeout = params.timeout || 30 * 1000;
	
	var self = this;
	
	this.authorize = function(config) {
		if (!self.isAuthorized()) {
			self.createAuthorizeWindow(config);
		} else {
			Ti.API.info(String.format("[mixi] already authorized. scope is '%s'", self.scope.join(" ")));
		}
	};
	
	this.logout = function(){
		_clearRefreshToken();
		self.expiresAt = (new Date(0)).getTime();
		self.accessToken = null;
		self.refreshToken = null;
	};
	
	this.isAuthorized = function(){
		return isDefined(self.refreshToken);
	};
	
	this.people = function(config) {
		config = mixin({
			userId: "@me",
			groupId: "@self"
		}, config, true);
		
		var url = String.format("http://api.mixi-platform.com/2/people/%s/%s", config.userId, config.groupId);
		self.callApi("GET", url, config);
	};
	
	this.groups = function(config) {
		config = mixin({
			userId: "@me"
		}, config, true);
		
		var url = String.format("http://api.mixi-platform.com/2/groups/%s", config.userId);
		self.callApi("GET", url, config);
	};
	
	this.voiceStatusesUserTimeline = function(config) {
		var url = "http://api.mixi-platform.com/2/voice/statuses/@me/user_timeline";
		self.callApi("GET", url, config);
	};
	
	this.voiceStatusesFriendTimeline = function(config) {
		config = mixin({groupId: ""}, config, true);
		var url = String.format("http://api.mixi-platform.com/2/voice/statuses/friends_timeline/%s", config.groupId);
		self.callApi("GET", url, config);
	};
	
	this.voiceStatuses = function(config) {
		var url = String.format("http://api.mixi-platform.com/2/voice/statuses/%s", config.postId);
		self.callApi("GET", url, config);
	};
	
	this.voiceReplies = function(config) {
		var url = String.format("http://api.mixi-platform.com/2/voice/replies/%s", config.postId);
		self.callApi("GET", url, config);
	};
	
	this.voiceFavorites = function(config) {
		var url = String.format("http://api.mixi-platform.com/2/voice/favorites/%s", config.postId);
		self.callApi("GET", url, config);
	};
	
	this.voiceStatusesUpdate = function(config) {
		var url = "http://api.mixi-platform.com/2/voice/statuses";
		self.callApi("POST", url, config);
	};
	
	this.voiceStatusesDestroy = function(config) {
		var url = String.format("http://api.mixi-platform.com/2/voice/statuses/%s", config.postId);
		self.callApi("DELETE", url, config);
	};
	
	this.voiceRepliesCreate = function(config) {
		var url = String.format("http://api.mixi-platform.com/2/voice/replies/%s", config.postId);
		self.callApi("POST", url, config);
	};
	
	this.voiceRepliesDestroy = function(config) {
		var url = String.format("http://api.mixi-platform.com/2/voice/replies/%s/%s", config.postId, config.commentId);
		self.callApi("DELETE", url, config);
	};
	
	this.voiceFavoritesCreate = function(config) {
		var url = String.format("http://api.mixi-platform.com/2/voice/favorites/%s", config.postId);
		self.callApi("POST", url, config);
	};
	
	this.voiceFacoritesDestroy = function(config) {
		var url = String.format("http://api.mixi-platform.com/2/voice/favorites/%s/%s", config.postId, config.userId);
		self.callApi("DELETE", url, config);
	};
	
	this.callApi = function(method, url, config) {
		config = mixin({
			autoAuthorize: self.autoAuthorize,
			method: "GET",
		}, config || {}, true);
		
		if (isDefined(self.refreshToken)) {
			if (self.expiresAt < (new Date).getTime()) {
				_refreshAccessToken({
					success: function(){
						self.callApi(method, url, config);
					},
					error: function(){
						tryCall(config.error);
					}
				})
			} else {
				_callApi(method, url, config);
			}
		} else {
			if (config.autoAuthorize) {
				self.createAuthorizeWindow({
					success: function(){
						self.callApi(method, url, config);
					},
					error: function(){
						tryCall(config.error);
					}
				});
			} else {
				tryCall(config.error);
			}
		}
	};
	
	this.createAuthorizeWindow = function(config) {
		var win = Ti.UI.createWindow();
		
		var web = Ti.UI.createWebView({
			url: _addQueryString("https://mixi.jp/connect_authorize.pl", {
				client_id: self.consumerKey,
				response_type: "code",
				display: "smartphone",
				scope: self.scope.join(" ")
			})
		});
		
		web.addEventListener('load', function(e){
			if(!e.url.match(self.redirectUrl)) return;
			_getAccessToken({
				code: _gup(e.url, "code"),
				success: function(){
					win.close();
					tryCall(config.success);
				},
				error: function(){
					win.close();
					tryCall(config.error);
				}
			});
		});
		
		if (Ti.Platform.osname != "android") {
			var button = Ti.UI.createButton({
				systemButton: Ti.UI.iPhone.SystemButton.CANCEL
			});
			button.addEventListener('click', function(){
				win.close();
			});
			win.rightNavButton = button;
		}
		win.add(web);
		
		win.open({modal: true});
	};
	
	var _gup = function(url, name){
		var results = (new RegExp(String.format("[\\?&]%s=([^&#]*)", name))).exec(url);
		if (isDefined(results)) {
			return results[1];
		} else {
			return "";
		}
	};
	
	function _addQueryString(url, params) {
		params = params || {};
		
		var parameters = [];
		for (var name in params) {
			parameters.push(String.format("%s=%s", name, Ti.Network.encodeURIComponent(params[name])));
		}
		
		if (parameters.length > 0) {
			url += "?" + parameters.join("&");
		}
		
		return url;
	};
	
	function _getToken(config) {
		var requestTime = (new Date).getTime();
		
		var xhr = Ti.Network.createHTTPClient();
		
		xhr.setTimeout(self.timeout);
		
		xhr.onload = function(){
			var response = JSON.parse(this.responseText);
			
			if (xhr.status != 200) {
				var error = _authenticateHeader(xhr);
				
				if (isDefined(response.error) && response.error == "invalid_grant" && config.autoAuthorize) {
					self.createAuthorizeWindow(config);
				} else {
					Ti.API.warn("[mixi] getting access token failed. " + error);
					tryCall(config.error, error);
				}
			}
			
			Ti.API.debug("[mixi] getting access token succeeded. " + this.responseText);
			
			self.accessToken = response.access_token;
			self.refreshToken = _saveRefreshToken(response.refresh_token, response.scope);
			self.expiresAt = requestTime + response.expires_in * 1000 * 0.9;  // 念のため再取得時間を短めに設定する
			
			tryCall(config.success);
		};
		
		xhr.onerror = function(event){
			Ti.API.error("[mixi] getting access token failed " + event);
			tryCall(config.error, event);
		};
		
		xhr.open("POST", "https://secure.mixi-platform.com/2/token");
		xhr.send(config.parameters);
	};
	
	function _refreshAccessToken(config) {
		_getToken(mixin({
			parameters: {
				grant_type: "refresh_token",
				client_id: self.consumerKey,
				client_secret: self.consumerSecret,
				refresh_token: self.refreshToken
			}
		}, config));
	};
	
	function _getAccessToken(config) {
		_getToken(mixin({
			parameters: {
				grant_type: "authorization_code",
				client_id: self.consumerKey,
				client_secret: self.consumerSecret,
				code: config.code,
				redirect_uri: self.redirectUrl
			}
		}, config));
	};
	
	function _saveRefreshToken(token, scope) {
		Ti.App.Properties.setString("mixiGraphApi:refreshToken", token);
		Ti.App.Properties.setString("mixiGraphApi:scope", scope);
		return token;
	};
	
	function _loadRefreshToken(scope) {
		var availableScope = Ti.App.Properties.getString("mixiGraphApi:scope", "").split(" ");
		
		if (scope.length != availableScope.length) return null;
		for (var i = 0; i < scope.length; i++) {
			if (availableScope.indexOf(scope[i]) < 0) return null;
		}
		
		return Ti.App.Properties.getString("mixiGraphApi:refreshToken", null);
	};
	
	function _clearRefreshToken() {
		Ti.App.Properties.removeProperty("mixiGraphApi:refreshToken");
		Ti.App.Properties.removeProperty("mixiGraphApi:scope");
		return null;
	};
	
	function checkScope(availableScope){
		return self.scopes.indexOf(availableScope) >= 0;
	};
	
	function _callApi(method, url, config) {
		var xhr = Ti.Network.createHTTPClient();
		
		xhr.setTimeout(self.timeout);
		
		xhr.onload = function(){
			if (xhr.status != 200 && xhr.status != 201) {
				var error = _authenticateHeader(xhr);
				Ti.API.warn(String.format("[mixi] calling api failed. (%s)", error));
				tryCall(config.error, error);
				return;
			};
			
			var response = JSON.parse(this.responseText);
			Ti.API.debug(String.format("[mixi] calling api succeeded. (%s)", response));
			tryCall(config.success, response);
		};
		
		xhr.onerror = function(e){
			Ti.API.error(String.format("[mixi] calling api failed. (%d - %s)", xhr.status, e));
			tryCall(config.error, e);
		};
		
		if (method.match(/GET/i)) {
			url = _addQueryString(url, config.parameters);
		}
		
		xhr.open(method, url);
		xhr.setRequestHeader("Authorization", "OAuth " + self.accessToken);
		
		if (method.match(/GET/i)) {
			Ti.API.debug(String.format("[mixi] calling api (%s %s)", method, url));
			xhr.send();
		} else {
			Ti.API.debug(String.format("[mixi] calling api (%s %s %s)", method, url, isDefined(config.parameters) ? config.parameters : ""));
			xhr.send(config.parameters);
		}
	};
	
	function _authenticateHeader(xhr) {
		var options = {status: xhr.status};
		
		var content = xhr.getResponseHeader("WWW-Authenticate");
		if (isDefined(content)) {
			var parameters = content.replace("OAuth ", "").split(",");
			for (var i = 0; i < parameters.length; i++) {
				if (parameters[i].match(/(.+)="(.*)"/)) {
					options[RegExp.$1] = RegExp.$2;
				}
			}
		}
		
		return options;
	};
};


function isDefined(object) {
	return typeof object !== "undefined" && object != null;
}

function isFunction(proc) {
	return typeof proc === "function"
}

function tryCall(proc, args) {
	if (isFunction(proc)) proc(args);
}

function mixin(target, object, force) {
	if (!isDefined(object)) return target;
	
	for(var name in object) {
		var s = object[name];
		if(force || !(name in target)) {
			target[name] = s;
		}
	}
	return target;
}


exports.GraphApi = GraphApi;
