import "./App.scss";
import About from "./components/About/About.jsx";
import Care from "./components/Care/Care.jsx";
import Doctors from "./components/Doctors/Doctors.jsx";
import Header from "./components/Header/Header.jsx";
import Promo from "./components/Promo/Promo.jsx";
import Services from "./components/Services/Services.jsx";
import Treatment from "./components/Treatment/Treatment.jsx";

function App() {
  return (
    <>
      <Header />
      <Promo />
      <Care />
      <About />
      <Services />
      <Treatment />
      <Doctors />
    </>
  );
}

export default App;
