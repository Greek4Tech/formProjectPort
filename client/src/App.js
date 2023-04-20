import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './Home'
import Login from './Login'
import Signup from './Signup'
import ProtectedRoutes from './ProtectedRoutes'

function App() {
  return (
    <div className="App">
        <Router>
          <Routes>
            <Route element={<ProtectedRoutes />}>
                <Route element={<Home/>} path="/" exact/>
            </Route>
            <Route element={<Login/>} path="/login"/>
            <Route element={<Signup/>} path="/signup"/>
          </Routes>
      </Router>
    </div>
  );
}

export default App;