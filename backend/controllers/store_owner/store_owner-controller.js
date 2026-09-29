const { sequelize, Store, Rating, User } = require("../../models");

// GET /api/owner/dashboard
// Store owner sees: their store, its average rating, and who rated it.
const getDashboard = async (req, res) => {
  try {
    const store = await Store.findOne({
      where: { ownerId: req.user.id },
      attributes: ["id", "name", "email", "address"],
    });

    if (!store) {
      return res.status(200).json({
        success: true,
        store: null,
        averageRating: null,
        totalRatings: 0,
        ratings: [],
        message: "No store is assigned to your account yet.",
      });
    }

    const ratings = await Rating.findAll({
      where: { storeId: store.id },
      attributes: ["id", "value", "createdAt", "updatedAt"],
      include: [{ model: User, as: "user", attributes: ["id", "name", "email", "address"] }],
      order: [["updatedAt", "DESC"]],
    });

    const stats = await Rating.findOne({
      where: { storeId: store.id },
      attributes: [[sequelize.fn("AVG", sequelize.col("value")), "averageRating"]],
      raw: true,
    });

    return res.status(200).json({
      success: true,
      store,
      averageRating: stats?.averageRating ? Math.round(parseFloat(stats.averageRating) * 10) / 10 : null,
      totalRatings: ratings.length,
      ratings,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success: false, message: "Some error occurred" });
  }
};

module.exports = { getDashboard };
