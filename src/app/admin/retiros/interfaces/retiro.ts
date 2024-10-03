interface CreateRetiroInterface {
  quantity: number;
  userId: number;
}

interface RetirosInterface {
  id: number;
  quantity: number;
  user: User;
  createdAt: Date;
}
