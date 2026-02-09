const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const officeSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    manager: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
officeSchema.plugin(toJSON);
officeSchema.plugin(paginate);

const Office = mongoose.model('Office', officeSchema);

module.exports = Office;
