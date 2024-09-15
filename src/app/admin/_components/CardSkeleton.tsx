import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const CardSkeleton = () => (
  <CardContent>
    <Skeleton className="h-8 w-[100px] mb-2" />
    <Skeleton className="h-4 w-[120px]" />
  </CardContent>
);

export default CardSkeleton;
