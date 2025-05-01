import express from 'express';
import { protect } from '../middlewares/auth.js';
import Task from '../models/Task.js';

const router = express.Router();

const validateTask = (data) => {
  const errors = [];
  if (!data.meta || typeof data.meta !== 'string') {
    errors.push('A meta é obrigatória e deve ser um texto');
  } else if (data.meta.length < 3) {
    errors.push('A meta deve ter pelo menos 3 caracteres');
  } else if (data.meta.length > 100) {
    errors.push('A meta não pode exceder 100 caracteres');
  }

  if (data.motivo && typeof data.motivo !== 'string') {
    errors.push('O motivo deve ser um texto');
  } else if (data.motivo && data.motivo.length > 200) {
    errors.push('O motivo não pode exceder 200 caracteres');
  }

  if (!data.prazo) {
    errors.push('O prazo é obrigatório');
  } else {
    const prazoDate = new Date(data.prazo);
    if (isNaN(prazoDate.getTime())) {
      errors.push('O prazo deve ser uma data válida');
    } else if (prazoDate < new Date()) {
      errors.push('O prazo não pode ser no passado');
    }
  }

  return errors;
};

router.post('/', protect, async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: 'Unauthorized: Invalid or missing user data',
      });
    }

    const errors = validateTask(req.body);
    if (errors.length > 0) {
      return res.status(400).json({
        message: 'Erro de validação',
        errors,
      });
    }

    const task = new Task({
      ...req.body,
      userId: req.user.id,
    });

    await task.save();
    res.status(201).json({
      message: 'Tarefa criada com sucesso',
      task,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        message: 'Erro de validação',
        errors: messages,
      });
    }
    console.error('Task Creation Error:', error);
    res.status(500).json({
      message: 'Erro no servidor. Tente novamente mais tarde',
    });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const id = req.params.id;
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({
        status: 'failed',
        message: 'Task not found',
      });
    }
    const payload = { ...req.body };
    const updatedTask = await Task.findByIdAndUpdate(id, payload, { new: true });
    res.status(200).json({
      status: 'success',
      data: updatedTask,
    });
  } catch (error) {
    console.error('Task Update Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const id = req.params.id;
    const task = await Task.findByIdAndDelete(id);
    if (!task) {
      return res.status(404).json({
        status: 'failed',
        message: 'Task not found',
      });
    }
    return res.status(200).json({
      status: 'success',
      message: 'Task deleted successfully',
    });
  } catch (error) {
    console.error('Task Deletion Error:', error);
    res.status(500).json({ message: 'Server internal error' });
  }
});


router.get('/', protect, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id });
    res.status(200).json({
      status: 'success',
      data: tasks,
    });
  } catch (error) {
    console.error('Task Fetch Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const id = req.params.id;
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Tarefa não encontrada' });
    }
    if (task.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Acesso negado' });
    }
    res.status(200).json({ message: 'Tarefa recuperada com sucesso', task });
  } catch (error) {
    console.error('Task Fetch Error:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

export default router;