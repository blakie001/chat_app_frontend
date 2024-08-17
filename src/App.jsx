import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import { Context } from "./context/Context";
import { useContext } from "react";

function App() {
  const { token } = useContext(Context);


  return (
    <>
      
      <Router>
        <Routes>
          <Route path="/" element={ token ? <Home /> : <Navigate to={"/login"} />} />
          <Route path="/login" element={!token ? <Login /> :  <Navigate to={"/"} />} />
          <Route path="/signup" element={!token ? <Register /> : <Navigate to={"/"} />} />
        </Routes>
    </Router>
    </>
  )
}

export default App
