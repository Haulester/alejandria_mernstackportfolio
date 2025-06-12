const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  content: [
    {
      heading: { type: String },
      paragraph: { type: String }
    }
  ],
  category: { type: String, required: true },
  author: { type: String, required: true },
  status: { type: String, enum: ['Draft', 'Published'], default: 'Draft' },
  views: { type: Number, default: 0 },
  name: { type: String, unique: true }
}, {
  timestamps: true
});

// Automatically generate `name` from title before saving
articleSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.name = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  }
  next();
});

module.exports = mongoose.model('Article', articleSchema);
