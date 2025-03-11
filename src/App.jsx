import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import * as XLSX from 'xlsx'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import './App.css'
import ThemeToggle from './components/ThemeToggle'
import Home from './pages/Home'
import Stats from './pages/Stats'

function AppContent() {
  const location = useLocation();
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('transactions')
    return saved ? JSON.parse(saved) : []
  })

  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    const saved = localStorage.getItem('theme')
    if (saved) {
      return saved === 'dark'
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  const [balance, setBalance] = useState({
    total: 0,
    income: 0,
    expenses: 0
  })

  useEffect(() => {
    const income = transactions
      .filter(t => t.type === 'receita')
      .reduce((sum, t) => sum + t.value, 0)
    
    const expenses = transactions
      .filter(t => t.type === 'despesa')
      .reduce((sum, t) => sum + t.value, 0)

    setBalance({
      income,
      expenses,
      total: income - expenses
    })

    localStorage.setItem('transactions', JSON.stringify(transactions))
  }, [transactions])

  useEffect(() => {
    document.body.className = isDarkTheme ? 'dark-theme' : ''
    localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light')
  }, [isDarkTheme])

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = (e) => {
      // Only update if there's no saved preference
      if (!localStorage.getItem('theme')) {
        setIsDarkTheme(e.matches)
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  const toggleTheme = () => {
    setIsDarkTheme(prev => !prev)
  }

  const addTransaction = (transaction) => {
    setTransactions([...transactions, { ...transaction, id: Date.now() }])
  }

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id))
  }

  const prepareExportData = () => {
    return transactions.map(t => ({
      Data: new Date(t.date).toLocaleDateString(),
      Descrição: t.description,
      Categoria: t.category,
      Tipo: t.type === 'receita' ? 'Receita' : 'Despesa',
      Valor: t.value
    }));
  };

  const exportToCSV = () => {
    const data = prepareExportData();
    const headers = ['Data', 'Descrição', 'Categoria', 'Tipo', 'Valor'];
    
    const csvContent = [
      headers.join(','),
      ...data.map(row => [
        row.Data,
        `"${row.Descrição}"`,
        row.Categoria,
        row.Tipo,
        row.Valor
      ].join(','))
    ].join('\n');
    
    downloadFile(csvContent, 'text/csv;charset=utf-8;', 'money_manager_transactions.csv');
  };

  const exportToJSON = () => {
    const data = prepareExportData();
    const jsonContent = JSON.stringify(data, null, 2);
    downloadFile(jsonContent, 'application/json', 'money_manager_transactions.json');
  };

  const exportToExcel = () => {
    const data = prepareExportData();
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Transações");
    XLSX.writeFile(wb, "money_manager_transactions.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('Money Manager - Relatório de Transações', 15, 20);
    
    // Add date
    doc.setFontSize(10);
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 15, 30);
    
    // Add summary
    doc.setFontSize(12);
    doc.text('Resumo:', 15, 40);
    doc.text(`Receitas: R$ ${balance.income.toFixed(2)}`, 15, 48);
    doc.text(`Despesas: R$ ${balance.expenses.toFixed(2)}`, 15, 56);
    doc.text(`Saldo: R$ ${balance.total.toFixed(2)}`, 15, 64);
    
    // Prepare table data
    const headers = [['Data', 'Descrição', 'Categoria', 'Tipo', 'Valor']];
    const data = transactions.map(t => [
      new Date(t.date).toLocaleDateString('pt-BR'),
      t.description,
      t.category,
      t.type === 'receita' ? 'Receita' : 'Despesa',
      `R$ ${t.value.toFixed(2)}`
    ]);

    // Create table
    const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY : 75;
    
    doc.setFontSize(10);
    doc.setTextColor(40);
    
    // Add table manually if autoTable is not available
    if (!doc.autoTable) {
      let y = finalY;
      const cellPadding = 5;
      const cellHeight = 12;
      const columnWidths = [30, 50, 40, 30, 30];
      const totalWidth = columnWidths.reduce((a, b) => a + b, 0);
      
      // Draw headers background
      doc.setFillColor(34, 139, 34); // Forest green color
      doc.rect(15, y, totalWidth, cellHeight, 'F');
      
      // Draw headers text
      doc.setTextColor(255);
      headers[0].forEach((header, i) => {
        let x = 15;
        for (let j = 0; j < i; j++) {
          x += columnWidths[j];
        }
        doc.text(header, x + cellPadding, y + cellHeight - cellPadding);
      });
      
      // Draw data
      y += cellHeight;
      doc.setTextColor(40);
      data.forEach((row, rowIndex) => {
        // Alternate row background
        if (rowIndex % 2 === 0) {
          doc.setFillColor(240, 240, 240);
          doc.rect(15, y, columnWidths.reduce((a, b) => a + b, 0), cellHeight, 'F');
        }
        
        row.forEach((cell, i) => {
          let x = 15;
          for (let j = 0; j < i; j++) {
            x += columnWidths[j];
          }
          doc.text(cell.toString(), x + cellPadding, y + cellHeight - cellPadding);
        });
        y += cellHeight;
        
        // Add new page if needed
        if (y > doc.internal.pageSize.height - 20) {
          doc.addPage();
          y = 20;
        }
      });
    } else {
      // Use autoTable if available
      doc.autoTable({
        startY: finalY,
        head: headers,
        body: data,
        theme: 'striped',
        headStyles: { 
          fillColor: [34, 139, 34], // Forest green color
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        },
        styles: { fontSize: 10 },
        alternateRowStyles: { fillColor: [240, 240, 240] }
      });
    }

    doc.save('money_manager_transactions.pdf');
  };

  const downloadFile = (content, type, filename) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExport = (format) => {
    let filename;
    switch (format) {
      case 'csv':
        filename = 'transacoes_money_manager.csv';
        exportToCSV();
        break;
      case 'json':
        filename = 'transacoes_money_manager.json';
        exportToJSON();
        break;
      case 'excel':
        filename = 'transacoes_money_manager.xlsx';
        exportToExcel();
        break;
      case 'pdf':
        filename = 'transacoes_money_manager.pdf';
        exportToPDF();
        break;
      default:
        filename = 'transacoes_money_manager.csv';
        exportToCSV();
    }
  };

  return (
    <main className={isDarkTheme ? 'dark-theme' : ''}>
      <ThemeToggle isDark={isDarkTheme} onToggle={toggleTheme} />
      <h1>MONEY MANAGER</h1>
      <Routes>
        <Route path="/" element={
          <>
            <Home 
              balance={balance}
              transactions={transactions}
              onAddTransaction={addTransaction}
              onDeleteTransaction={deleteTransaction}
              onExport={handleExport}
            />
            <nav className="main-nav">
              <Link to="/stats" className="stats-button">
                📊 Ver Estatísticas
              </Link>
            </nav>
          </>
        } />
        <Route path="/stats" element={
          <Stats transactions={transactions} />
        } />
      </Routes>
    </main>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App
