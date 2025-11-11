// frontend/src/core/presentation/navigation/types.ts
import { UserSummary } from '../../../users/domain/entities/UserSummary';

export type RootStackParamList = {
  Login: undefined;
  Users: undefined;
  Chat: { user: UserSummary };
};
