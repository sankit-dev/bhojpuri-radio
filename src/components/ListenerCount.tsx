interface ListenerCountProps {
  count: number
}

export function ListenerCount({ count }: ListenerCountProps) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.75)]" />
      {count} online
    </span>
  )
}
