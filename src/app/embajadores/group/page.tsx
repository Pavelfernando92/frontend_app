"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { DataTable } from "@/app/admin/usuarios/_components/data-table";

import useGroup from "../hooks/useGroup";
import useUsersStore from "@/store/users.store";
import { columns } from "../_components/columns-group";
import { useEffect, useState } from "react";
import { AddToGroupModal } from "../_components/add-to-group-modal";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";

export default function GroupPage() {
  const { data: session } = useSession();
  const { getGroupMembers, addUserToEmbassadorGroup } = useGroup();
  const { user } = useUsersStore();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [list, setList] = useState<User[]>([]);

  useEffect(() => {
    if (!user) return;
    const getMembers = async () => {
      setIsLoading(true);
      try {
        const members = await getGroupMembers(user.id);
        setList(members);
      } catch (error) {
        console.error("Error fetching group members:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudo obtener el historial del grupo",
        });
      } finally {
        setIsLoading(false);
      }
    };
    getMembers();
  }, [user, getGroupMembers, toast]);

  const handleAddToGroup = async (userId: number) => {
    if (!user) return;

    try {
      await addUserToEmbassadorGroup(userId, user.id);

      const updatedMembers = await getGroupMembers(user.id);
      setList(updatedMembers);
      toast({
        variant: "success",
        title: "Agregado",
        description: "Usuario agregado correctamente",
      });
    } catch (error) {
      console.error("Error adding member to group:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo agregar usuario al grupo",
      });
    }
  };

  return (
    <div className="container mx-auto py-10 w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Usuarios</h2>
        <AddToGroupModal
          onAddToGroup={handleAddToGroup}
          token={session?.user.token || ""}
        />
      </div>
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      ) : (
        <DataTable columns={columns} data={list} />
      )}
    </div>
  );
}
