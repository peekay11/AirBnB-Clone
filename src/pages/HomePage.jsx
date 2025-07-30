import Nav from "../components/Nav/Nav";
import Hero from "../components/Hero/Hero";
import Inspire from "../components/Inspire/Inspire";
import Discover from "../components/Discover/Discover";
import Shop from "../components/Shop/Shop";
import Getaways from "../components/Getaways/Getaways";
import FooterLinks from "../components/Footer/Links/FooterLinks";
import Footer from "../components/Footer/Footer";
import SearchBar from "../components/SearchBar/SearchBar";
import "./HomePage.css";
import homeImage from "../assets/images/home.jpg";
import Question from "../components/Question/Question";

export default function HomePage() {
  return (
    <div>
      <div className="top-section-bg">
        {/* <Nav /> */}
        <SearchBar />
        <Hero
          image={homeImage}
          title="Not sure where to go? Perfect."
          buttonText="I'm Flexible"
        />
      </div>
      <Inspire />
      <Discover />
      <Shop />
      <Question />
      <Getaways />
      <FooterLinks />
      <Footer />
    </div>
  );
}
