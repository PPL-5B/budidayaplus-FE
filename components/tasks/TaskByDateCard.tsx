import React from 'react';
import { Task } from "@/types/tasks";
import { useRouter } from 'next/navigation';
import { ChevronRight, FishSymbol, Utensils, WavesIcon } from 'lucide-react';

interface TaskCardProps {
    task: Task;
}

const TaskByDateCard: React.FC<TaskCardProps> = ({ task }) => {
    const router = useRouter();

    const handleClick = () => {
        router.push(`/pond/${task.pond.pond_id}`);
    };

    const taskTypeDisplay = {
        'Food Sampling': 'Sampling Makanan',
        'Pond Quality': 'Kualitas Kolam',
        'Fish Sampling': 'Sampling Ikan',
    };

    const taskTypeName = taskTypeDisplay[task.task_type as keyof typeof taskTypeDisplay] || task.task_type;

    return (
        <div className="relative w-full border rounded-lg p-4 shadow-md bg-white hover:bg-gray-100 transition duration-200 flex flex-col gap-4">
            <div className="flex items-center gap-4">
                {task.task_type === 'Fish Sampling' && (
                    <FishSymbol className="w-8 h-8 text-blue-500" data-testid="FishSymbol" />
                )}
                {task.task_type === 'Pond Quality' && (
                    <WavesIcon className="w-8 h-8 text-blue-500" data-testid="WavesIcon" />
                )}
                {task.task_type === 'Food Sampling' && (
                    <Utensils className="w-8 h-8 text-blue-500" data-testid="Utensils" />
                )}
                <h3 className="font-semibold text-lg">{taskTypeName}</h3>
            </div>

            <div>
                <p className="text-gray-600">Status: {task.status}</p>
                <p className="text-gray-600">Date: {new Date(task.date).toLocaleDateString()}</p>
                <p className="text-gray-600">Pond: {task.pond.name}</p>
            </div>

            <div className="absolute bottom-4 right-4">
                <ChevronRight
                    className="w-6 h-6 text-[#2254C5] hover:text-[#1e46a1] cursor-pointer"
                    onClick={handleClick}
                    aria-label="Navigate to pond"
                />
            </div>
        </div>
    );
};

export default TaskByDateCard;
