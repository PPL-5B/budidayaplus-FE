import { Cycle } from "@/types/cycle";
import { CarouselItem } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { RefreshCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { StopCycle } from "@/components/cycle";
import { Profile } from "@/types/profile";

export const renderCycleCard = (
  cycle: Cycle,
  label: string,
  bgColor: string,
  dateTextColor: string,
  user?: Profile
) => (
  <CarouselItem key={cycle.id} className="pl-1 basis-5/6">
    <Card
      className={cn(bgColor, 'h-36 border-none rounded-lg relative overflow-hidden')}
    >
      <CardContent className="flex flex-col justify-between p-3 px-4 h-full">
        <div>
          <p className="font-semibold text-white text-lg">
            {label}
          </p>
          <p className={`font-semibold ${dateTextColor} text-lg -mt-1`}>
            {format(new Date(cycle.start_date), "dd/MM/yy", { locale: id })} -{" "}
            {format(new Date(cycle.end_date), "dd/MM/yy", { locale: id })}
          </p>
        </div>
        {label.includes("Aktif") && user?.role === "supervisor" && (
          <StopCycle className='self-end mb-1' cycleId={cycle.id} />
        )}
      </CardContent>
      <RefreshCcw
        size={90}
        className={cn(
          "overflow-hidden absolute -bottom-5 text-white opacity-20 font-bold",
          label.includes("Aktif") ? "-left-3" : "-right-3"
        )}
      />
    </Card>
  </CarouselItem>
);
