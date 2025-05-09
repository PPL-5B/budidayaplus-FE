import * as React from "react";
import { cn } from "@/lib/utils";
import IconChevronFilled from "@/components/ui/icon-chevron-filled";

interface AccordionProps {
  children: React.ReactNode;
}

const Accordion: React.FC<AccordionProps> = ({ children }) => {
  return <div className="space-y-4">{children}</div>;
};

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="rounded-xl overflow-hidden bg-[#2254C5] transition-all">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-6 py-5 text-white font-semibold text-lg"
      >
        <span>{title}</span>
        <IconChevronFilled
          className={cn(
            "w-10 h-10 transition-transform duration-300",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <div className="bg-[#EAF0FF] px-6 py-4 text-[#4D4C4C] font-semibold text-base leading-relaxed">
          {children}
        </div>
      )}
    </div>
  );
};

export { Accordion, AccordionItem };