// src/components/WidgetTareasAvanzado.jsx

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTaskManager } from '../hooks/useTaskManager';
import { CheckSquare, Square, Plus, Trash2, Bell, AlertCircle, Clock, Calendar, Edit3, FileText } from 'lucide-react';

export default function WidgetTareasAvanzado() {
  const { tasks, addTask, toggleTask, deleteTask, editTask, clearCompleted } = useTaskManager();
  
  const [newTask, setNewTask] = useState('');
  const [priority, setPriority] = useState(false);
  const [dueDate, setDueDate] = useState('');
  const [filter, setFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const summary = useMemo(() => {
    const pending = tasks.filter(t => !t.completed);
    const overdue = pending.filter(t => t.dueDate && t.dueDate < today).length;
    const forToday = pending.filter(t => t.dueDate === today).length;
    return { pending: pending.length, overdue, forToday };
  }, [tasks, today]);

  const filteredTasks = useMemo(() => tasks.filter(task => {
    if (filter === 'pending') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  }), [tasks, filter]);

  const sortedTasks = useMemo(() => [...filteredTasks].sort((a, b) => {
    if (a.priority !== b.priority) return b.priority - a.priority;
    if (a.dueDate && b.dueDate) return new Date(a.dueDate) - new Date(b.dueDate);
    if (a.dueDate) return -1;
    if (b.dueDate) return 1;
    return new Date(b.createdAt) - new Date(a.createdAt);
  }), [filteredTasks]);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (newTask.trim() === '') return;
    addTask({ text: newTask, priority, dueDate });
    setNewTask('');
    setPriority(false);
    setDueDate('');
  };

  const handleStartEdit = (task) => {
    setEditingId(task.id);
    setEditingText(task.text);
  };
  
  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (editingText.trim()) {
      editTask(editingId, editingText);
    }
    setEditingId(null);
    setEditingText('');
  };

  const renderTask = (task) => {
    const isOverdue = task.dueDate && !task.completed && task.dueDate < today;
    const isEditing = editingId === task.id;

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        key={task.id}
        className={`flex items-start justify-between p-3 rounded-lg border transition-all ${
          task.completed ? 'bg-gray-100/70 border-gray-200' : 'bg-white hover:border-teal-300'
        }`}
      >
        <div className="flex items-start gap-3 flex-grow min-w-0">
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => toggleTask(task.id)}>
            {task.completed ? <CheckSquare size={20} className="text-green-500" /> : <Square size={20} className="text-gray-400" />}
          </motion.button>
          
          <div className="flex-grow">
            {isEditing ? (
              <form onSubmit={handleSaveEdit}>
                <input
                  type="text"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  onBlur={handleSaveEdit}
                  autoFocus
                  className="w-full text-sm bg-transparent border-b border-teal-500 focus:outline-none"
                />
              </form>
            ) : (
              <p
                onClick={() => handleStartEdit(task)}
                className={`text-sm cursor-pointer ${task.completed ? 'text-gray-500 line-through' : 'text-gray-800'}`}
              >
                {task.text}
              </p>
            )}
            
            {/* --- INICIO DE CAMBIOS --- */}
            <div className="flex items-center gap-x-3 gap-y-1 mt-1.5 flex-wrap">
              {task.priority && !task.completed && <div className="flex items-center gap-1 text-xs text-red-700 bg-red-100 px-2 py-0.5 rounded-full"><AlertCircle size={12}/>Prioridad</div>}
              {task.dueDate && !task.completed && <div className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${isOverdue ? 'text-red-700 bg-red-100' : 'text-blue-700 bg-blue-100'}`}><Calendar size={12}/>{new Date(task.dueDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</div>}
              
              {/* NUEVO: Muestra la fecha y hora de creación */}
              <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Clock size={12} />
                  <span>
                    {new Date(task.createdAt).toLocaleString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}h
                  </span>
              </div>
            </div>
             {/* --- FIN DE CAMBIOS --- */}

          </div>
        </div>
        
        <div className="flex items-center gap-1">
           {!isEditing && <motion.button whileHover={{ scale: 1.2 }} onClick={() => handleStartEdit(task)} className="text-gray-400 hover:text-blue-600"><Edit3 size={14} /></motion.button>}
           <motion.button whileHover={{ scale: 1.2 }} onClick={() => deleteTask(task.id)} className="text-gray-400 hover:text-red-600"><Trash2 size={14} /></motion.button>
        </div>
      </motion.div>
    );
  };
  
  return (
    // --- CAMBIO DE ANCHURA AQUÍ ---
    <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-teal-500 col-span-1 sm:col-span-2 lg:col-span-3 flex flex-col">
      <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
              <div className="bg-teal-100 p-3 rounded-full"><Bell className="text-teal-600" size={20} /></div>
              <div>
                  <h3 className="text-lg font-semibold text-gray-800">Tareas y Recordatorios</h3>
                  <p className="text-sm text-gray-500">
                      {summary.pending > 0 ? `${summary.pending} pendiente(s)` : 'Todo al día'}
                      {summary.overdue > 0 && <span className="text-red-500">, {summary.overdue} vencida(s)</span>}
                      {summary.forToday > 0 && <span className="text-blue-500">, {summary.forToday} para hoy</span>}
                  </p>
              </div>
          </div>
      </div>

      <form onSubmit={handleAddTask} className="mb-4 space-y-2">
        <div className="flex gap-2">
          <input type="text" value={newTask} onChange={(e) => setNewTask(e.target.value)} placeholder="Añadir una nueva tarea..." className="flex-grow p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
          <motion.button whileTap={{ scale: 0.95 }} type="submit" className="bg-teal-500 hover:bg-teal-600 text-white p-2 rounded-lg"><Plus size={20} /></motion.button>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={priority} onChange={() => setPriority(!priority)} className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500" />Prioritaria</label>
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="border-gray-300 rounded-lg text-sm p-1 focus:ring-teal-500" min={today} />
        </div>
      </form>

      <div className="flex gap-2 mb-3 text-sm border-b pb-3">
        <button onClick={() => setFilter('all')} className={`px-3 py-1 rounded-full ${filter === 'all' ? 'bg-teal-100 text-teal-800' : 'text-gray-500 hover:bg-gray-100'}`}>Todas</button>
        <button onClick={() => setFilter('pending')} className={`px-3 py-1 rounded-full ${filter === 'pending' ? 'bg-teal-100 text-teal-800' : 'text-gray-500 hover:bg-gray-100'}`}>Pendientes</button>
        <button onClick={() => setFilter('completed')} className={`px-3 py-1 rounded-full ${filter === 'completed' ? 'bg-teal-100 text-teal-800' : 'text-gray-500 hover:bg-gray-100'}`}>Completadas</button>
      </div>

      <div className="space-y-2 max-h-72 overflow-y-auto pr-2 flex-grow">
        <AnimatePresence>
          {sortedTasks.length > 0 ? (
            sortedTasks.map(renderTask)
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-10">
              <FileText size={40} className="mx-auto text-gray-300" />
              <p className="mt-2 text-gray-500 text-sm">No hay tareas en esta vista.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {tasks.some(t => t.completed) && (
        <div className="mt-3 pt-3 border-t border-gray-200 text-right">
          <button onClick={clearCompleted} className="text-xs text-gray-500 hover:text-red-600 flex items-center gap-1 ml-auto"><Trash2 size={14} />Limpiar completadas</button>
        </div>
      )}
    </div>
  );
}