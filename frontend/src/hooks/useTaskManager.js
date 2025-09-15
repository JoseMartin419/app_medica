// src/hooks/useTaskManager.js

import { useState, useEffect, useCallback } from 'react';

// El helper de almacenamiento que ya tenías
const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : [];
    } catch (error) {
      console.error("Error al leer:", error);
      return [];
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  }
};

export function useTaskManager() {
  const [tasks, setTasks] = useState(() => storage.get('doctorTasksAdvanced'));
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isInitialized) {
      setTasks(storage.get('doctorTasksAdvanced'));
      setIsInitialized(true);
    }
  }, [isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      const timer = setTimeout(() => {
        storage.set('doctorTasksAdvanced', tasks);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [tasks, isInitialized]);

  const addTask = useCallback((taskData) => {
    const newTask = {
      id: Date.now(),
      text: taskData.text.trim(),
      completed: false,
      priority: taskData.priority,
      dueDate: taskData.dueDate || null,
      createdAt: new Date().toISOString()
    };
    setTasks(prevTasks => [newTask, ...prevTasks]);
  }, []);

  const toggleTask = useCallback((id) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }, []);

  const deleteTask = useCallback((id) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  }, []);

  const editTask = useCallback((id, newText) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, text: newText.trim() } : task
      )
    );
  }, []);

  const clearCompleted = useCallback(() => {
    if (window.confirm('¿Seguro que quieres eliminar todas las tareas completadas?')) {
      setTasks(prevTasks => prevTasks.filter(task => !task.completed));
    }
  }, []);

  return { tasks, addTask, toggleTask, deleteTask, editTask, clearCompleted };
}
