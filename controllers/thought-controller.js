const { User, Thought } = require('mongoose')

const thoughtController = {
  getAllThought(req, res) {
    Thought.find({})
      .populate({
        path: 'reactions',
        select: '-__v'
      })
      .select('-__v')
      .sort({ _id: -1 })
      .then(dbThoughtData => res.json(dbThoughtData))
      .catch(err => {
        console.log(err);
        res.sendStatus(400);
      });
    },
  getThoughtById({ params }, res) {
    Thought.findOne({ _id: params.id })
      .populate({
          path: 'reactions',
          select: '-__v'
      })
    },
  updateThought({ params, body }, res) {
    Thought.findOneAndUpdate({ _id: params.id}, body, { new: true, runValidators: true })
        .then(dbThoughtData => {
            if (!dbThoughtData) {
              res.status(404).json({ message: 'No thoughts found with that id!' });
              return;
            }
            res.json(dbThoughtData);
          })
      .catch(err => res.json(err));
    },
    deleteThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.id })
            .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({ message: 'No thoughts found with that id!' });
                return;
            }
            return User.findOneAndUpdate(
                { _id: parmas.userId },
                { $pull: { thoughts: params.Id } },
                { new: true }
            )
            })
            .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No User found with this id!' });
                return;
            }
            res.json(dbUserData);
           })
        .catch(err => res.json(err));
    },
    createReaction({params, body}, res) {
    Thought.findOneAndUpdate(
        {_id: params.thoughtId}, 
        {$push: {reactions: body}}, 
        {new: true, runValidators: true})
    .populate({path: 'reactions', select: '-__v'})
    .select('-__v')
    .then(dbThoughtData => {
        if (!dbThoughtData) {
            res.status(404).json({message: 'No thoughts with this ID.'});
            return;
        }
        res.json(dbThoughtData);
       })
    .catch(err => res.status(400).json(err))
    },
    deleteReaction({ params }, res) {
    Thought.findOneAndUpdate(
        { _id: params.thoughtId },
        { $pull: { reactions: { reactionId: params.reactionId } } },
        { new: true }
    )
    .then(dbThoughtData => {
        if (!dbThoughtData) {
            res.status(404).json({ message: 'Nope!'});
            return;
        }
        res.json(dbThoughtData);
       })
    .catch(err => res.json(err));
    }
};
    
module.exports = thoughtController