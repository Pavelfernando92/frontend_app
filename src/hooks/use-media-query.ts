"use client"

import { useState, useEffect } from "react"

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia(query)

    // Establecer el valor inicial
    setMatches(mediaQuery.matches)

    // Definir un callback para cuando cambie el estado
    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    // Añadir el listener
    mediaQuery.addEventListener("change", handler)

    // Limpiar
    return () => {
      mediaQuery.removeEventListener("change", handler)
    }
  }, [query])

  return matches
}
