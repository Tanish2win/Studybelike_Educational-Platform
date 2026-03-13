const express = require('express');
const router = express.Router();
const Article = require('../models/Article');

// Get all articles
router.get('/', async (req, res) => {
  try {
    const { subject, search } = req.query;
    let query = {};
    
    if (subject) {
      query.subject = subject;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } }
      ];
    }
    
    const articles = await Article.find(query).sort({ created_at: -1 });
    res.json(articles);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get article by slug
router.get('/slug/:slug', async (req, res) => {
  try {
    const article = await Article.findOne({ slug: req.params.slug });
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    res.json(article);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get article by ID
router.get('/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    res.json(article);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create article (admin only)
router.post('/', async (req, res) => {
  try {
    const { title, slug, subject, content, author } = req.body;
    
    const newArticle = new Article({
      title,
      slug,
      subject,
      content,
      author
    });
    
    const article = await newArticle.save();
    res.json(article);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update article (admin only)
router.put('/:id', async (req, res) => {
  try {
    const { title, slug, subject, content, author } = req.body;
    
    let article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    
    article = await Article.findByIdAndUpdate(
      req.params.id,
      { title, slug, subject, content, author },
      { new: true }
    );
    
    res.json(article);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete article (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    
    await Article.findByIdAndDelete(req.params.id);
    res.json({ message: 'Article removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add comment to article
router.post('/:id/comments', async (req, res) => {
  try {
    const { user, text } = req.body;
    
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    
    article.comments.push({ user, text });
    await article.save();
    
    res.json(article.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get related articles
router.get('/related/:subject', async (req, res) => {
  try {
    const articles = await Article.find({ 
      subject: req.params.subject 
    }).limit(5);
    res.json(articles);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

