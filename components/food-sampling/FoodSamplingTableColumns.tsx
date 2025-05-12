'use client';

import React from 'react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { FoodSampling } from '@/types/food-sampling';

interface FoodSamplingTableColumnsProps {
  data: FoodSampling[];
}

const FoodSamplingTableColumns: React.FC<FoodSamplingTableColumnsProps> = ({ data }) => {
  return (
    <div className="bg-[#e8f0fe] p-6 rounded-md">
      <h2 className="text-lg font-bold mb-4">Riwayat Jumlah Makanan</h2>
      {data.length === 0 ? (
        <p className="text-sm text-gray-500">Belum ada data makanan.</p>
      ) : (
        data.map((item, index) => {
          const date = format(new Date(item.recorded_at), 'EEEE, d MMM yyyy', { locale: id });
          const fullName = `${item.reporter.first_name} ${item.reporter.last_name}`;

          return (
            <div
              key={item.sampling_id}
              className="bg-white border border-gray-400 rounded-lg p-4 mb-3 text-sm text-gray-700"
            >
              <p className="mb-1">
                {date}, oleh {fullName}
              </p>
              <p className="font-bold">
                Kuantitas (gram): <span className="font-normal">{item.food_quantity}</span>
              </p>
            </div>
          );
        })
      )}
    </div>
  );
};

export default FoodSamplingTableColumns;