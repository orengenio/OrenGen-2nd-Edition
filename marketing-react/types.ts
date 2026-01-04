import { LucideIcon } from "lucide-react";

export interface ServiceProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: 'orange' | 'blue';
}

export interface NavItem {
  label: string;
  href: string;
}

export interface StatItem {
  value: string;
  label: string;
}