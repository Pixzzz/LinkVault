const userService = require("../services/userService");
const asyncHandler = require("../utils/asyncHandler");

const list = asyncHandler(async (req, res) => {
  const result = await userService.listUsers(req.validated.query);
  res.json(result);
});

const updateRole = asyncHandler(async (req, res) => {
  const user = await userService.updateUserRole(
    req.validated.params.id,
    req.body.role,
    req.user.id,
  );
  res.json({ data: user });
});

const remove = asyncHandler(async (req, res) => {
  await userService.deleteUser(req.validated.params.id, req.user.id);
  res.status(204).send();
});

module.exports = { list, updateRole, remove };

