const Summary = ({ income, expenses }) => {
  return (
    <div id="valores-box">
      <div id="receita-box">
        <h3>RECEITA</h3>
        <span id="receita">R$ {income.toFixed(2)}</span>
      </div>
      <div id="despesas-box">
        <h3>DESPESAS</h3>
        <span id="despesas">R$ {expenses.toFixed(2)}</span>
      </div>
    </div>
  )
}

export default Summary 