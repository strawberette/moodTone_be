const router = require("express").Router();
const Mood = require("../models/mood");

// Get all moods
router.get("/", async (req, res) => {
  const mood = await Mood.findAll();
  res.status(200).json({ mood });
});

// Get a single mood
router.get("/:id", async (req, res) => {
  const mood = await Mood.findOne({ where: { moodId: req.params.id } });
  res.status(200).json({ mood });
});

module.exports = router;
