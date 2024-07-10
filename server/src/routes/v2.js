const router = require('express').Router();

// Route handler for /api/v2/admin
router.get('/admin', (req, res) => {
	res.status(200).json({ apiVersion: 2, message: 'admin endpoint' });
});

// Route handler for /api/v2/user
router.get('/user', (req, res) => {
	res.status(200).json({ apiVersion: 2, message: 'user endpoint' });
});

module.exports = router;
