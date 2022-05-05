const { User, Thought } = require('../models')

const userController = {
    getAllUser(req, res) {
        User.find({}) //mongoose
        .populate({
            path: 'thoughts', //passing in an object with the key path plus the value of the field you want populated
            select: '-__v'
        })
        .select('-__v')
        .sort({ _id: -1 }) //sort in DESC order by the _id value
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
          console.log(err);
          res.sendStatus(400);
      })
    },
    getUserById({ params }, res) { //destructured params out of it, because that's the only data we need
        User.findOne({ _id: params.id })
        .populate({
            path: 'thoughts',
            select: '-__v'
        })
        .populate({
            path: 'friends',
            select: '-__v'
        })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
          console.log(err);
          res.sendStatus(400);
        });
    },
    createUser({ body }, res) { //post/api/user
        User.create(body)
          .then(dbUserData => res.json(dbUserData))
          .catch(err => res.status(400).json(err));
    },
    // update user by id
    updateUser({ params, body }, res) { //PUT /api/users/:id  /Mongoose finds a single document we want to update, then updates it and returns the updated document
        User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true  }) //By setting the parameter to true, we're instructing Mongoose to return the new version of the document. 
            .then(dbUserData => {
            if (!dbUserData) {
            res.status(404).json({ message: 'No user found with this id!' });
            return;
        }
        res.json(dbUserData);
        })
        .catch(err => res.json(err));
    },
    //delete User
    deleteUser({ params }, res) {
    Thought.deleteMany({ userId: params.id }) //delete thought with user
        .then(() => {
        User.findOneAndDelete({ userId: params.id })
            .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No User found with this id!' });
                return;
            }
            res.json(dbUserData);
            });
        })
        .catch(err => res.json(err));
      },
    addFriend({ params }, res) { //api/users/:userid/fiends/:friendId
        User.findOneAndUpdate(
        { _id: params.userId },
        { $push: { friends: params.friendId } },
        { new: true }
        )
        .then((dbUserData) => {
            if (!dbUserData) {
            res.status(404).json({ message: 'No user found with this id' });
            return;
            }
            res.json(dbUserData);
        })
        .catch((err) => res.status(400).json(err));
    },
    deleteFriend({ params }, res) {
        User.findOneAndUpdate(
        { _id: params.userId },
        { $pull: { friends: params.friendId } },
        { new: true }
        )
        .then((dbUserData) => {
            if (!dbUserData) {
            res.status(404).json({ message: 'No user found with this id' });
            return;
            }
            res.json(dbUserData);
        })
        .catch((err) => res.status(400).json(err));
    }
}

module.exports = userController;