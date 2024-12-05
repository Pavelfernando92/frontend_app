import React from "react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CreditsProgressProps {
  currentCredits: number;
  goalCredits: number;
}

export const CreditsProgress: React.FC<CreditsProgressProps> = ({
  currentCredits,
  goalCredits,
}) => {
  const percentage = Math.min((currentCredits / goalCredits) * 100, 100);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-center">
          Progreso de Créditos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Progress value={percentage} className="h-4" />
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="font-medium">{currentCredits} créditos</span>
          <span className="text-muted-foreground">
            Meta: {goalCredits} créditos
          </span>
        </div>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          {percentage < 100
            ? `¡Sigue así! Te faltan ${
                goalCredits - currentCredits
              } créditos para alcanzar tu meta.`
            : "¡Felicidades! Has alcanzado tu meta de créditos."}
        </p>
      </CardContent>
    </Card>
  );
};
