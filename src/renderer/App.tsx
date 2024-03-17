import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import CssBaseline from '@mui/material/CssBaseline';
import Home from './screens/Home';
import CheckInOut from './screens/CheckInOut';
import AppBarHeader from './components/AppBarHeader';
import Footer from "./components/Footer";

export default function App() {
  return (
    <>
      <CssBaseline />
      <Router>
        <AppBarHeader />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/check-in" element={<CheckInOut action={0} />} />
          <Route path="/check-out" element={<CheckInOut action={1} />} />
        </Routes>
        <Footer />
      </Router>
    </>
  );
}
