interface AudioVisualizerProps {
  isPlaying: boolean
  barCount?: number
}

export function AudioVisualizer({ isPlaying, barCount = 4 }: AudioVisualizerProps) {
  return (
    <div className="flex items-end gap-[2px] h-3.5 px-1 py-0.5" aria-hidden="true">
      {Array.from({ length: barCount }).map((_, index) => {
        // Different heights and animation delays for realistic equalizer look
        const delays = ['0ms', '160ms', '320ms', '80ms', '240ms']
        const heights = ['h-3', 'h-2', 'h-3.5', 'h-2.5', 'h-3']
        const delay = delays[index % delays.length]
        const baseHeight = heights[index % heights.length]

        return (
          <span
            key={index}
            className={`w-[2.5px] rounded-full bg-emerald-400/90 transition-all duration-300 ${
              isPlaying
                ? `${baseHeight} animate-[pulse_0.75s_ease-in-out_infinite] [animation-delay:${delay}] shadow-[0_0_8px_rgba(52,211,153,0.7)]`
                : 'h-[3px] opacity-40'
            }`}
          />
        )
      })}
    </div>
  )
}
