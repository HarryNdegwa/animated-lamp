exports.fetchUser = (id, db) => {
  return db.User.findOne({
    where: { id },
    attributes: { exclude: ["password"] },
  });
};
