"use client";

import Image from "next/image";
import { useAds } from "@/hooks/useAds";

type AdsBannerStripProps = {
  placement: string;
};

export function AdsBannerStrip({ placement }: AdsBannerStripProps) {
  const { data, isLoading, isError } = useAds(placement);

  if (isLoading || isError || !data || data.length === 0) {
    return null;
  }

  const ad = data[0];

  const content = (
    <div className="relative h-28 w-full overflow-hidden rounded-2xl border border-slate-100 bg-slate-100 sm:h-36">
      {ad.imageUrl ? (
        <Image
          src={ad.imageUrl}
          alt={ad.title}
          fill
          className="object-cover"
          sizes="(max-width: 1200px) 100vw, 1200px"
        />
      ) : (
        <div className="flex h-full items-center justify-center bg-[#0B1A2D] px-4">
          <p className="text-sm font-bold text-[#C0FF00]">{ad.title}</p>
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0B1A2D]/80 to-transparent px-4 py-2">
        <p className="text-xs font-bold text-white">{ad.title}</p>
      </div>
    </div>
  );

  if (ad.href) {
    return (
      <a href={ad.href} target="_blank" rel="noreferrer" className="block">
        {content}
      </a>
    );
  }

  return content;
}
