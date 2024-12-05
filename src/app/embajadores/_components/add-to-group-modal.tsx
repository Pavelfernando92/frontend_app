"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useDebounce } from "../hooks/use-debounce";
import lotussApi from "@/lib/axios";

interface AddToGroupModalProps {
  onAddToGroup: (userId: number) => void;
  token: string;
}

export function AddToGroupModal({ onAddToGroup, token }: AddToGroupModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const searchUsers = async (term: string) => {
    if (!term) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const res = await lotussApi(`/usuarios/search-users`, {
        params: {
          term: encodeURIComponent(term),
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res) throw new Error("Failed to fetch users");
      const users = res.data;
      setSearchResults(users);
    } catch (error) {
      console.error("Error searching users:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToGroup = (userId: number) => {
    onAddToGroup(userId);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Agregar usuario a Grupo</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Agregar usuario al grupo</DialogTitle>
          <DialogDescription>
            Busca un usuario por email o nombre para agregarlo a tu grupo.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            placeholder="Buscar por email o nombre"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              searchUsers(e.target.value);
            }}
          />
          {isLoading && <p>Buscando usuarios...</p>}
          {!isLoading && searchResults.length === 0 && debouncedSearchTerm && (
            <p>No se encontraron usuarios</p>
          )}
          {searchResults.map((user) => (
            <div key={user.id} className="flex justify-between items-center">
              <span>
                {user.nombre} ({user.email})
              </span>
              <Button onClick={() => handleAddToGroup(user.id)}>Agregar</Button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
