"use client";

import Image from "next/image";
import {
  LINE_WIDTH_BASE,
  scalePx,
  TEAM_MEMBER_DOT_SIZE_BASE,
  TEAM_MEMBER_LABEL_GAP_BASE,
  TEAM_MEMBER_NAME_PX_DESIGN,
  TEAM_MEMBER_ROLE_PX_DESIGN,
} from "@/app/lib/scale";

type TeamMember = {
  image: string;
  width: number;
  height: number;
  role: string;
  name: string;
};

export default function TeamMemberCard({
  member,
  memberW,
  contentScale,
}: {
  member: TeamMember;
  memberW: number;
  contentScale: number;
}) {
  const portraitStageH = Math.round(memberW * (345 / 400));
  const lineWidth = scalePx(LINE_WIDTH_BASE, contentScale, 2);
  const dotSize = scalePx(TEAM_MEMBER_DOT_SIZE_BASE, contentScale, 28);
  const labelGap = scalePx(TEAM_MEMBER_LABEL_GAP_BASE, contentScale, 6);
  const roleFontPx = scalePx(TEAM_MEMBER_ROLE_PX_DESIGN, contentScale, 12);
  const nameFontPx = scalePx(TEAM_MEMBER_NAME_PX_DESIGN, contentScale, 16);
  const lineRowH = Math.max(dotSize, lineWidth);
  const lineOverlap = Math.round(dotSize / 2);

  return (
    <div
      className="group flex shrink-0 flex-col items-center text-center"
      style={{ width: memberW }}
    >
      <div className="relative w-full">
        <div
          className="relative flex w-full items-end"
          style={{ height: portraitStageH }}
        >
          <Image
            src={member.image}
            alt=""
            width={member.width}
            height={member.height}
            className="block h-auto w-full grayscale transition-[filter] duration-300 ease-out group-hover:grayscale-0"
            aria-hidden
          />
        </div>

        <div
          className="relative z-10 w-full"
          style={{
            marginTop: -lineOverlap,
            height: lineRowH,
          }}
        >
          <div
            aria-hidden
            className="absolute inset-x-0 top-1/2 -translate-y-1/2 bg-purple"
            style={{ height: lineWidth }}
          />
          <div
            aria-hidden
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple transition-transform duration-300 ease-out group-hover:scale-[1.35]"
            style={{
              width: dotSize,
              height: dotSize,
            }}
          />
        </div>
      </div>

      <p
        className="font-bricolage font-medium text-ink"
        style={{
          marginTop: labelGap,
          fontSize: roleFontPx,
          lineHeight: 1.2,
        }}
      >
        {member.role}
      </p>

      <p
        className="font-bricolage font-bold text-purple"
        style={{
          marginTop: scalePx(4, contentScale, 2),
          fontSize: nameFontPx,
          lineHeight: 1.15,
        }}
      >
        {member.name}
      </p>
    </div>
  );
}
