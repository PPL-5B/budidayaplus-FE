'use client'

import React, { useEffect, useState } from 'react';
import { getLatestPondDashboard } from '@/lib/pond-quality/getLatestPondDashboard';
import PondAlertPopup from './PondQualityAlerts';
import { Waves } from 'lucide-react';
import { EmptyData } from '@/components/ui/empty-data';

interface PondQualityDashboardProps {
  pondId: string;
  cycleId: string | null;
}

interface PondData {
  ph_level?: number;
  salinity?: number;
  water_temperature?: number;
  water_clarity?: number;
  [key: string]: number | string | undefined;
}

interface Alert {
  id: string;
  parameter: string;
  actual_value: number;
  target_value: number;
  status: string;
}

const PondQualityDashboard: React.FC<PondQualityDashboardProps> = ({ pondId, cycleId }) => {
  const [latestData, setLatestData] = useState<PondData | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);

  const targetValues = {
    ph_level: 7.5,
    salinity: 30,
    water_temperature: 28,
    water_clarity: 80,
  };

  useEffect(() => {
    if (!cycleId || !pondId) {
      setLoading(false);
      return;
    }

    const fetchLatestData = async () => {
      try {
        setLoading(true);
        setHasError(false);
        const latest = await getLatestPondDashboard(pondId, cycleId);
        setLatestData(latest ?? null);
        
        if (latest) {
          const newAlerts: Alert[] = [];
          if (latest.ph_level < 7.5) {
            newAlerts.push({ id: '1', parameter: 'ph_level', actual_value: latest.ph_level, target_value: 7.5, status: 'Below Target' });
          }
          if (latest.salinity < 30) {
            newAlerts.push({ id: '2', parameter: 'salinity', actual_value: latest.salinity, target_value: 30, status: 'Below Target' });
          }
          if (latest.water_temperature < 28) {
            newAlerts.push({ id: '3', parameter: 'water_temperature', actual_value: latest.water_temperature, target_value: 28, status: 'Below Target' });
          }
          if (latest.water_clarity < 80) {
            newAlerts.push({ id: '4', parameter: 'water_clarity', actual_value: latest.water_clarity, target_value: 80, status: 'Below Target' });
          }
          setAlerts(newAlerts);
        }
      } catch (err) { 
        console.error('Failed to fetch dashboard data:', err);
        setHasError(true);
      } finally { 
        setLoading(false); 
      }
    };

    fetchLatestData();
  }, [pondId, cycleId]);

  const getValueClassName = (key: string) => {
    const actualValue = latestData?.[key];
    const targetValue = targetValues[key as keyof typeof targetValues];

    if (actualValue === undefined || actualValue === null) return "";

    return typeof actualValue === 'number' && actualValue < targetValue
      ? "text-red-500 font-medium"
      : "";
  };

  if (!cycleId || !pondId) {
    return <p className="text-center">Loading...</p>;
  }

  if (loading) {
    return <p className="text-center">Loading...</p>;
  }

  if (hasError || !latestData) {
    return (
      <div className="mt-10">
        <EmptyData />
      </div>
    );
  }

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-semibold text-center flex items-center justify-center">
        <Waves className="w-10 h-10 text-[#2154C5] mr-2" /> Dashboard Kualitas Air Terbaru
      </h2>
      <div className="flex justify-center mt-4">
        <table className="border-collapse border border-gray-300 w-[80%] text-center">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">Parameter</th>
              <th className="border border-gray-300 px-4 py-2">Nilai Aktual</th>
              <th className="border border-gray-300 px-4 py-2">Nilai Target</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(targetValues).map((key) => (
              <tr key={key}>
                <td className="border border-gray-300 px-4 py-2 capitalize">{key.replace('_', ' ')}</td>
                <td className={`border border-gray-300 px-4 py-2 ${getValueClassName(key)}`}>
                  {latestData[key] ?? 'N/A'}
                </td>
                <td className="border border-gray-300 px-4 py-2">{targetValues[key as keyof typeof targetValues]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {alerts.length > 0 && <PondAlertPopup alerts={alerts} />}
    </div>
  );
};

export default PondQualityDashboard;
