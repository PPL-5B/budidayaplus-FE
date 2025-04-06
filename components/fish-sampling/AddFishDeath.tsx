'use client';

import React, { useState, useEffect } from 'react';
import { addFishDeath, getLatestFishDeath } from '@/lib/fish-sampling/addFishDeath'; 
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal as DialogContent } from '@/components/ui/modal';
import { Dialog, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { IoIosAdd } from 'react-icons/io';
import { Skull } from 'lucide-react';

interface AddFishDeathProps {
  pondId: string;
  cycleId: string;
  onFishDeathUpdate?: (count: number) => void;
}

const AddFishDeath: React.FC<AddFishDeathProps> = ({ pondId, cycleId, onFishDeathUpdate }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState<'confirm' | 'input'>('confirm');
  const [fishDeath, setFishDeath] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fishDeathCount, setFishDeathCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchLatestFishDeath = async () => {
      try {
        const latestData = await getLatestFishDeath(pondId, cycleId);
        setFishDeathCount(latestData.fish_death_count);
      } catch (error) {
        console.error('Gagal mengambil data kematian ikan:', error);
        setFishDeathCount(0);
      }
    };

    fetchLatestFishDeath();
  }, [pondId, cycleId]);

  const handleSubmit = async () => {
    if (fishDeath === '' || fishDeath <= 0 || isNaN(fishDeath)) {
      setErrorMessage('Jumlah kematian ikan harus lebih dari 0.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const result = await addFishDeath(pondId, cycleId, fishDeath);
      if (result?.success) {
        const latestData = await getLatestFishDeath(pondId, cycleId);
        setFishDeathCount(latestData.fish_death_count);
        onFishDeathUpdate?.(latestData.fish_death_count);

        setFishDeath('');
        setModalOpen(false);
        setModalStep('confirm'); // reset
      } else {
        throw new Error(result?.message ?? 'Terjadi kesalahan saat mengirim data.');
      }
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    if (fishDeathCount && fishDeathCount > 0) {
      setModalStep('confirm');
    } else {
      setModalStep('input');
    }
    setModalOpen(true);
  };

  return (
    <div>
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" onClick={handleOpen}>
            Data Kematian Ikan <IoIosAdd size={20} className="ml-1" />
          </Button>
        </DialogTrigger>

        {modalStep === 'confirm' && (
          <DialogContent title="Timpa Data Kematian Ikan">
            <p>Apakah Anda yakin ingin menimpa data kematian ikan sebelumnya?</p>
            <DialogFooter>
              <Button
                className="bg-[#ff8585] hover:bg-[#ff8585] text-white rounded-xl"
                onClick={() => setModalStep('input')}
              >
                Konfirmasi
              </Button>
            </DialogFooter>
          </DialogContent>
        )}

        {modalStep === 'input' && (
          <DialogContent title="Input Kematian Ikan">
            <div className="space-y-4">
              <Input
                type="number"
                value={fishDeath}
                onChange={(e) => setFishDeath(e.target.value === '' ? '' : Number(e.target.value))}
                min={1}
                placeholder="Masukkan jumlah ikan mati"
              />
              {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
              <Button onClick={handleSubmit} disabled={loading} className="bg-blue-500 hover:bg-blue-600 text-white">
                {loading ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>

      {fishDeathCount === null && (
        <p className="text-sm text-gray-500 italic mt-2">Memuat data kematian ikan...</p>
      )}

      <div className="flex flex-col mt-4">
        <div className="flex gap-2">
          <Skull size={18} /> Kematian Ikan
        </div>
        <p className="text-xl font-semibold text-neutral-600" data-testid="fish-death">
          {fishDeathCount ?? '0'}
        </p>
      </div>
    </div>
  );
};

export default AddFishDeath;