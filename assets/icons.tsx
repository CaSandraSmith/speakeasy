import React from 'react';
import { Ionicons } from '@expo/vector-icons';

type IconProps = {
  color: string;
  size?: number;
};

export type IconName = 'index' | 'bookings' | 'profile';

// Individual icon functions
export function HomeIcon(props: IconProps) {
  return (
    <Ionicons name="home-outline" size={props.size || 24} color={props.color} />
  );
}


export function ProfileIcon(props: IconProps) {
  return (
    <Ionicons name="person-outline" size={props.size || 24} color={props.color} />
  );
}

export function BookingsIcon(props: IconProps) {
  return (
    <Ionicons name="calendar-outline" size={props.size || 24} color={props.color} />
  );
}

// Main icons object
export const icons: Record<IconName, (props: IconProps) => JSX.Element> = {
  index: HomeIcon,
  profile: ProfileIcon,
  bookings: BookingsIcon,
};

// Default export
export default function GetIcon(name: IconName, props: IconProps) {
  const IconComponent = icons[name];
  return IconComponent ? IconComponent(props) : <HomeIcon {...props} />;
}
