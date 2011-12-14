var isDefined = function(object) {
	return typeof object !== 'undefined';
}

var isPresent = function(object) {
	switch (typeof object) {
		case "undefined":
			return false;
		case "string":
			return object.length > 0
		case "number":
			return true;
		case "boolean":
			return object;
		case "object":
			if (object instanceof Array) {
				return object.length > 0
			} else {
				for(var i in object) return true;
				return false;
			}
	}
}

var isString = function(string) {
	return typeof string === "string";
}

var isNumber = function(number) {
	return typeof number === "number";
}

var isBoolean = function(bool) {
	return typeof bool === "boolean";
}

var isObject = function(object) {
	return typeof object === "object";
}

var isArray = function(object) {
	return typeof object === "[object Array]";
}

var isFunction = function(func) {
	return typeof func === "function";
}

var copy = function(object) {
	switch (typeof object) {
		case 'object':
			var target = {};
			for (var name in object) {
				target[name] = copy(object[name]);
			}
			return target;
		case '[object Array]':
			var target = [];
			for (var i = 0; i < object.length; i++) {
				target.push(copy(object[i]));
			}
			return target;
		default:
			return object;
	}
}

var mixin = function(target) {
	var force = isBoolean(arguments[arguments.length - 1]) ? arguments[arguments.length - 1] : false;
	var length = isBoolean(arguments[arguments.length - 1]) ? arguments.length - 1 : arguments.length;
	
	for (var i = 0; i < length; i++) {
		_mixin(target, arguments[i], force);
	}
	
	return target;
}

var merge = function() {
	var force = isBoolean(arguments[arguments.length - 1]) ? arguments[arguments.length - 1] : false;
	var length = isBoolean(arguments[arguments.length - 1]) ? arguments.length - 1 : arguments.length;
	
	var target = {};
	
	for (var i = 0; i < length; i++) {
		_mixin(target, arguments[i], force);
	}
	
	return target;
}

var locale = function(object) {
	return specify(Ti.Platform.locale, object);
}

var os = function(object) {
	return specify(Ti.Platform.osname, object);
}

var model = function(object) {
	return specify(Ti.Platform.model, object);
}

var display = function(object) {
	var name = String.format("%dx%d",
		Ti.Platform.displayCaps.platformWidth, Ti.Platform.displayCaps.platformHeight);
	return specify(name, object);
}

var iphone = function(proc) {
	return os({iphone: proc});
}

var android = function(proc) {
	return os({android: proc});
}

var specify = function(name, map) {
	if (isDefined(map[name])) {
		return isFunction(map[name]) ? map[name]() : map[name];
	} else if (isDefined(map['default'])) {
		return isFunction(map['default']) ? map['default']() : map['default'];
	} else {
		// nothing
	}
}

var _mixin = function(target, object, force) {
	for(var name in object) {
		var s = object[name];
		if(force || !(name in target)) {
			target[name] = s;
		}
	}
	return target;
}

exports.isDefined = isDefined;
exports.isPresent = isPresent;
exports.isBlank = function(object) { return !isPresent(object) };
exports.isString = isString;
exports.isNumber = isNumber;
exports.isBoolean = isBoolean;
exports.isObject = isObject;
exports.isArray = isArray;
exports.isFunction = isFunction;

exports.copy = copy;
exports.merge = merge;
exports.mixin = mixin;

exports.osEach = os;
exports.iphoneOnly = iphone;
exports.androidOnly = android;
exports.modelEach = model;
exports.displayEach = display;
exports.localeEach = locale;
exports.specify = specify;

exports.osname = Ti.Platform.osname;
exports.locale = Ti.Platform.locale;
exports.model = Ti.Platform.model;
exports.width = Ti.Platform.displayCaps.platformWidth;
exports.height = Ti.Platform.displayCaps.platformHeight;
