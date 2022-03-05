import { SvgIcon } from "@mui/material";
import {
  DefaultComponentProps,
  OverridableTypeMap,
} from "@mui/material/OverridableComponent";
import React from "react";

const MenuIcon: React.FC<DefaultComponentProps<OverridableTypeMap>> = (
  props
) => {
  return (
    <SvgIcon
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      {...props}
      fill="#fff"
    >
      <g data-name="Layer 2">
        <g data-name="menu-2">
          <rect
            width="24"
            height="24"
            transform="rotate(180 12 12)"
            opacity="0"
          />
          <circle cx="4" cy="12" r="1" />
          <rect x="7" y="11" width="14" height="2" rx=".94" ry=".94" />
          <rect x="3" y="16" width="18" height="2" rx=".94" ry=".94" />
          <rect x="3" y="6" width="18" height="2" rx=".94" ry=".94" />
        </g>
      </g>
    </SvgIcon>
  );
};

export default MenuIcon;
