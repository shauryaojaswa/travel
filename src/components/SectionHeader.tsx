import { Badge } from '@/components/ui/badge';
import { Reveal } from '@/components/Reveal';

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <Reveal className="mx-auto max-w-3xl text-center">
      <Badge className="mb-5">{eyebrow}</Badge>
      <h2 className="text-display-lg">{title}</h2>
      {subtitle && (
        <p className="mx-auto mt-5 max-w-2xl text-base font-light leading-relaxed text-ink-medium sm:text-lg">
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}
