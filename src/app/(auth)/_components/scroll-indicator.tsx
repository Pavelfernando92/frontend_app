"use client"

import { ChevronDown } from "lucide-react"
import { useEffect, useState } from "react"

export default function ScrollIndicator() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      // Ocultar el indicador cuando el usuario ha desplazado más de 100px
      if (window.scrollY > 100) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToNextSection = () => {
    // Altura de la ventana del navegador
    const windowHeight = window.innerHeight
    window.scrollTo({
      top: windowHeight,
      behavior: "smooth",
    })
  }

  return (
    <div
      className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center transition-opacity duration-300 cursor-pointer z-10 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={scrollToNextSection}
    >
      <p className="text-white font-semibold mb-2 text-center text-shadow">Sigue explorando</p>
      <div className="bg-burgundy rounded-full p-3 shadow-lg animate-bounce">
        <ChevronDown className="h-6 w-6 text-gold" />
      </div>
    </div>
  )
}
