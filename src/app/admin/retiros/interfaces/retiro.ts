/* eslint-disable @typescript-eslint/no-unused-vars */
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
