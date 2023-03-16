import React, { useState } from "react";

const App = () => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [lineOfItems, setLineOfItems] = useState([
    { description: "", quantity: 1, price: 0 }
  ]);
  // const [formValidated, setFormValidated] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(event)
  };

  const changeName = (event) => {
    setName(event.target.value);
  };

  const changeAddress = (event) => {
    setAddress(event.target.value);
  };

  const handleChangeLine = (index, field, value) => {
    const copyOflineOfItems = [...lineOfItems];
    copyOflineOfItems[index][field] = value;
    setLineOfItems(copyOflineOfItems);
  };

  const addALine = () => {
    const copyOfLineList = [...lineOfItems];
    setLineOfItems([
      ...copyOfLineList,
      {
        description: "",
        quantity: 1,
        price: 0
      }
    ]);
  };

  const total = () => {
    return lineOfItems.reduce((accumulator, item) => {
      return accumulator + item.quantity * item.price;
    }, 0);
  };

  const removeALine = (index) => {
    const copyOfLineList = [...lineOfItems];
    copyOfLineList.splice(index, 1);
    setLineOfItems(copyOfLineList);
  };

  return (
    <>
      <form onSubmit={handleSubmit} >
        <label htmlFor="name">Name</label>
        <input type="text" id="name" minlength="4" required value={name} onChange={changeName} />
        <label htmlFor="address">Address</label>
        <textarea
          type="text"
          id="address"
          value={address}
          onChange={changeAddress}
          required
          minlength="1"
        ></textarea>
        <h2>List of Items</h2>
        {lineOfItems.map((item, index) => (
          <div key={index}>
            {/* Description */}
            <label htmlFor={`description${index}`}>Description</label>
            <input
              id={`description${index}`}
              value={item.description}
              type="text"
              required
              onChange={(event) => {
                handleChangeLine(index, "description", event.target.value);
              }}
            />
            {/* quantity */}
            <label htmlFor={`quantity${index}`}>Quantity</label>
            <input
              type="number"
              id={`quantity${index}`}
              value={item.quantity}
              required
              onChange={(event) =>
                handleChangeLine(index, "quantity", event.target.value)
              }
            />
            {/* price */}
            <label htmlFor={`price${index}`}>Price</label>
            <input
              type="number"
              id={`price${index}`}
              value={item.price}
              required
              onChange={(event) =>
                handleChangeLine(index, "price", event.target.value)
              }
            />
            <button onClick={() => removeALine(index)}>Remove a Line</button>
          </div>
        ))}
        <div>
          <button onClick={addALine}>Add A line</button>
          {/* <button type="button">Submit</button> */}
        </div>
        <p>The total is: {total()}</p>
        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default App; 
