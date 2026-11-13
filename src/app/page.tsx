import AIAssistant from "@/components/AIAssistant";
import EmergencyCard from "@/components/EmergencyCard";
import EmergencyContact from "@/components/EmergencyContact";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import HospitalListing from "@/components/HospitalListing";
import Navbar from "@/components/Navbar";
import { emergencyCategories } from "@/data/emergencyCategories";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />

        <section id="categories" className="bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Emergency Categories
              </h2>
              <p className="mt-3 text-gray-600">
                Select the type of emergency to find the right care faster.
              </p>
            </div>
            <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {emergencyCategories.map((category) => (
                <li key={category.id}>
                  <EmergencyCard category={category} />
                </li>
              ))}
            </ul>
          </div>
        </section>

        <HospitalListing />
        <AIAssistant />
        <EmergencyContact />
      </main>
      <Footer />
    </>
  );
}
