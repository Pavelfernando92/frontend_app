import { useLoginStore } from "@/store/useLoginStore";
import AuthButtons from "./auth-buttons";
import Features from "./features";
import Footer from "./footer";
import ScrollIndicator from "./scroll-indicator";
import VideoBackground from "./video-background";
import React from "react";

const LandingPage = () => {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section with Video Background */}
      <section className="relative h-screen">
        <VideoBackground />
        <ScrollIndicator />
      </section>

      {/* Auth Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-burgundy mb-8">
              Accede a tu cuenta
            </h2>
            <p className="text-lg mb-10 text-gray-700">
              Inicia sesión o regístrate para disfrutar de todos nuestros
              servicios exclusivos
            </p>
            <AuthButtons />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <Features />

      {/* Footer */}
      <Footer />
    </main>
  );
};

export default LandingPage;
