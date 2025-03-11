import { useMemo } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const Statistics = ({ transactions }) => {
  // Helper function to get readable category names
  const getCategoryName = (category) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  const stats = useMemo(() => {
    if (!transactions.length) return null;

    // Calculate average spending (expenses only)
    const expenses = transactions.filter(t => t.type === 'despesa');
    const avgSpending = expenses.length 
      ? expenses.reduce((sum, t) => sum + t.value, 0) / expenses.length 
      : 0;

    // Calculate category statistics
    const categoryStats = expenses.reduce((acc, t) => {
      acc[t.category] = acc[t.category] || { count: 0, total: 0 };
      acc[t.category].count++;
      acc[t.category].total += t.value;
      return acc;
    }, {});

    // Find most frequent category
    const mostFrequentCategory = Object.entries(categoryStats)
      .sort((a, b) => b[1].count - a[1].count)[0];

    // Find highest spending category
    const highestSpendingCategory = Object.entries(categoryStats)
      .sort((a, b) => b[1].total - a[1].total)[0];

    // Calculate this month's spending
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    const thisMonthExpenses = expenses.filter(t => {
      const date = new Date(t.date);
      return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
    });
    const thisMonthTotal = thisMonthExpenses.reduce((sum, t) => sum + t.value, 0);

    // Prepare chart data
    const chartData = {
      labels: Object.keys(categoryStats).map(getCategoryName),
      datasets: [{
        data: Object.values(categoryStats).map(cat => cat.total),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF'
        ],
        borderColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF'
        ],
        borderWidth: 1
      }]
    };

    return {
      avgSpending,
      mostFrequentCategory: mostFrequentCategory ? {
        name: getCategoryName(mostFrequentCategory[0]),
        count: mostFrequentCategory[1].count
      } : null,
      highestSpendingCategory: highestSpendingCategory ? {
        name: getCategoryName(highestSpendingCategory[0]),
        total: highestSpendingCategory[1].total
      } : null,
      thisMonthTotal,
      chartData
    };
  }, [transactions]);

  if (!stats) return null;

  return (
    <div id="statistics-box">
      <h2>ESTATÍSTICAS</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Média de Gastos</h3>
          <p>R$ {stats.avgSpending.toFixed(2)}</p>
        </div>
        <div className="stat-card">
          <h3>Gastos do Mês</h3>
          <p>R$ {stats.thisMonthTotal.toFixed(2)}</p>
        </div>
        {stats.mostFrequentCategory && (
          <div className="stat-card">
            <h3>Categoria Mais Frequente</h3>
            <p>{stats.mostFrequentCategory.name}</p>
            <small>{stats.mostFrequentCategory.count} transações</small>
          </div>
        )}
        {stats.highestSpendingCategory && (
          <div className="stat-card">
            <h3>Maior Gasto por Categoria</h3>
            <p>{stats.highestSpendingCategory.name}</p>
            <small>R$ {stats.highestSpendingCategory.total.toFixed(2)}</small>
          </div>
        )}
      </div>
      <div className="chart-container">
        <h3>Distribuição de Gastos por Categoria</h3>
        <div style={{ position: 'relative', width: '100%', maxHeight: '400px' }}>
          <Pie 
            data={stats.chartData}
            options={{
              responsive: true,
              maintainAspectRatio: true,
              plugins: {
                legend: {
                  position: window.innerWidth <= 768 ? 'bottom' : 'right',
                  labels: {
                    boxWidth: window.innerWidth <= 480 ? 10 : 12,
                    padding: window.innerWidth <= 480 ? 8 : 10,
                    font: {
                      size: window.innerWidth <= 480 ? 10 : 12
                    }
                  }
                },
                tooltip: {
                  callbacks: {
                    label: function(context) {
                      const value = context.raw;
                      const total = context.dataset.data.reduce((a, b) => a + b, 0);
                      const percentage = ((value / total) * 100).toFixed(1);
                      return `R$ ${value.toFixed(2)} (${percentage}%)`;
                    }
                  }
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Statistics; 