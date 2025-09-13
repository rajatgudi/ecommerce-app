import React from "react";

type IconProps = React.ComponentType<React.SVGProps<SVGSVGElement>>;
export type sideBarIconsTypes = {
    imgUrl?: string;
    route: string;
    label: string;
    Icon: IconProps;
};