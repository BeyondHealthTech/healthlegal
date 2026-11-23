import Header from "./components/Header";
import Hero from "./components/Hero";
import Problem from "./components/Problem";
import Services from "./components/Services";
import SelfCheck from "./components/SelfCheck";
import FeatureMap from "./components/FeatureMap";
import Articles from "./components/Articles";
import Cases from "./components/Cases";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Problem />
        <FeatureMap />
        <Services />
        <Cases />
        <SelfCheck />
        <Articles />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
