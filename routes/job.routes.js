const router = require('express').Router();

const Job = require('../models/Job.model');

const { isAuthenticated } = require('../middleware/jwt.middleware');

//POST to create a job
router.post('/', isAuthenticated, async (req, res, next) => {
  const payload = req.body;

  try {
    const newJob = await Job.create({
      ...payload,
      createdBy: req.payload._id,
    });
    res.status(201).json(newJob);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// GET jobs posted by a specific user
router.get('/', isAuthenticated, async (req, res, next) => {
  try {
    const userJobs = await Job.find({ createdBy: req.payload._id });
    res.status(200).json(userJobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
