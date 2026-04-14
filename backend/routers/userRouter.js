const express = require('express');
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

const router = express.Router();

// Routes
router.get('/', auth, userController.getAllUsers);
router.get('/:id', auth, userController.getUser);
router.put('/:id', auth, userController.updateUser);
router.put('/:id/profile', auth, userController.uploadProfilePicture, userController.updateUserProfile);
router.delete('/:id', auth, userController.deleteUser);

module.exports = router;