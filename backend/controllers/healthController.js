const getHealth = (req, res) => {
  res.json({
    success: true,
    message: "EduNexus API is healthy"
  });
};

module.exports = { getHealth };