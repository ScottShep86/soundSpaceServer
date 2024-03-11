const router = require('express').Router();

const JobMessage = require('../models/JobMessage');

const { isAuthenticated } = require('../middleware/jwt.middleware');

//GET all the message from a specific job
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const messagesFromJob = await JobMessage.find({ job: id });
    res.status(200).json(messagesFromJob);
  } catch (error) {
    console.error(error);
  }
});

// POST a new message
router.post('/', isAuthenticated, async (req, res) => {
  const { jobId, createdBy, ...payload } = req.body;

  try {
    const newMessage = await JobMessage.create({
      ...payload,
      job: jobId,
      createdBy: createdBy,
    });
    res.status(201).json(newMessage);
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
