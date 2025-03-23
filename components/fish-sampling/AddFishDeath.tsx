'use client';


import React, { useState, useEffect } from 'react';
import { addFishDeath } from '@/lib/fish-sampling/addFishDeath';
import { getLatestFishDeath } from '@/lib/fish-sampling/getLatestFishDeath';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal as DialogContent } from '@/components/ui/modal';
import { Dialog, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { IoIosAdd } from 'react-icons/io';
import { Skull } from 'lucide-react';


interface AddFishDeathProps {
  pondId: string;
  cycleId: string;
  onFishDeathUpdate?: (count: number) => void;
}


const AddFishDeath: React.FC<AddFishDeathProps> = ({ pondId, cycleId, onFishDeathUpdate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [fishDeath, setFishDeath] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fishDeathCount, setFishDeathCount] = useState<number>(0);


  useEffect(() => {
    const fetchLatestFishDeath = async () => {
      try {
        const latestData = await getLatestFishDeath(pondId, cycleId);
        setFishDeathCount(latestData.fish_death_count);
      } catch (error) {
        console.error('❌ Gagal mengambil data kematian ikan:', error);
      }
    };


    fetchLatestFishDeath();
  }, [pondId, cycleId]);


  const handleConfirm = () => {
    setIsConfirmOpen(false);
    setIsModalOpen(true);
  };


  const handleSubmit = async () => {
    if (fishDeath === '' || fishDeath <= 0 || isNaN(fishDeath)) {
      setErrorMessage('Jumlah kematian ikan harus lebih dari 0.');
      return;
    }


    setLoading(true);
    setErrorMessage(null);


    try {
      const result = await addFishDeath({ fish_death_count: fishDeath }, pondId, cycleId);
      if (result && result.success) {
        console.log("✅ Data berhasil dikirim!");


        const latestData = await getLatestFishDeath(pondId, cycleId);
        setFishDeathCount(latestData.fish_death_count);
        onFishDeathUpdate?.(latestData.fish_death_count);


        setFishDeath('');
        setIsModalOpen(false);
      } else {
        throw new Error(result?.message ?? 'Terjadi kesalahan saat mengirim data.');
      }
    } catch (error: any) {
      console.error("❌ Gagal mengirim data:", error.message);
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div>
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        {fishDeathCount > 0 && (
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              Data Kematian Ikan <IoIosAdd size={20} className="ml-1" />
            </Button>
          </DialogTrigger>
        )}
        <DialogContent title="Timpa Data Kematian Ikan">
          <p>Apakah Anda yakin ingin menimpa data kematian ikan sebelumnya?</p>
          <DialogFooter>
            <DialogClose asChild>
              <Button className="bg-[#ff8585] hover:bg-[#ff8585] text-white rounded-xl" onClick={handleConfirm}>
                Konfirmasi
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        {fishDeathCount === 0 && (
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              Data Kematian Ikan <IoIosAdd size={20} className="ml-1" />
            </Button>
          </DialogTrigger>
        )}
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
      </Dialog>


      <div className="flex flex-col mt-4">
        <div className="flex gap-2">
          <Skull size={18} /> Kematian Ikan
        </div>
        <p className="text-xl font-semibold text-neutral-600" data-testid="fish-death">
          {loading ? 'Loading...' : fishDeathCount}
        </p>
      </div>
    </div>
  );
};


export default AddFishDeath;



