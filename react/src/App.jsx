import { Route, Routes } from "react-router-dom";
import "./App.scss";
import FindDoctor from "./pages/FindDoctor.jsx";
import Home from "./pages/Home.jsx";
import NotFound from "./pages/NotFound.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="find-a-doctor" element={<FindDoctor />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
