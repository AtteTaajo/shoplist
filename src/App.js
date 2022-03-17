import logo from './logo.svg';
import './App.css';
import { useState,useEffect } from 'react';
import axios from 'axios';

const URL = "http://localhost/shopinfo/";



function App() {
  const [items, setItems] = useState([]);
  const [item, setItem] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    axios.get(URL)
      .then((response) => {
        //console.log(response.data);
        setItems(response.data);
      }).catch(error => {
          alert(error.response ? error.response.data.error : error);
      });
  }, [])

  function save(e){
    e.preventDefault();
    const json = JSON.stringify({description:item,amount:amount});
    axios.post(URL + "add.php", json, {
      headers: {
        "Content-Type" : "application/json"
      }
    })
    .then((response) => {
      setItems(items =>  [...items,response.data]);
      setItem("");
      setAmount("");
    }).catch(error => {
      alert(error.response ? error.response.data.error : error);
    })
  }

  function remove(id){
    const json = JSON.stringify({id:id})
    axios.post(URL + "delete.php", json, {
      headers: {
        "Content-Type" : "application/json"
      }
    })
    .then((response) => {
      const newListWithoutRemoved = items.filter((item) => item.id !== id);
      setItems(newListWithoutRemoved);
    }).catch(error => {
      alert(error.response ? error.response.data.error : error);
    });
  }

  return (
    <form onSubmit={save}>
      <div>
        <h1>Shopping list</h1>
        <p>New item</p>
        <input value={item} placeholder="Add new item" onChange={e => setItem(e.target.value)}></input>
        <input type="number" value={amount} placeholder="Add amount" onChange={e => setAmount(e.target.value)}></input>
        <button>Add</button>

        <ol>
          {items?.map(item => (
            <li key={item.id}>
              {item.description},{item.amount}&nbsp;
              <a href="#" className='delete' onClick={() => remove(item.id)}>
              Delete
              </a>
            </li>
          ))}
        </ol>
      </div>
    </form>
    
  );
}

export default App;
