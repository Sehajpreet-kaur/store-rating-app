const {DataTypes} = require("sequelize");
const sequelize = require("../config/database");

const Rating = sequelize.define("Rating",
    {
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true,
        },
        value:{
            type:DataTypes.INTEGER,
            allowNull:false,
            validate:{
                min:{ args:[1], msg:"Rating must be at least 1" },
                max:{ args:[5], msg:"Rating cannot be more than 5" },
            },
        },
        userId:{
            type:DataTypes.INTEGER,
            allowNull:false,
            field:"user_id",
            references:{
                model:"users",
                key:"id",
            },
        },
        storeId:{
            type:DataTypes.INTEGER,
            allowNull:false,
            field:"store_id",
            references:{
                model:"stores",
                key:"id",
            },
        },
    },
    {
        tableName:"ratings",
        timestamps:true,
        indexes:[
            {
                // Enforces: one user can only have ONE rating per store.
                // "Modify their submitted rating" from the spec means UPDATE this row,
                // never INSERT a second one for the same user+store pair.
                unique:true,
                fields:["user_id","store_id"],
            }
        ]
    }
);

module.exports=Rating;