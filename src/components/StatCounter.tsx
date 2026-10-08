import { useCountUp } from '@/hooks/useCountUp';

export function StatCounter({
  target,
  prefix = '',
  suffix = '',
  label,
}: {
  target: number;
  prefix?: string;
  suffix?: string;
  label: string;
}) {
  const { ref, value } = useCountUp(target);

  return (
    <div className="flex flex-col items-center px-2 text-center sm:px-4">
      <span
        ref={ref}
        className="font-serif text-3xl text-primary sm:text-4xl"
        aria-label={`${prefix}${target}${suffix}`}
      >
        {prefix}
        {value.toLocaleString('en-IN')}
        {suffix}
      </span>
      <span className="mt-1.5 text-xs font-medium tracking-wide text-ink-medium sm:text-sm">
        {label}
      </span>
    </div>
  );
}
