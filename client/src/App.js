// Import the useState hook and the React library
import React, { useState } from "react";

const App = () => {
  // Initialize three state variables using the useState hook
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [lineOfItems, setLineOfItems] = useState([
    { description: "", quantity: 1, price: 0 }
  ]);
  // const [formValidated, setFormValidated] = useState(false);

  // Define a function that will be called when the form is submitted
  const handleSubmit = (event) => {
    // prevent the default form submission behavior
    event.preventDefault();
    console.log(event)
    console.log(name,address,lineOfItems)

    // Create a new URLSearchParams object to store the form data
    const body = new URLSearchParams();
    body.append('payment_method_types[]', 'card');

    // Add each line item to the URLSearchParams object
    lineOfItems.forEach((item, index) => {
      body.append(`line_items[${index}][price_data][currency]`, 'usd');
      body.append(`line_items[${index}][price_data][product_data][name]`, item.description);
      body.append(`line_items[${index}][price_data][unit_amount]`, item.price);
      body.append(`line_items[${index}][quantity]`, item.quantity);
    });
    
    // Add other parameters to the URLSearchParams object
    body.append('mode', 'payment');
    body.append('success_url', 'https://example.com/success');
    body.append('cancel_url', 'https://example.com/cancel');

    // Make a POST request to the Stripe API using the fetch API
    fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": "Bearer sk_test_4eC39HqLyjWDarjtT1zdp7dc" // test Stripe API key
      },
      // Use the URLSearchParams object as the request body
      body: body
    })
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.error(err))
  }
   
// added comments
  // Define two event handler functions to update the name and address state variables
  const changeName = (event) => {
    setName(event.target.value);
  };

  const changeAddress = (event) => {
    setAddress(event.target.value);
  };

   // Define a function to update a specific line item in the lineOfItems state variable
  const handleChangeLine = (index, field, value) => {
    let copyOflineOfItems = [...lineOfItems];
    copyOflineOfItems[index][field] = value;
    setLineOfItems(copyOflineOfItems);
  };

  // Define a function to add a new line item to the lineOfItems state variable
  const addALine = () => {
    let copyOfLineList = [...lineOfItems];
    setLineOfItems([
      ...copyOfLineList,
      {
        description: "",
        quantity: 1,
        price: 0
      }
    ]);
  };

  // Define a function to calculate the total cost of all line items
  const total = () => {
    return lineOfItems.reduce((accumulator, item) => {
      return accumulator + item.quantity * item.price;
    }, 0);
  };

 // Define a function to remove a specific line item from the line
  const removeALine = (index) => {
    const copyOfLineList = [...lineOfItems];
    copyOfLineList.splice(index, 1);
    setLineOfItems(copyOfLineList);
  };

  return (
    <>
      <form onSubmit={handleSubmit} >
        <label 
        // className - Label - Name
        className="inline-flex justify-center text-sm font-medium leading-6 text-gray-900"
        htmlFor="name">Name</label>
        <input 
        // className - Input - Name
        className="inline-flex justify-center w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          type="text" 
          id="name" 
          minlength="1" 
          required value={name} 
          onChange={changeName}
          />
        <label 
        className="inline-flex justify-center text-sm font-medium leading-6 text-gray-900"
        htmlFor="address">Address</label>
        <textarea
          type="text"
          id="address"
          value={address}
          onChange={changeAddress}
          required
          className="mt-1 inline-flex justify-center w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6"
        ></textarea>
        <h2>List of Items</h2>
        
        {/* Mapping over array of items and generating a div with inputs for each */}
        {lineOfItems.map((item, index) => (
          <div className = "md:flex" key={index}>
            {/* Description */}
            <label 
            className="inline-flex justify-center text-sm font-medium leading-6 text-gray-900"
            htmlFor={`description${index}`}>Description</label>
            <input
              id={`description${index}`}
              value={item.description}
              type="text"
              required
              onChange={(event) => {
                handleChangeLine(index, "description", event.target.value);
              }}
              className="inline-flex justify-center w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            {/* quantity */}
            <label 
            className="inline-flex justify-center text-sm font-medium leading-6 text-gray-900"
            htmlFor={`quantity${index}`}>Quantity</label>
            <input
              type="number"
              id={`quantity${index}`}
              value={item.quantity}
              required
              onChange={(event) =>
                handleChangeLine(index, "quantity", event.target.value)
              }
              className="inline-flex justify-center w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            {/* price */}
            <label 
            className="inline-flex justify-center text-sm font-medium leading-6 text-gray-900"
            htmlFor={`price${index}`}>Price</label>
            <input
              type="number"
              id={`price${index}`}
              value={item.price}
              required
              onChange={(event) =>
                handleChangeLine(index, "price", event.target.value)
              }
              className="inline-flex justify-center w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            {/* Button that removes a line, includes Tailwind classes */}
            <button type="button" className="inline-flex justify-center rounded-md bg-indigo-600  px-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            onClick={() => removeALine(index)}>Remove a Line</button>
          </div>
        ))}
        <div>
          <button type="button" className="inline-flex justify-center rounded-md bg-indigo-600  px-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          onClick={addALine}>Add A line</button>
          {/* <button type="button">Submit</button> */}
        </div>
        <p className="mt-1 text-sm text-gray-600">The total is: {total()}</p>
        <button  className="inline-flex justify-center rounded-md bg-indigo-600  px-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        type="submit">Submit</button>
      </form>
    </>
  );
};

export default App; 
