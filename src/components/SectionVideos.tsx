"use client";

// SectionVideos — collapsible panel that surfaces curated videos for the
// current assessment section. Lives inside SectionForm and pulls from the
// central videos.ts catalog (single source of truth across the app).

import { useState } from "react";
import { ChevronDown, Play, ExternalLink } from "lucide-react";
import {
  getSectionVideos,
  getVideoEmbedUrl,
  getVideoThumbnail,
  type VideoResource,
} from "@/lib/modules/videos";
import { useI18n } from "@/i18n/I18nProvider";

interface Props {
  sectionId: string;
}

export function SectionVideos({ sectionId }: Props) {
  const { t } = useI18n();
  const videos = getSectionVideos(sectionId);
  const [open, setOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState<VideoResource | null>(null);

  if (videos.length === 0) return null;

  const toggleLabel =
    videos.length === 1
      ? t("sectionVideos.toggle.one")
      : t("sectionVideos.toggle").replace("{count}", String(videos.length));

  return (
    <div className="mb-5 sm:mb-6 rounded-2xl border border-hive-cream/80 bg-white/70 backdrop-blur overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-3 px-4 sm:px-5 py-3 sm:py-3.5 hover:bg-hive-cream/30 transition"
      >
        <div className="flex items-center gap-2 text-left">
          <Play className="w-4 h-4 text-hive-orange shrink-0" />
          <span className="text-sm font-semibold text-hive-dark">
            {toggleLabel}
          </span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-hive-grey transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-2 space-y-3">
          {videos.map(v => (
            <VideoCard
              key={v.url}
              video={v}
              isActive={activeVideo?.url === v.url}
              onPlay={() => setActiveVideo(v)}
              openLabel={t("sectionVideos.openExternal")}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function VideoCard({
  video,
  isActive,
  onPlay,
  openLabel,
}: {
  video: VideoResource;
  isActive: boolean;
  onPlay: () => void;
  openLabel: string;
}) {
  const embed = getVideoEmbedUrl(video);
  const thumb = getVideoThumbnail(video);

  return (
    <div className="rounded-xl border border-hive-cream/60 bg-white overflow-hidden">
      {isActive && embed ? (
        <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
          <iframe
            src={embed}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>
      ) : (
        <button
          type="button"
          onClick={embed ? onPlay : undefined}
          className="w-full flex gap-3 p-3 text-left hover:bg-hive-cream/20 transition"
        >
          {thumb ? (
            <div className="relative shrink-0 w-28 sm:w-36 aspect-video rounded-lg overflow-hidden bg-hive-cream/40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={thumb} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="w-9 h-9 rounded-full bg-black/50 backdrop-blur flex items-center justify-center">
                  <Play className="w-4 h-4 text-white fill-white" />
                </span>
              </div>
            </div>
          ) : (
            <div className="shrink-0 w-12 h-12 rounded-lg bg-hive-cream/40 flex items-center justify-center">
              <ExternalLink className="w-5 h-5 text-hive-grey" />
            </div>
          )}

          <div className="min-w-0 flex-1 flex flex-col justify-center">
            <div className="flex items-start gap-2">
              <span className="text-sm font-semibold text-hive-dark line-clamp-2">
                {video.title}
              </span>
            </div>
            <p className="mt-1 text-xs text-hive-grey line-clamp-2">{video.why}</p>
            <div className="mt-1 flex items-center gap-2 text-[10px] uppercase tracking-wider text-hive-grey/80">
              <span>{video.source}</span>
              {!embed && (
                <>
                  <span>·</span>
                  <a
                    href={video.url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="text-hive-orange hover:underline"
                  >
                    {openLabel}
                  </a>
                </>
              )}
            </div>
          </div>
        </button>
      )}
    </div>
  );
}
