var express = require('express');
var router = express.Router();
var controller = require("../controller/controller");

// Home → Login page
router.get('/', controller.loginPage);

// Sign Up page
router.get('/signUp', controller.signUp);

// Signup form submit
router.post('/signupUser', controller.signupUser);

// Login form submit
router.post('/loginUser', controller.loginUser);

// Dashboard
router.get('/dashboard', controller.dashboard);

// Logout
router.get('/logout', controller.logout);

// Switch user via floating bubble
router.post('/switchUser', controller.switchUser);

module.exports = router;
