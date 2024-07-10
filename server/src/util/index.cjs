
function generateRandomString(length) {
	return Math.random()
		.toString(36)
		.substring(2, length + 2);
}

function generateUniqueID() {
	return Math.floor(Date.now() / 1000) + generateRandomString(4);
}

module.exports = generateUniqueID;