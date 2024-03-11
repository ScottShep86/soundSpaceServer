const { Schema, model } = require('mongoose');

const jobMessageSchema = new Schema(
  {
    job: {
      type: [Schema.Types.ObjectId],
      ref: 'Job',
    },
    createdBy: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
    },
    comment: {
      type: String,
      required: true,
    },
    created: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timesstamps: true,
  }
);

const JobMessage = model('JobMessage', jobMessageSchema);

module.exports = JobMessage;
