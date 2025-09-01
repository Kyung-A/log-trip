import { status } from './types';

export const applicationKeys = {
  all: ['companionApplication'] as const,
  byCompanion: (id: string) =>
    [...applicationKeys.all, 'byCompanion', id] as const,
  mine: (status?: status) => [...applicationKeys.all, 'mine', status] as const,
};
