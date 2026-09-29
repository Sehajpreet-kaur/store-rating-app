// Creates a first admin (register only makes normal users), plus demo data.
// Run once:  npm run seed
require("dotenv").config();
const { sequelize, User, Store } = require("../models");

(async () => {
  await sequelize.sync({ alter: true });

  const users = [
    { name: "System Administrator Account", email: "admin@example.com", password: "Admin@1234", address: "HQ, Main Street", role: "admin" },
    { name: "Demo Store Owner Account One", email: "owner@example.com", password: "Owner@1234", address: "12 Market Road", role: "store_owner" },
    { name: "Demo Normal User Account One", email: "user@example.com", password: "User@1234", address: "34 Park Avenue", role: "normal" },
  ];

  const created = {};
  for (const u of users) {
    const [row, isNew] = await User.findOrCreate({ where: { email: u.email }, defaults: u });
    created[u.role] = row;
    console.log(`${isNew ? "created" : "exists "}  ${u.role.padEnd(12)} ${u.email}  /  ${u.password}`);
  }

  await Store.findOrCreate({
    where: { email: "store@example.com" },
    defaults: {
      name: "Demo Corner Grocery Store Ltd",
      email: "store@example.com",
      address: "12 Market Road",
      ownerId: created.store_owner.id,
    },
  });

  console.log("Seed complete.");
  await sequelize.close();
})().catch((e) => { console.error(e); process.exit(1); });
