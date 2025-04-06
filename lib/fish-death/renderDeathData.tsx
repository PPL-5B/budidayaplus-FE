import { FishDeath } from '@/types/fish-death';

export const renderFishDeathData = (fishDeath: FishDeath) => {
  return [{
    id: fishDeath.id,
    fish_death_count: fishDeath.fish_death_count,
    fish_alive_count: fishDeath.fish_alive_count,
    recorded_at: fishDeath.recorded_at,
    reporter: `${fishDeath.reporter.first_name} ${fishDeath.reporter.last_name}`,
  }];
};
