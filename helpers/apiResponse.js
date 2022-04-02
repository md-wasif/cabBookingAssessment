const statusCode = require('../config/config').statusCode;
const statusMessage = require('../config/config').statusMessage;

exports.successResponse = function (res, msg) {
	var data = {
		status: statusCode.EVERYTHING_IS_OK,
		message: msg
	};
	return res.status(statusCode.EVERYTHING_IS_OK).json(data);
};

exports.successResponseWithData = function (res, msg, data) {
	var resData = {
		status: statusCode.EVERYTHING_IS_OK,
		message: msg,
		data: data
	};
	return res.status(statusCode.EVERYTHING_IS_OK).json(resData);
};


exports.ErrorResponse = function (res, msg) {
	var data = {
		status: statusCode.SOMETHING_WENT_WRONG,
		message: msg,
	};
	return res.status(statusCode.SOMETHING_WENT_WRONG).json(data);
};
exports.ErrorResponseWithData = function (res, msg, data) {
	var data = {
		status: statusCode.SOMETHING_WENT_WRONG,
		message: msg,
		data:data
    }
};