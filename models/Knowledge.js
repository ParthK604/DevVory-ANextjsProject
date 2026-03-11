import mongoose from "mongoose";

const KnowledgeSchema = new mongoose.Schema(
{
  title: {
    type: String,
    required: true,
  },

  description: String,

  notes: String,

  links: [String],

  images: [
    {
      url: String
    }
  ],

  pdfs: [String],

  tags: [String],

  important: {
    type: Boolean,
    default: false
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
},
{ timestamps: true }
);

export default mongoose.models.Knowledge ||
mongoose.model("Knowledge", KnowledgeSchema);