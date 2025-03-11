import Balance from '../components/Balance'
import Summary from '../components/Summary'
import TransactionForm from '../components/TransactionForm'
import TransactionList from '../components/TransactionList'

const Home = ({ balance, transactions, onAddTransaction, onDeleteTransaction, onExport }) => {
  return (
    <>
      <Balance balance={balance.total} />
      <Summary income={balance.income} expenses={balance.expenses} />
      <TransactionForm onSubmit={onAddTransaction} />
      <TransactionList 
        transactions={transactions} 
        onDelete={onDeleteTransaction}
        onExport={onExport}
      />
    </>
  );
};

export default Home; 