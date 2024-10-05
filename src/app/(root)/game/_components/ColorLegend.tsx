import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LegendItem from "./LegendItem";

export const ColorLegend = () => (
  <Card className="mb-8 bg-white/10 backdrop-blur-lg border-none">
    <CardHeader>
      <CardTitle className="text-lg sm:text-xl font-bold text-yellow-300">
        Leyenda de Colores
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <LegendItem color="bg-gray-300" label="Números disponibles" />
        <LegendItem color="bg-red-500" label="Números ocupados" />
        <LegendItem color="bg-yellow-300" label="Tus números seleccionados" />
      </div>
    </CardContent>
  </Card>
);
