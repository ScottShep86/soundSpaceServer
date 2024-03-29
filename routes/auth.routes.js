const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const { isAuthenticated } = require('../middleware/jwt.middleware.js');

const saltRounds = 13;

// POST to register a new user
router.post('/register', (req, res, next) => {
  const { firstName, lastName, email, password, picture, location } = req.body;

  if (!firstName || !lastName || !email || !password) {
    res
      .status(400)
      .json({ message: 'Provide first name, last name, email, and password' });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: 'Provide a valid email address.' });
    return;
  }

  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!passwordRegex.test(password)) {
    res.status(400).json({
      message:
        'Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.',
    });
    return;
  }

  User.findOne({ email })
    .then(foundUser => {
      if (foundUser) {
        res.status(400).json({ message: 'User already exists.' });
        return;
      }

      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);

      return User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        picture,
        location,
      });
    })
    .then(createdUser => {
      const { firstName, lastName, email, picture, location, _id } =
        createdUser;
      const user = { firstName, lastName, email, picture, location, _id };
      res.status(201).json({ user: user });
    })
    .catch(err => next(err));
});

// POST to login to an account
router.post('/login', (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: 'Provide email and password.' });
    return;
  }

  User.findOne({ email })
    .then(foundUser => {
      if (!foundUser) {
        res.status(401).json({ message: 'User not found.' });
        return;
      }

      const passwordCorrect = bcrypt.compareSync(password, foundUser.password);

      if (passwordCorrect) {
        const { _id, firstName, lastName, email, picture, location } =
          foundUser;
        const payload = { _id, firstName, lastName, email, picture, location };
        const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
          algorithm: 'HS256',
          expiresIn: '6h',
        });
        res.status(200).json({ authToken: authToken });
      } else {
        res.status(401).json({ message: 'Email or Password is incorrect' });
      }
    })
    .catch(err => next(err));
});

// GET to verify the account
router.get('/verify', isAuthenticated, (req, res, next) => {
  res.status(200).json(req.payload);
});

// GET the user profile
router.get('/profile/:id', isAuthenticated, async (req, res, next) => {
  try {
    const { id } = req.params;
    const response = await User.findById(id);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
