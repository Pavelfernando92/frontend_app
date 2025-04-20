export default function Footer() {
  return (
    <footer className="bg-burgundy text-white py-6">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <p className="text-sm opacity-80">
            &copy; {new Date().getFullYear()} Lotuss México. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
