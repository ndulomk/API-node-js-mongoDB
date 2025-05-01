import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  meta: {
    type: String,
    required: true,
    trim: true,
    minlength: [3, "A meta deve ter pelo menos 3 caracteres"],
    maxlength: [100, "A meta não pode exceder 100 caracteres"]
  },
  motivo: {
    type: String,
    trim: true,
    maxlength: [200, "O motivo não pode exceder 200 caracteres"],
  }, 
  prazo: {
    type: Date,
    required: [true, "O prazo é obrigatório"],
    validate: {
      validator: (date)=> date >= new Date(),
      message: "O prazo não pode ser no passado"
    }
  },
  completed: {
    type: Boolean,
    default: false
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "O usuário é obrigatório"]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const Task = mongoose.model("task", taskSchema)

export default Task