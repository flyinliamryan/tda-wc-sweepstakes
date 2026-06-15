import Image from "next/image";
import { useTeamCrests } from "./TeamCrestsProvider";

interface Props {
  team: string;
  size?: number;
  className?: string;
}

export default function TeamCrest({ team, size = 24, className = "" }: Props) {
  const crests = useTeamCrests();
  const src = crests[team];
  if (!src) return <span className="inline-block text-slate-500 text-xs" style={{ width: size, height: size }} />;
  return (
    <Image
      src={src}
      alt={team}
      width={size}
      height={size}
      className={`object-contain ${className}`}
      unoptimized
    />
  );
}
