const { Op } = require("sequelize");
const { sequelize, Store, Rating } = require("../../models");

const round1 = (v) => (v === null || v === undefined ? null : Math.round(parseFloat(v) * 10) / 10);

// GET /api/user/stores?name=&address=&sortBy=&sortOrder=
// Every store with: overall rating, this user's own rating (null if none).
const getStores = async (req, res) => {
  const { name, address, sortBy = "name", sortOrder = "ASC" } = req.query;
  const userId = Number(req.user.id); // Number() makes the literal below injection-safe

  const where = {};
  if (name) where.name = { [Op.like]: `%${name}%` };
  if (address) where.address = { [Op.like]: `%${address}%` };

  const allowedSortFields = ["name", "address", "averageRating"];
  const orderField = allowedSortFields.includes(sortBy) ? sortBy : "name";
  const orderDirection = String(sortOrder).toUpperCase() === "DESC" ? "DESC" : "ASC";

  try {
    const stores = await Store.findAll({
      where,
      attributes: [
        "id",
        "name",
        "address",
        [sequelize.literal("(SELECT AVG(value) FROM ratings WHERE ratings.store_id = Store.id)"), "averageRating"],
        [sequelize.literal("(SELECT COUNT(*) FROM ratings WHERE ratings.store_id = Store.id)"), "ratingCount"],
        [
          sequelize.literal(
            `(SELECT value FROM ratings WHERE ratings.store_id = Store.id AND ratings.user_id = ${userId})`
          ),
          "userRating",
        ],
      ],
      order: [[orderField === "averageRating" ? sequelize.literal("averageRating") : orderField, orderDirection]],
    });

    const data = stores.map((s) => {
      const j = s.toJSON();
      return {
        id: j.id,
        name: j.name,
        address: j.address,
        averageRating: round1(j.averageRating),
        ratingCount: Number(j.ratingCount) || 0,
        userRating: j.userRating === null ? null : Number(j.userRating),
      };
    });

    return res.status(200).json({ success: true, stores: data });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success: false, message: "Some error occurred" });
  }
};

// POST /api/user/stores/:storeId/rating  { value }
// Creates the rating, or updates it if this user already rated the store.
// (One row per user+store is enforced by the unique index on the Rating model.)
const submitRating = async (req, res) => {
  const storeId = Number(req.params.storeId);
  const userId = req.user.id;
  const value = Number(req.body.value);

  try {
    const store = await Store.findByPk(storeId);
    if (!store) {
      return res.status(404).json({ success: false, message: "Store not found." });
    }

    let rating = await Rating.findOne({ where: { userId, storeId } });
    let created = false;
    if (rating) {
      rating.value = value;
      await rating.save();
    } else {
      rating = await Rating.create({ userId, storeId, value });
      created = true;
    }

    const stats = await Rating.findOne({
      where: { storeId },
      attributes: [
        [sequelize.fn("AVG", sequelize.col("value")), "averageRating"],
        [sequelize.fn("COUNT", sequelize.col("id")), "ratingCount"],
      ],
      raw: true,
    });

    return res.status(created ? 201 : 200).json({
      success: true,
      message: created ? "Rating submitted." : "Rating updated.",
      storeId,
      userRating: rating.value,
      averageRating: round1(stats.averageRating),
      ratingCount: Number(stats.ratingCount) || 0,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success: false, message: "Some error occurred" });
  }
};

module.exports = { getStores, submitRating };
