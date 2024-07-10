/* eslint-disable */
const mongoose = require('mongoose');

MONGODB_URL = process.env.MONGODB_URL;
MONGODB_DB_NAME = process.env.MONGODB_DB_NAME;
MONGODB_USER = process.env.MONGODB_USER;
MONGODB_PASSWORD = process.env.MONGODB_PASSWORD;

async function connectToDB() {
	await mongoose.connect(MONGODB_URL, {
		dbName: MONGODB_DB_NAME,
		user: MONGODB_USER,
		pass: MONGODB_PASSWORD,
		retryWrites: true,
		w: 'majority',
	});
	console.log('Connected to MonogoDB');
}

USERS_COLLECTION = process.env.USERS_COLLECTION;
ADMINS_COLLECTION = process.env.ADMINS_COLLECTION;
COURSES_COLLECTION = process.env.COURSES_COLLECTION;

const adminSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
			minlength: 8,
			index: true,
		},
		password: {
			type: String,
			required: true,
			minlength: 8,
		},
		myCourses: {
			type: [
				{
					type: mongoose.Schema.Types.ObjectId,
					ref: COURSES_COLLECTION,
				},
			],
			//! Do not add => default: [],
		},
		createdAt: {
			type: Date,
			default: Date.now,
		},
	},
	{ versionKey: false }
);

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
			minlength: 8,
			index: true,
		},
		password: {
			type: String,
			required: true,
			minlength: 8,
		},
		purchasedCourses: {
			type: [
				{
					type: mongoose.Schema.Types.ObjectId,
					ref: COURSES_COLLECTION,
				},
			],
			//! Do not add => default: [],
		},
		createdAt: {
			type: Date,
			default: Date.now,
		},
	},
	{ versionKey: false }
);

const courseSchema = new mongoose.Schema(
	{
		publishedBy: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: ADMINS_COLLECTION,
			//! index: true,
		},
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
		thumbnailUrl: {
			type: String,
			default: '',
		},
		published: {
			type: Boolean,
			default: false,
			index: true,
		},
		createdAt: {
			type: Date,
			default: Date.now,
			immutable: true,
		},
		updatedAt: {
			type: Date,
			default: Date.now,
		},
	},
	{ versionKey: false }
);

const Admin = mongoose.model(ADMINS_COLLECTION, adminSchema);
const User = mongoose.model(USERS_COLLECTION, userSchema);
const Course = mongoose.model(COURSES_COLLECTION, courseSchema);

//! ADMIN DB Functions

async function addAdminToDB(admin) {
	try {
		const newAdmin = new Admin(admin);
		await newAdmin.save();
	} catch (err) {
		console.log(err.message);
	}
}

async function findAdminByUsername(username) {
	try {
		return await Admin.findOne({ username });
	} catch (err) {
		console;
	}
}

async function findAdminById(id) {
	try {
		return await Admin.findById(id);
	} catch (err) {
		console.log(err.message);
	}
}

async function updateAdminNewCourse(newCourseId) {
	try {
		admin.myCourses.push(newCourseId);
		await admin.save();
	} catch (err) {
		console.log(err.message);
	}
}

//! USER DB Functions

async function addUserToDB(user) {
	try {
		const newUser = new User(user);
		await newUser.save();
	} catch (err) {
		console.log(err.message);
	}
}

async function findUserByUsername(username) {
	try {
		return await User.findOne({ username });
	} catch (err) {
		console.log(err.message);
	}
}

async function findUserById(id, usePopulate = false) {
	try {
		if (usePopulate) {
			return await User.findById(id).populate('purchasedCourses');
		} else {
			return await User.findById(id);
		}
	} catch (err) {
		console.log(err.message);
	}
}

//! COURSE DB Functions

async function addCourseToDB(course) {
	try {
		const newCourse = new Course(course);
		await newCourse.save();
		updateAdminNewCourse(newCourse._id);
	} catch (err) {
		console.log(err.message);
	}
}

async function findCourseById(id) {
	try {
		return await Course.findById(id);
	} catch (err) {
		console.log(err.message);
	}
}

async function findCourse(query, usePopulate = false) {
	try {
		if (usePopulate) {
			return await Course.find(query).populate('publishedBy');
		} else {
			return await Course.find(query);
		}
	} catch (err) {
		console.log(err.message);
	}
}

async function updateCourseInDB(courseId, updatedCourse) {
	try {
		updatedCourse.updatedAt = Date.now();
		return await Course.findByIdAndUpdate(courseId, updatedCourse, {
			new: true,
		});
	} catch (err) {
		console.log(err.message);
	}
}

module.exports = {
	connectToDB,
	addAdminToDB,
	findAdminByUsername,
	findAdminById,
	addUserToDB,
	findUserByUsername,
	findUserById,
	addCourseToDB,
	findCourse,
	updateCourseInDB,
};
