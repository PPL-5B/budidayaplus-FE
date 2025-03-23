import { FishSampling } from '@/types/fish-sampling';

export const renderSamplingData = (fishSampling: FishSampling) => {
    return [{
        sampling_id: fishSampling.sampling_id,
        fish_weight: fishSampling.fish_weight,
        fish_length: fishSampling.fish_length,
        sample_date: fishSampling.recorded_at
    }];
};