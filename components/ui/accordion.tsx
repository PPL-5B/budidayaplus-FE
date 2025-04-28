import * as React from "react";

interface AccordionProps {
  children: React.ReactNode;
  type?: "single" | "multiple";
  collapsible?: boolean;
}

const Accordion: React.FC<AccordionProps> = ({ children }) => {
  return <div className="space-y-2">{children}</div>;
};

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="border border-gray-300 rounded-md">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left font-semibold p-4 bg-gray-100"
      >
        {title}
      </button>
      {isOpen && <div className="p-4 text-gray-600">{children}</div>}
    </div>
  );
};

export { Accordion, AccordionItem };