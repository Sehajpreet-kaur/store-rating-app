const {DataTypes} = require("sequelize");
const sequelize = require("../config/database");

const Store=sequelize.define("Store",
    {
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true,
        },
        name:{
            type:DataTypes.STRING(60),
            allowNull:false,
            validate:{
                len:{
                    args:[20,60],
                    msg:"Name must be between 20 and 60 characters",
                },
            },
        },
        email:{
            type:DataTypes.STRING(255),
            allowNull:false,
            unique:true,
            validate:{
                isEmail:{
                    msg:"Please enter a valid email",
                },
            },
        },
        address:{
            type:DataTypes.STRING(400),
            allowNull:true,
            validate:{
                len:{
                    args:[0,400],
                    msg:"Address must be less than 400 characters",
                },
            },
        },
        // Links this store to the User account (role: store_owner) that manages it.
        // Nullable because an admin might create a store before assigning an owner.
        ownerId:{
            type:DataTypes.INTEGER,
            allowNull:true,
            field:"owner_id",
            references:{
                model:"users",
                key:"id",  
            },
        },
    },
    {
        tableName:"stores",
        timestamps:true,
    }
);

module.exports=Store;