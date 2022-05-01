const { User } = require('../models')

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
        .select('-__v')
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
    deleteUser({ params }, res) { //DELETE /api/users/:id
        User.findOneAndDelete({ _id: params.id }) //.findOneAndDelete() method will find the document to be returned and also delete it from the database
        .then(dbUserData => res.json(dbUserData))
        .catch(err => res.json(err));
    }
}

module.exports = userController