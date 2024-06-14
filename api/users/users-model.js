const db = require("../../data/db-config");

function find() {
  return db("users").select("user_id", "username");
}

function findBy(filter) {
  console.log("FILTER?", filter);
  return db("users").where(filter);
}

function findById(user_id) {
  return db("users").select("user_id", "username").where({ user_id }).first();
}

async function add(user) {
  const [newUser] = await db("users")
    .insert(user)
    .returning(["user_id", "username"]);
  return newUser;
}

module.exports = {
  find,
  findBy,
  findById,
  add,
};
