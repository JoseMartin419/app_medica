import React from 'react';
import { motion } from 'framer-motion';
import WidgetTareas from './WidgetTareas';

const MetricCard = ({ gridArea, children }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
  };

  return (
    <motion.div
      style={{ gridArea }}
      variants={cardVariants}
      whileHover={{ y: -5, boxShadow: "0 12px 30px rgba(0, 0, 0, 0.12)" }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-3xl shadow-lg border border-gray-100"
    >
      {children}
    </motion.div>
  );
};

export default function DashboardMetrics({ card1, card2, card3, card4 }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="gap-6 mb-16 w-full"
      role="region"
      aria-labelledby="dashboard-heading"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
        gridTemplateRows: 'auto auto',
        gridTemplateAreas: `
          "card1 card2 widget widget"
          "card3 card4 widget widget"
        `,
        '@media (max-width: 1024px)': {
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gridTemplateAreas: `
            "card1 card2"
            "card3 card4"
            "widget widget"
          `
        },
        '@media (max-width: 640px)': {
          gridTemplateColumns: '1fr',
          gridTemplateAreas: `
            "card1"
            "card2"
            "card3"
            "card4"
            "widget"
          `
        }
      }}
    >
      <h2 id="dashboard-heading" className="sr-only">Panel de Métricas del Dashboard</h2>
      <MetricCard gridArea="card1">{card1}</MetricCard>
      <MetricCard gridArea="card2">{card2}</MetricCard>
      <MetricCard gridArea="card3">{card3}</MetricCard>
      <MetricCard gridArea="card4">{card4}</MetricCard>

      <motion.div
        style={{ gridArea: 'widget' }}
        variants={{
          hidden: { opacity: 0, scale: 0.95 },
          show: { opacity: 1, scale: 1 }
        }}
        transition={{ duration: 0.4, ease: "easeInOut", delay: 0.2 }}
        className="h-full bg-white p-6 rounded-3xl shadow-2xl border border-gray-200"
      >
        <WidgetTareas />
      </motion.div>
    </motion.section>
  );
}