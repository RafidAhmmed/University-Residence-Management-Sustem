const mongoose = require('mongoose');

const directoryOptionSchema = new mongoose.Schema(
  {
    kind: {
      type: String,
      enum: ['department', 'hall'],
      required: true,
    },
    sourceId: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    nameBn: {
      type: String,
      default: null,
      trim: true,
    },
    code: {
      type: String,
      default: null,
      trim: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

directoryOptionSchema.index({ kind: 1, sourceId: 1 }, { unique: true });
directoryOptionSchema.index({ kind: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('DirectoryOption', directoryOptionSchema);
