import { Award, Shield, Star } from "lucide-react"

export default function Features() {
  const features = [
    {
      icon: <Star className="h-10 w-10 text-gold" />,
      title: "Juegos Emocionantes",
      description: "Disfruta de nuestros emocionantes juegos de scratch con premios instantáneos.",
    },
    {
      icon: <Shield className="h-10 w-10 text-gold" />,
      title: "Seguridad Garantizada",
      description: "Tu seguridad es nuestra prioridad en todos nuestros juegos.",
    },
    {
      icon: <Award className="h-10 w-10 text-gold" />,
      title: "Grandes Premios",
      description: "Oportunidad de ganar premios increíbles con cada juego.",
    },
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-burgundy text-center mb-12">¿Por qué elegirnos?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-burgundy mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
