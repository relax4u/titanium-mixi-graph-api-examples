function _logging(type) {
	return function(){
		if (arguments.length > 1) {
			arguments.callee(String.format.apply(String, arguments));
		} else {
			Ti.API.log(type, arguments[0]);
		}
	}
}

exports.log = _logging("debug");
exports.debug = _logging("debug");
exports.info = _logging("info");
exports.warn = _logging("warn");
exports.error = _logging("error");
