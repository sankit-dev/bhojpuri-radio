import { useCallback, useEffect, useRef, useState } from "react";
import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import type { Song } from "../data/playlist";
import { formatAudioTime } from "../utils/time";

interface MusicPlayerProps {
  songs: Song[];
}

function isEditableElement(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  const tagName = target.tagName.toLowerCase();
  return (
    tagName === "input" || tagName === "textarea" || target.isContentEditable
  );
}

export function MusicPlayer({ songs }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [songIndex, setSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const currentSong = songs[songIndex];

  const playCurrent = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    try {
      await audio.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  }, []);

  const pauseCurrent = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    audio.pause();
    setIsPlaying(false);
  }, []);

  const togglePlayback = useCallback(() => {
    if (isPlaying) {
      pauseCurrent();
      return;
    }

    void playCurrent();
  }, [isPlaying, pauseCurrent, playCurrent]);

  const goToPrevious = useCallback(() => {
    setSongIndex((index) => (index - 1 + songs.length) % songs.length);
  }, [songs.length]);

  const goToNext = useCallback(() => {
    setSongIndex((index) => (index + 1) % songs.length);
  }, [songs.length]);

  const seek = (event: React.PointerEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const percentage = Math.min(
      Math.max((event.clientX - rect.left) / rect.width, 0),
      1,
    );
    audio.currentTime = percentage * duration;
    setCurrentTime(audio.currentTime);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    audio.load();
    setCurrentTime(0);
    setDuration(0);

    if (isPlaying) {
      void playCurrent();
    }
  }, [currentSong.src, isPlaying, playCurrent]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isEditableElement(event.target)) {
        return;
      }

      if (event.code === "Space") {
        event.preventDefault();
        togglePlayback();
      }

      if (event.code === "ArrowRight") {
        goToNext();
      }

      if (event.code === "ArrowLeft") {
        goToPrevious();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNext, goToPrevious, togglePlayback]);

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <section className='fixed inset-x-0 bottom-5 z-20 mx-auto w-[calc(100vw-24px)] max-w-[430px] translate-y-3 opacity-0 [animation:player-rise_800ms_ease_260ms_forwards] sm:bottom-[58px] sm:w-[min(430px,calc(100vw-40px))]'>
      <div className='relative grid grid-cols-[56px_minmax(0,1fr)_126px] items-center gap-3 rounded-full border border-white/14 bg-[rgba(156,68,55,0.72)] px-3 py-2.5 text-white shadow-[0_18px_58px_rgba(25,10,6,0.38)] backdrop-blur-[28px] backdrop-saturate-125 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_72px_rgba(25,10,6,0.44)] sm:min-h-[92px] sm:grid-cols-[68px_minmax(0,1fr)_132px] sm:gap-3.5 sm:px-3.5 sm:py-3'>
        <audio
          ref={audioRef}
          preload='metadata'
          src={currentSong.src}
          onEnded={goToNext}
          onLoadedMetadata={(event) =>
            setDuration(event.currentTarget.duration || 0)
          }
          onPause={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
          onTimeUpdate={(event) =>
            setCurrentTime(event.currentTarget.currentTime)
          }
        />

        <img
          className={`h-14 w-14 rounded-full border border-white/20 object-cover shadow-[0_10px_30px_rgba(0,0,0,0.28)] sm:h-[68px] sm:w-[68px] ${
            isPlaying ? "animate-[record-spin_26s_linear_infinite]" : ""
          }`}
          src={currentSong.cover}
          alt=''
        />

        <div className='min-w-0 pr-0'>
          <div className='flex min-w-0 items-baseline gap-3'>
            <h1 className='truncate text-[13px] font-semibold leading-5 sm:text-[14px]'>
              {currentSong.title}
            </h1>
            {currentSong.year ? (
              <span className='hidden text-xs text-white/50 sm:inline'>
                {currentSong.year}
              </span>
            ) : null}
          </div>
          <p className='mt-0.5 truncate text-[10px] leading-4 text-white/68 sm:text-[11px]'>
            {currentSong.artist}
          </p>

          <div className='mt-3 grid grid-cols-1 items-center text-[11px] tabular-nums text-white/68'>
            <div
              className='group relative h-4 cursor-pointer touch-none'
              onPointerDown={seek}
              role='slider'
              aria-label='Seek'
              aria-valuemin={0}
              aria-valuemax={Math.floor(duration || 0)}
              aria-valuenow={Math.floor(currentTime || 0)}
              tabIndex={0}
            >
              <div className='absolute left-0 top-1/2 h-[3px] w-full -translate-y-1/2 rounded-full bg-white/22'>
                <div
                  className='h-full rounded-full bg-white transition-[width] duration-100'
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <span className='-mt-1 text-[10px] text-white/48'>
              {formatAudioTime(currentTime)} / {formatAudioTime(duration)}
            </span>
          </div>
        </div>

        <div className='flex items-center justify-end gap-1 sm:gap-1.5'>
          <button
            className='grid h-8 w-8 place-items-center rounded-full text-white/82 transition duration-200 hover:scale-[1.04] hover:text-white focus:outline-none focus:ring-2 focus:ring-white/40'
            type='button'
            aria-label='Previous song'
            onClick={goToPrevious}
          >
            <SkipBack className='h-3.5 w-3.5' aria-hidden='true' />
          </button>
          <button
            className='grid h-10 w-10 place-items-center rounded-full bg-white text-stone-950 shadow-[0_8px_22px_rgba(0,0,0,0.24)] transition duration-200 hover:scale-[1.04] focus:outline-none focus:ring-2 focus:ring-white/55 sm:h-11 sm:w-11'
            type='button'
            aria-label={isPlaying ? "Pause" : "Play"}
            onClick={togglePlayback}
          >
            {isPlaying ? (
              <Pause
                className='h-4.5 w-4.5'
                fill='currentColor'
                aria-hidden='true'
              />
            ) : (
              <Play
                className='ml-0.5 h-4.5 w-4.5'
                fill='currentColor'
                aria-hidden='true'
              />
            )}
          </button>
          <button
            className='grid h-8 w-8 place-items-center rounded-full text-white/82 transition duration-200 hover:scale-[1.04] hover:text-white focus:outline-none focus:ring-2 focus:ring-white/40'
            type='button'
            aria-label='Next song'
            onClick={goToNext}
          >
            <SkipForward className='h-3.5 w-3.5' aria-hidden='true' />
          </button>
        </div>
      </div>
    </section>
  );
}
