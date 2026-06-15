import Image from "next/image";
import { TEAM_CRESTS } from "@/lib/sweepstakes-data";

interface Props {
  team: string;
  size?: number;
  className?: string;
}

export default function TeamCrest({ team, size = 24, className = "" }: Props) {
  const src = TEAM_CRESTS[team];
  if (!src) return <span className="text-slate-500 text-xs">?</span>;
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
