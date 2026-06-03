import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity, Menu, X, Home, Stethoscope, Clipboard,
  Pill, BarChart3, FolderOpenDot, FileText
} from 'lucide-react';

const links = [
  { to: '/', label: 'Inicio', icon: Home },
  { to: '/consultas', label: 'Consultas', icon: Stethoscope },
  { to: '/historial', label: 'Historial', icon: Clipboard },
  { to: '/medicamentos', label: 'Medicamentos', icon: Pill },
  { to: '/dashboard', label: 'Estadísticas', icon: BarChart3 },
  { to: '/procedimientos', label: 'Procedimientos', icon: FolderOpenDot },
  { to: '/certificado-medico', label: 'Certificado', icon: FileText },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const isActive = (to) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-sm fixed w-full z-10 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 flex items-center gap-2">
            <Activity className="text-indigo-600" size={28} />
            <span className="text-xl font-bold hidden sm:block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              TodoDoctor
            </span>
          </div>

          <div className="hidden md:flex items-baseline space-x-1">
            {links.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all duration-200 ${
                  isActive(to)
                    ? 'text-indigo-600 bg-indigo-50'
                    : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50/50'
                }`}
              >
                <Icon size={16} className="opacity-70" /> {label}
              </Link>
            ))}
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 focus:outline-none transition-all"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden bg-white/95 backdrop-blur-sm"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {links.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setOpen(false)}
                  className={`block px-3 py-3 rounded-lg text-base font-medium flex items-center gap-3 transition-all ${
                    isActive(to)
                      ? 'text-indigo-600 bg-indigo-50'
                      : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50/50'
                  }`}
                >
                  <Icon size={18} className="opacity-70" /> {label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
