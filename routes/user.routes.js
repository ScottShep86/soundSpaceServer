const { isAuthenticated } = require('../middleware/jwt.middleware');
const User = require('../models/User.model');

const router = require('express').Router();

router.get('/users/:id', isAuthenticated, async (req, res, next) => {
  try {
    const response = await User.findById(req.params._id);
    res.send({ data: response });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
