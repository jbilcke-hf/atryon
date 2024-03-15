declare module "@tomickigrzegorz/react-circular-progress-bar" {
  import { ReactNode } from "react";

  export interface CircularProgressBarProps {
    percent: number;
    id?: number;
    speed?: number;
    colorSlice?: string;
    colorCircle?: string;
    stroke?: number;
    strokeBottom?: number;
    round?: boolean;
    inverse?: boolean;
    rotation?: number;
    number?: boolean;
    size?: number;
    cut?: number;
    unit?: string;
    fill?: string;
    strokeDasharray?: string;
    fontWeight?: number | string;
    fontSize?: string;
    fontColor?: string;
    animationOff?: boolean;
    styles?: React.CSSProperties;
    linearGradient?: string[];
    textPosition?: string;
    animationSmooth?: string;
    children?: ReactNode;
  }

  const CircularProgressBar: React.ComponentType<CircularProgressBarProps>;

  export { CircularProgressBar };
}