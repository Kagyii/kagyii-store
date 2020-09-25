import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const suggestionSchema = new Schema({
    name: { type: String, required: true, unique: true },
    type: { type: String, required: true }
});

const Suggestion = mongoose.model('suggestion', suggestionSchema)

export default Suggestion;