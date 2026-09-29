const { DataTypes } = require("sequelize");
const bcrypt=require("bcryptjs");
const sequelize = require("../config/database");

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name:{
    type: DataTypes.STRING(60),
    allowNull: false,
    validate: {
        len: {
            args: [20, 60],
            msg: "Name must be between 20 and 60 characters",
        },
    },  
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: {
        msg: "Please enter a valid email",
      },
    },
  },
  // Stores the bcrypt HASH, not the plaintext password.
    // Complexity rules (8-16 chars, 1 uppercase, 1 special char) are enforced
    // on the RAW password using express-validator in the route/controller,
    // BEFORE it reaches this model — by the time it's saved here it's already
    // a ~60-character hash, so validating length/format here would be wrong.
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING(400),
    allowNull: true,
    validate: {
      len: {
        args: [0, 400], 
        msg: "Address must be less than 400 characters",
      },
    },
},
    role:{
        type: DataTypes.ENUM( "admin","normal","store_owner"),
        allowNull: false,
        defaultValue: "normal",
        },
    },
    {
        tableName: "users",
        timestamps: true,
        hooks: {
            beforeCreate: async (user) => {
                user.password = await bcrypt.hash(user.password, 10);
            },
            beforeUpdate: async (user) => {
                //only rehash if password was actually changed
                if (user.changed("password")) {
                    user.password = await bcrypt.hash(user.password, 10);
                }
            },
        },
});

User.prototype.comparePassword = async function (plainPassword) {
    return bcrypt.compare(plainPassword, this.password);
};

module.exports = User;