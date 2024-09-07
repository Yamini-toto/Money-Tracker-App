import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [name, setName] = useState('');
  const [datetime, setDatetime] = useState('');
  const [description, setDescription] = useState('');
  const [transactions, setTransactions] = useState([]);
useEffect(()=>{
  const url = `${import.meta.env.VITE_API_URL}/transactions`;
 fetch(url, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
 }).then(response => response.json()).then(data => setTransactions(data)
);
},[]);
  function addNewTransaction(e) {
    e.preventDefault();
    const url = `${import.meta.env.VITE_API_URL}/transaction`;
    const price = name.split(" ")[0];
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name.substring(price.length + 1),
        description,
        price,
        datetime,
      }),
    })
      .then((res) => res.json())
      .then((newTransaction) => {
        setTransactions([...transactions, newTransaction]);
        setName('');
        setDescription('');
        setDatetime('');
      })
      .catch((error) => console.error('Error:', error));
  }

  function formatDate(datetime){
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
    return new Date(datetime).toLocaleString('en-US', options);
  } 

  let bal = 0;
  for(const transaction of transactions){
    bal = bal + transaction.price;
  }
  bal = bal.toFixed(2);
  const fraction = bal.split('.')[1];
  bal = bal.split('.')[0];


  return (
    <>
      <h1 className='amount'>${bal}<span>.{fraction}</span></h1>
      <form onSubmit={addNewTransaction}>
        <div className='basic'>
          <input
            type='text'
            placeholder='+200 new Samsung TV'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type='datetime-local'
            value={datetime}
            onChange={(e) => setDatetime(e.target.value)}
          />
        </div>
        <div className='description'>
          <input
            type='text'
            placeholder='description'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <button type='submit'>Add new transaction</button>
      </form>
      <div className='transactions scroll'>
        {transactions.map((transaction, index) => (
          <div key={index} className='transaction'>
            <div className='left'>
              <div className='name'>{transaction.name}</div>
              <div className='description'>{transaction.description}</div>
            </div>
            <div className='right'>
              <div className='price' style={{color: `${transaction.price < 0 ? 'red':'green'}` }}>${transaction.price}</div>
              <div className='datatime'>{formatDate(transaction.datetime)}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
