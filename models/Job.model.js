const { Schema, model } = require('mongoose');

const jobSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    location: {
      type: String,
      required: false,
    },
    jobType: {
      type: String,
      enum: ['Studio', 'Live'],
      required: true,
    },
    jobRole: {
      type: String,
      enum: [
        'Producer',
        'Mixing Engineer',
        'Mastering Engineer',
        'Songwriter',
        'Beatmaker',
        'Musician',
        'Sound Technician',
        'Light Technician',
        'Stage Manager',
        'Production Manager',
        'Road Crew',
      ],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Job = model('Job', jobSchema);

module.exports = Job;
