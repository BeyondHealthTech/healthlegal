import Header from "./components/Header";
import Hero from "./components/Hero";
import Problem from "./components/Problem";
import Services from "./components/Services";
import ForYou from "./components/ForYou";
import Strength from "./components/Strength";
import Company from "./components/Company";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Problem />
        <Services />
        <ForYou />
        <Strength />
        <Company />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
