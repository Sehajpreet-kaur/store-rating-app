const sequelize = require("../config/database");
const User = require("./User");
const Store = require("./Store");
const Rating = require("./Rating");

//Associations

// A Store owner (User) owns exactly one Store; a store belongs to one owner.
User.hasOne(Store, { foreignKey: "ownerId", as: "ownedStore" });
Store.belongsTo(User, { foreignKey: "ownerId", as: "owner" });

// A User can submit many Ratings; a Rating belongs to one User.
User.hasMany(Rating, { foreignKey: "userId", as: "ratings" });
Rating.belongsTo(User, { foreignKey: "userId", as: "user" });

//A Store can have many Ratings; a Rating belongs to one Store.
Store.hasMany(Rating, { foreignKey: "storeId", as: "ratings" });
Rating.belongsTo(Store, { foreignKey: "storeId", as: "store" });

module.exports = {  
    sequelize,
    User,
    Store,
    Rating,
};
