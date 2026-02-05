import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/TechDebate";
import TechDebate from "./pages/TechDebate";
import "./index.css"; 


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/techdebate" element={<TechDebate />} />
    </Routes>
  );
}

export default App;
