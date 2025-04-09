// components/icons/IconChevronFilled.tsx

import React from "react";

interface IconChevronFilledProps {
  className?: string;
  fill?: string;
}

const IconChevronFilled: React.FC<IconChevronFilledProps> = ({
  className,
  fill = "#EAF0FF", // default to light white-ish fill
}) => (
  <svg
    className={className}
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill={fill}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M5 7L10 12L15 7H5Z" />
  </svg>
);

export default IconChevronFilled;