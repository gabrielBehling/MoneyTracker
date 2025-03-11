import { useState } from 'react'

const TransactionForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    description: '',
    value: '',
    type: '',
    category: 'outros',
    date: new Date().toISOString().split('T')[0]
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      value: parseFloat(formData.value)
    })
    setFormData({
      description: '',
      value: '',
      type: '',
      category: 'outros',
      date: new Date().toISOString().split('T')[0]
    })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3 className="form-subtitle">DESCRIÇÃO</h3>
      <input
        type="text"
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="INFORME A DESCRIÇÃO"
        required
      />

      <h3 className="form-subtitle">VALOR</h3>
      <input
        type="number"
        name="value"
        value={formData.value}
        onChange={handleChange}
        min="0"
        step="0.01"
        placeholder="INFORME O VALOR"
        required
      />

      <h3 className="form-subtitle">CATEGORIA</h3>
      <select
        name="category"
        value={formData.category}
        onChange={handleChange}
        required
      >
        <option value="alimentação">Alimentação</option>
        <option value="transporte">Transporte</option>
        <option value="utilidades">Utilidades</option>
        <option value="entretenimento">Entretenimento</option>
        <option value="outros">Outros</option>
      </select>

      <h3 className="form-subtitle">DATA</h3>
      <input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
        required
      />

      <h3 className="form-subtitle">TIPO</h3>
      <div className="radio-group">
        <label className="radio-label">
          <input
            type="radio"
            name="type"
            value="receita"
            checked={formData.type === 'receita'}
            onChange={handleChange}
            required
          />
          RECEITA
        </label>
        <label className="radio-label">
          <input
            type="radio"
            name="type"
            value="despesa"
            checked={formData.type === 'despesa'}
            onChange={handleChange}
            required
          />
          DESPESA
        </label>
      </div>
      
      <hr />
      <div id="submit-box">
        <button type="submit">ADICIONAR</button>
      </div>
      <hr />
    </form>
  )
}

export default TransactionForm 