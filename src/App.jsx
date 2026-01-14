import './App.css';
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Calendar from './caregiver/Calendar';

function App() {
  return (
    <BrowserRouter>
      <main className='main-content'>
        <Routes>
          <Route path="/calendar" element={<Calendar />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App;