import { useState } from 'react';
import ConfirmationModal from './ConfirmationModal';

const TransactionList = ({ transactions, onDelete, onExport }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const handleDeleteClick = (transaction) => {
    setSelectedTransaction(transaction);
    setModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedTransaction) {
      onDelete(selectedTransaction.id);
    }
    setModalOpen(false);
    setSelectedTransaction(null);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedTransaction(null);
  };

  const handleExportClick = () => {
    setExportModalOpen(true);
  };

  const handleExportFormat = (format) => {
    onExport(format);
    setExportModalOpen(false);
  };

  return (
    <div id="listaDescricoes-box">
      <h1>LISTA DE TRANSAÇÕES</h1>
      <ul id="descricoes">
        {transactions.map(transaction => (
          <li 
            key={transaction.id}
            className={transaction.type === 'receita' ? 'receita' : 'despesa'}
          >
            <span className="descricao">
              {transaction.description}
              <br />
              <small>
                {transaction.category} - {transaction.date}
              </small>
            </span>
            <span className="value">
              R$ {transaction.value.toFixed(2)}
            </span>
            <button 
              className="deleteButton"
              onClick={() => handleDeleteClick(transaction)}
            >
              ⓧ
            </button>
          </li>
        ))}
      </ul>
      {transactions.length > 0 && (
        <div className="action-buttons">
          <button onClick={handleExportClick} className="export-button">
            Exportar 📥
          </button>
        </div>
      )}
      <ConfirmationModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        message="Tem certeza que deseja excluir esta transação?"
      />
      <div className={`modal ${exportModalOpen ? 'show' : ''}`}>
        <div className="modal-content">
          <h2>Escolha o formato de exportação</h2>
          <div className="export-format-buttons">
            <button onClick={() => handleExportFormat('csv')}>Planilha CSV</button>
            <button onClick={() => handleExportFormat('json')}>Arquivo JSON</button>
            <button onClick={() => handleExportFormat('excel')}>Planilha Excel</button>
            <button onClick={() => handleExportFormat('pdf')}>Documento PDF</button>
          </div>
          <button className="close-button" onClick={() => setExportModalOpen(false)}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionList; 