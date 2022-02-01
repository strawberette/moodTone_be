const router = require("express").Router();
const Track = require("../models/track");
const passport = require("passport");
const session = { session: false };

// Add a track to the database:
router.post("/:id", passport.authenticate("jwt", session), async (req, res) => {
  await Track.create({
    trackId: req.body.trackId,
    UserId: req.params.id,
  });
  res.status(201).json({
    trackId: req.body.trackId,
    UserId: req.body.userId,
  });
});

// Get all tracks from the User profile:
router.get("/:id", passport.authenticate("jwt", session), async (req, res) => {
  const track = await Track.findAll({ where: { UserId: req.params.id } });
  res.status(200).json({ track });
});

// Delete a track from the database:
router.delete(
  "/:userId/:trackId",
  passport.authenticate("jwt", session),
  async (req, res) => {
    const track = await Track.findOne({
      where: { UserId: req.params.userId, trackId: req.params.trackId },
    });
    const deletedTrack = await track.destroy();
    console.log(deletedTrack);
    res.status(200).json({ deletedTrack });
  }
);

module.exports = router;
