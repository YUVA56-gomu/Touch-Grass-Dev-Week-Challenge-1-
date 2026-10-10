export type NavSectionId = 'home' | 'tracker' | 'running' | 'calendar';

export interface NavItem {
  id: NavSectionId;
  label: string;
  path: string;
  iconName: string;
  description: string;
}

export type MascotExpression = 'happy' | 'waving' | 'resting' | 'excited' | 'thinking';

export interface MascotProps {
  expression?: MascotExpression;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSpeechBubble?: boolean;
  message?: string;
  className?: string;
}

export interface PixelButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  children: React.ReactNode;
  isFullWidth?: boolean;
}

export interface PixelCardProps {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  badge?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  interactive?: boolean;
}
