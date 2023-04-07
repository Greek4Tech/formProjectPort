import React, { useState } from 'react'
import axios from "axios";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [login, setLogin] = useState(false);

    const handleSubmit = (e) => {
        // prevent the form from refreshing the whole page
        e.preventDefault();
        // set configurations
        const configuration = {
            method: "post",
            url: "http://localhost:4000/login",
            data: {
                email,
                password,
            },
        };
    // make the API call
    axios(configuration)
      .then((result) => {
        setLogin(true);
      })
      .catch((error) => {
        error = new Error();
      });

    }

    return (
        <>
            <h2 className="text-2xl font-bold mb-4">Login</h2>
            <form onSubmit={(e) => handleSubmit(e)}>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2" for="email">
                        Email address
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="email"
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>


                <div class="mb-4">
                    <label class="block text-gray-700 font-bold mb-2" for="password">
                        Password
                    </label>
                    <input
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="password"
                        type="password"
                        value={password}
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>


                <button onClick={(e) => handleSubmit(e)} class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="submit">
                    Login
                </button>

            </form>
 {/* display success message */}
 {login ? (
          <p className="text-green-600 font-bold">You Are Logged in Successfully</p>
        ) : (
          <p className="text-red-600 font-bold">You Are Not Logged in</p>
        )}
        </>
    )
}