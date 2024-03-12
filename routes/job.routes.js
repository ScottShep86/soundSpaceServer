const router = require('express').Router();

const Job = require('../models/Job.model');
const JobMessage = require('../models/JobMessage');

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

// GET all jobs
router.get('/all', async (req, res) => {
  const { search } = req.query;
  try {
    let filter = {};
    if (search) {
      filter = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { location: { $regex: search, $options: 'i' } },
        ],
      };
    }
    const allJobs = await Job.find(filter);
    res.status(200).json(allJobs);
  } catch (error) {
    console.error(error);
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

// GET one job
router.get('/:id', isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const response = await Job.findById(id);
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// DELETE a job by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Delete the job
    await Job.findByIdAndDelete(id);

    // Delete job messages associated with the job
    await JobMessage.deleteMany({ job: id });

    res.sendStatus(204); // No content - successful deletion
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
