"use client";
import React, { useEffect, useState } from "react";
import useGroup from "../hooks/useGroup";
import useUsersStore from "@/store/users.store";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTable } from "@/app/admin/usuarios/_components/data-table";
import { columns } from "../_components/colums-goals";
import { CreditsProgress } from "../_components/credits-progress";
import useGameConfig from "@/app/admin/configuration/hooks/useGameConfig";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const GoalsPage = () => {
  const { getGroupMembers, getTotalCreditsGroupPerMonth } = useGroup();
  const { user } = useUsersStore();
  const { creditsPerMonth } = useGameConfig();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [list, setList] = useState<User[]>([]);
  const [totalCredits, setTotalCredits] = useState<number>(0);
  const [goalCredits, setGoalCredits] = useState<number>(0);

  useEffect(() => {
    if (!user) return;
    const getData = async () => {
      setList(await getGroupMembers(user.id));
      setTotalCredits(await getTotalCreditsGroupPerMonth(user.id));
      setIsLoading(false);
    };
    getData();
  }, [user]);

  useEffect(() => {
    if (!creditsPerMonth) return;
    setGoalCredits(Number(creditsPerMonth));
  }, [creditsPerMonth]);

  const getCurrentMonthInSpanish = () => {
    const months = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];
    return months[new Date().getMonth()];
  };

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl sm:text-3xl font-bold text-center sm:text-left">
            Metas de Créditos - {getCurrentMonthInSpanish()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-40 w-full max-w-md mx-auto" />
            </div>
          ) : (
            <CreditsProgress
              currentCredits={totalCredits}
              goalCredits={goalCredits}
            />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl font-semibold">
            Detalle de Miembros del Grupo
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-96 w-full" />
            </div>
          ) : (
            <DataTable columns={columns} data={list} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GoalsPage;
