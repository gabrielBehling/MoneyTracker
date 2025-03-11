const Balance = ({ balance }) => {
  return (
    <div id="saldo-box">
      SALDO R$
      <span id="saldo">{balance.toFixed(2)}</span>
    </div>
  )
}

export default Balance 