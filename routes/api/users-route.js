const router = require('express').Router

const {
    getAllUser,
    getUserById,
    createUser
} = require('../../controllers/user-controller')

// /api/user
router
  .route('/')
  .get(getAllUser)
  .post(createUser);

// /api/user/:id
router
  .route('/:id')
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;