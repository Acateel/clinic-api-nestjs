import Feedback from "react-bootstrap/esm/Feedback";
import About from "../components/About/About";
import Care from "../components/Care/Care";
import Doctors from "../components/Doctors/Doctors";
import Footer from "../components/Footer/Footer";
import Header from "../components/Header/Header";
import Promo from "../components/Promo/Promo";
import Questions from "../components/Questions/Questions";
import Services from "../components/Services/Services";
import Treatment from "../components/Treatment/Treatment";

const Home = () => {
  return (
    <>
      <Header />
      <Promo />
      <Care />
      <About />
      <Services />
      <Treatment />
      <Doctors />
      <Questions />
      <Feedback />
      <Footer />
    </>
  );
};

export default Home;
