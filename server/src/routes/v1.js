const router = require('express').Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();

const {
	addAdminToDB,
	findAdminByUsername,
	findAdminById,
	addUserToDB,
	findUserByUsername,
	findUserById,
	addCourseToDB,
	findCourse,
	updateCourseInDB,
} = require('../db');

//! ADMIN Routes

async function signupAdmin(req, res) {
	try {
		const { username, password } = req.headers;
		if (!username || !password) {
			throw new Error('username and password both are required');
		}
		if (await findAdminByUsername(username)) {
			throw new Error('username already exists');
		}
		if (username.length < 8 || password.length < 8) {
			throw new Error(
				'username and password both must be at least 8 characters long'
			);
		}
		await addAdminToDB({ username, password, myCourses: [] });
		res.status(200).json({ message: 'admin created successfully' });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
}

function generateAdminToken(admin) {
	// console.log(`generating token for admin => ${JSON.stringify(admin)}`);
	return jwt.sign(admin, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN || '1min',
	});
}

async function loginAdmin(req, res) {
	try {
		const { username, password } = req.headers;
		if (!username || !password) {
			throw new Error('username and password both are required');
		}
		const existingAdmin = await findAdminByUsername(username);
		if (!existingAdmin) {
			throw new Error('account does not exist, signup first');
		}
		if (existingAdmin.password !== password) {
			throw new Error('password is incorrect');
		}
		// console.log(`account exists, now login-in admin => ${existingAdmin}`);
		const token = generateAdminToken({
			_id: existingAdmin._id,
			username: existingAdmin.username,
			role: 'admin',
		});
		res.status(200).json({ token });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
}

function validateAdminToken(req, res) {
	try {
		const token = req.headers.authorization.split(' ')[1];
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		res.status(200).json({ message: 'valid token' });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
}

function authenticateAdmin(req, res, next) {
	try {
		if(!req.headers.authorization){
			res.status(400).json({message: 'no auth headers'})
		}
		const token = req.headers.authorization.split(' ')[1];
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		// console.log(`decoded token => ${JSON.stringify(decoded)}`);
		if (decoded.role !== 'admin') {
			throw new Error('unauthorized');
		}
		req.admin = decoded;
		next();
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
}

async function addCourse(req, res) {
	try {
		// console.log(`received course => ${JSON.stringify(req.body)}`);
		const { title, description, price } = req.body;
		if (!title || !description || !price) {
			throw new Error('title, description, price all are required');
		}
		admin = await findAdminById(req.admin._id);
		addCourseToDB({ publishedBy: admin, ...req.body });
		res.status(200).json({ message: 'course added successfully' });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
}

async function updateCourse(req, res) {
	try {
		const updatedCourse = await updateCourseInDB(req.params.courseId, {
			...req.body,
			publishedBy: req.admin._id,
		});
		// console.log(`updated course => ${JSON.stringify(updatedCourse)}`);
		if (!updatedCourse) {
			throw new Error('course does not exist');
		}
		res.status(200).json({ message: 'course updated successfully', updatedCourse});
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
}

async function getAllPublishedCourses(req, res) {
	try {
		const courses = await findCourse({ published: true }, true);
		res.status(200).json({ courses });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
}

async function getAdminCourses(req, res) {
	try {
		const courses = await findCourse({ publishedBy: req.admin._id });
		res.status(200).json({ courses });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
}

async function getSpecificCourse(req, res) {
	try {
		const course = await findCourse({ _id: req.params.courseId });
		res.status(200).json({ course: course[0] });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
}

//! ADMIN Routes Handlers

// Route handler for /api/v1/admin/signup
router.post('/admin/signup', (req, res) => {
	console.log(`signin up admin -> ${req.headers.username}`);
	signupAdmin(req, res);
});

// Route handler for /api/v1/admin/login
router.post('/admin/login', (req, res) => {
	console.log(`logging in admin -> ${req.headers.username}`);
	loginAdmin(req, res);
});

// Route to validate token /api/v1/admin/validate
router.post('/admin/validate', (req, res) => {
	validateAdminToken(req, res);
});

router.get('/admin/me', authenticateAdmin, (req, res) => {
	res.status(200).json({ username: req.admin.username });
});

// Route to add course /api/v1/admin/courses
router.post('/admin/courses', authenticateAdmin, (req, res) => {
	console.log(`adding course to DB -> ${req.body.title}`);
	addCourse(req, res);
});

// Route to update course /api/v1/admin/course/:courseId
router.put('/admin/course/:courseId', authenticateAdmin, (req, res) => {
	console.log(`updating courseId -> ${req.params.courseId}`);
	updateCourse(req, res);
});

// Route to get all courses /api/v1/admin/courses
router.get('/admin/courses', authenticateAdmin, (req, res) => {
	console.log(`getting all published courses ->`);
	getAllPublishedCourses(req, res);
});

// Router to get specific course /api/v1/admin/course/:courseId
router.get('/admin/course/:courseId', authenticateAdmin, (req, res) => {
	console.log(`getting courseId -> ${req.params.courseId}`);
	getSpecificCourse(req, res);
});

// Route to get all admin myCourses /api/v1/admin/courses
router.get('/admin/my-courses', authenticateAdmin, (req, res) => {
	console.log(`getting specific admin's course -> ${req.admin.username}`);
	getAdminCourses(req, res);
});

//! USER Routes Functions

async function signupUser(req, res) {
	try {
		const { username, password } = req.headers;
		if (!username || !password) {
			throw new Error('username and password both are required');
		}
		if (await findUserByUsername(username)) {
			throw new Error('username already exists');
		}
		if (username.length < 8 || password.length < 8) {
			throw new Error(
				'username and password both must be at least 8 characters long'
			);
		}
		await addUserToDB({ username, password, purchasedCourses: [] });
		res.status(200).json({ message: 'user created successfully' });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
}

function generateUserToken(user) {
	// console.log(`generating token for user => ${JSON.stringify(user)}`);
	return jwt.sign(user, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN || '1min',
	});
}

async function loginUser(req, res) {
	try {
		const { username, password } = req.headers;
		if (!username || !password) {
			throw new Error('username and password both are required');
		}
		const existingUser = await findUserByUsername(username);
		if (!existingUser) {
			throw new Error('account does not exist, signup first');
		}
		if (existingUser.password !== password) {
			throw new Error('password is incorrect');
		}
		// console.log(`account exists, now login-in user => ${existingUser}`);
		const token = generateUserToken({
			_id: existingUser._id,
			role: 'user',
		});
		res.status(200).json({ token });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
}

async function authenticateUser(req, res, next) {
	try {
		const token = req.headers.authorization.split(' ')[1];
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		// console.log(`decoded token => ${JSON.stringify(decoded)}`);
		if (decoded.role !== 'user') {
			throw new Error('unauthorized');
		}
		req.user = decoded;
		next();
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
}

async function purchaseCourse(req, res) {
	try {
		const course = (await findCourse({ _id: req.params.courseId }))[0];
		if (!course) {
			throw new Error('course does not exist');
		}
		const user = await findUserById(req.user._id);
		if (user.purchasedCourses.includes(course._id)) {
			throw new Error('course already purchased');
		}
		user.purchasedCourses.push(course._id);
		await user.save();
		res.status(200).json({ message: 'course purchased successfully' });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
}

async function getUserPurchasedCourses(req, res) {
	try {
		const user = await findUserById(req.user._id, true);
		const purchasedCoursesId = user.purchasedCourses;
		res.status(200).json({ purchasedCoursesId });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
}

//! USER Routes Handlers

// Route handler for /api/v1/user/signup
router.post('/user/signup', (req, res) => {
	signupUser(req, res);
});

// Route handler for /api/v1/user/login
router.post('/user/login', (req, res) => {
	loginUser(req, res);
});

// Route to get all courses /api/v1/user/courses
router.get('/user/courses', authenticateUser, (req, res) => {
	getAllPublishedCourses(req, res);
});

// Route to purchase a course /api/v1/user/courses
router.post('/user/courses/:courseId', authenticateUser, (req, res) => {
	purchaseCourse(req, res);
});

// Route to get all purchased courses /api/v1/user/my-courses
router.get('/user/my-courses', authenticateUser, (req, res) => {
	getUserPurchasedCourses(req, res);
});

module.exports = router;
