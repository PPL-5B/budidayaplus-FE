import { CycleList, AddCycle, Cycle } from "@/components/cycle";
import { formatDate } from "date-fns";
import { id } from "date-fns/locale";
import TaskByDateList from "@/components/tasks/TaskByDateList";

export default function Home() {
  return (
    <div className="flex flex-col items-center w-full mb-10">
      <div className="mt-20 py-10 w-[80%] text-4xl font-medium text-neutral-600">
        <p>Welcome to</p>
        <p className="text-primary-600 font-normal">BudidayaPlus</p>
      </div>

      <div className="flex gap-2 items-center justify-center w-full">
        <div className="w-[80%] flex gap-2">
          <div className="h-5 w-0.5 bg-neutral-700" />
          <p className="text-start">
            {formatDate(new Date(), "EEEE, dd MMMM yyyy", { locale: id })}
          </p>
        </div>
      </div>

      <Cycle />

      <div className="flex flex-col items-center w-full">
        <p className="mt-10 py-10 w-[80%] text-2xl font-medium text-neutral-60">Tugas Hari Ini </p>
        <TaskByDateList />
    </div>

    </div>
  );
}
