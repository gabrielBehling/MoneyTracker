import Statistics from '../components/Statistics'
import { Link } from 'react-router-dom'

const Stats = ({ transactions }) => {
  return (
    <>
      <div className="page-header">
        <Link to="/" className="back-button">
          ← Voltar
        </Link>
      </div>
      <Statistics transactions={transactions} />
    </>
  );
};

export default Stats; 