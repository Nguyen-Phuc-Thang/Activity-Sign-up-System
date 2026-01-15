import './App.css';
import { Route, Routes, BrowserRouter } from "react-router-dom";

// Screens imports
import Login from './pages/Login.jsx';
import Activity from './pages/Activity.jsx';

function App() {
  return (
    <BrowserRouter>
      <main className='main-content'>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/activity" element={<Activity />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App;