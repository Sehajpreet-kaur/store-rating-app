const { Op }= require("sequelize");
const { sequelize, User, Store, Rating}=require("../../models")

// Dashboard: total counts
const getDashboardStats = async(req,res)=>{
    try{
        const [totalUsers, totalStores, totalRatings] = await Promise.all([
            User.count(),
            Store.count(),
            Rating.count()
        ]);

        return res.status(200).json({
            success:true, stats:{ totalUsers, totalStores, totalRatings}
        })
    }catch(e){
        console.log(e)
        return res.status(500).json({
            success:false, message: "Some error occured"
        })
    }
}

// Create a new user (Normal,Admin, or Store Onwer)
const createUser= async(req,res)=>{
    const {name, email, password, address, role}=req.body;

    try{
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
        return res.status(400).json({
            success: false,
            message: "A user already exists with this email.",
        });
        }

        const newUser = await User.create({
            name,
            email,
            password,
            address,
            role:role || "normal"
        })
       return res.status(201).json({
        success: true,
        message: "User created successfully.",
        user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            address: newUser.address,
            role: newUser.role,
        },
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ success: false, message: "Some error occurred" });
  }
};

// ---- Create a new store ----
    const createStore = async (req, res) => {
    const { name, email, address, ownerId } = req.body;
    
    try {
        const existingStore = await Store.findOne({ where: { email } });
        if (existingStore) {
        return res.status(400).json({
            success: false,
            message: "A store already exists with this email.",
        });
        }
    
        // If an ownerId is provided, confirm that user exists and is a store_owner
        if (ownerId) {
        const owner = await User.findByPk(ownerId);
        if (!owner) {
            return res.status(400).json({ success: false, message: "Owner user not found." });
        }
        if (owner.role !== "store_owner") {
            return res.status(400).json({
            success: false,
            message: "Assigned owner must have the store_owner role.",
            });
        }
        }
    
        const newStore = await Store.create({ name, email, address, ownerId: ownerId || null });
    
        return res.status(201).json({
        success: true,
        message: "Store created successfully.",
        store: newStore,
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ success: false, message: "Some error occurred" });
    }
};
 
// ---- List users (Normal + Admin + Store Owner) with filters + sorting ----
// Query params: name, email, address, role, sortBy, sortOrder
const getAllUsers = async (req, res) => {
  const { name, email, address, role, sortBy = "name", sortOrder = "ASC" } = req.query;
 
  const where = {};
  if (name) where.name = { [Op.like]: `%${name}%` };
  if (email) where.email = { [Op.like]: `%${email}%` };
  if (address) where.address = { [Op.like]: `%${address}%` };
  if (role) where.role = role;
 
  const allowedSortFields = ["name", "email", "address", "role", "createdAt"];
  const orderField = allowedSortFields.includes(sortBy) ? sortBy : "name";
  const orderDirection = sortOrder.toUpperCase() === "DESC" ? "DESC" : "ASC";
 
  try {
    const users = await User.findAll({
      where,
      attributes: ["id", "name", "email", "address", "role", "createdAt"],
      order: [[orderField, orderDirection]],
    });
 
    return res.status(200).json({ success: true, users });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success: false, message: "Some error occurred" });
  }
};
 
// ---- List stores with filters + sorting, including average rating ----
// Query params: name, email, address, sortBy, sortOrder
const getAllStores = async (req, res) => {
  const { name, email, address, sortBy = "name", sortOrder = "ASC" } = req.query;
 
  const where = {};
  if (name) where.name = { [Op.like]: `%${name}%` };
  if (email) where.email = { [Op.like]: `%${email}%` };
  if (address) where.address = { [Op.like]: `%${address}%` };
 
  const allowedSortFields = ["name", "email", "address", "averageRating", "createdAt"];
  const orderField = allowedSortFields.includes(sortBy) ? sortBy : "name";
  const orderDirection = sortOrder.toUpperCase() === "DESC" ? "DESC" : "ASC";
 
  try {
    const stores = await Store.findAll({
      where,
      attributes: {
        include: [
          [
            sequelize.literal(
              `(SELECT AVG(value) FROM ratings WHERE ratings.store_id = Store.id)`
            ),
            "averageRating",
          ],
        ],
      },
      order:
        orderField === "averageRating"
          ? [[sequelize.literal("averageRating"), orderDirection]]
          : [[orderField, orderDirection]],
    });
 
    return res.status(200).json({ success: true, stores });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success: false, message: "Some error occurred" });
  }
};
 
// ---- Get single user's full details (includes rating if Store Owner) ----
const getUserDetails = async (req, res) => {
  const { id } = req.params;
 
  try {
    const user = await User.findByPk(id, {
      attributes: ["id", "name", "email", "address", "role", "createdAt"],
      include: [{ model: Store, as: "ownedStore" }],
    });
 
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }
 
    let responseUser = user.toJSON();
 
    // If this user is a Store Owner, attach their store's average rating
    if (user.role === "store_owner" && user.ownedStore) {
      const avgResult = await Rating.findOne({
        where: { storeId: user.ownedStore.id },
        attributes: [[sequelize.fn("AVG", sequelize.col("value")), "averageRating"]],
        raw: true,
      });
      responseUser.rating = avgResult?.averageRating
        ? parseFloat(avgResult.averageRating).toFixed(1)
        : null;
    }
 
    return res.status(200).json({ success: true, user: responseUser });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success: false, message: "Some error occurred" });
  }
};
 
module.exports = {
  getDashboardStats,
  createUser,
  createStore,
  getAllUsers,
  getAllStores,
  getUserDetails,
};