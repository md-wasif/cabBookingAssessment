const jwt = require('jsonwebtoken');


module.exports = {
    jwtEncode: (auth) => {
		//console.log("token generate")
		var token = jwt.sign({ id: auth }, process.env.JWT_SECRET, {})
		return token;
	}
}