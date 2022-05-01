const { Schema, model, Types } = require('mongoose');

const ReactionSchema = new Schema({
  // set custom id to avoid confusion with parent thought_id
  reactionId: {
    type: Schema.Types.ObjectId,
    default: () => new Types.ObjectId()
  },
  reactionBody: {
    type: String,
    required: true,
    maxlength: 280
  },
  username: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: createdAtVal => dateFormat(createdAtVal)
  }
},
{
    toJSON: {
        virtuals: true,
        getters: true
    },
    id: false // prevents virtuals from creating duplicate of _id as `id`
}
)