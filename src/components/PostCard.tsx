import { useState } from 'react';
import { motion } from 'framer-motion';
import { BadgeCheck, Heart, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/context/ToastContext';
import { communityPosts } from '@/data/community';
import { Reveal } from '@/components/Reveal';
import { cn } from '@/lib/utils';

export function PostCard({ post, index }: { post: (typeof communityPosts)[number]; index: number }) {
  const { toast } = useToast();
  const [liked, setLiked] = useState(false);
  return (
    <Reveal delay={(index % 3) * 0.1}>
      <article className="gradient-edge flex h-full flex-col overflow-hidden rounded-card border border-gray-100 bg-white shadow-calm transition-all duration-300 hover:-translate-y-2 hover:shadow-bloom">
        <div className={'relative flex h-36 items-center justify-center bg-gradient-to-br ' + post.gradient}>
          <span className="text-5xl" aria-hidden="true">
            {post.emoji}
          </span>
          <span className="absolute bottom-3 left-4 rounded-full bg-white/90 px-2.5 py-0.5 text-[11px] font-semibold text-ink-dark backdrop-blur">
            📍 {post.location}
          </span>
        </div>
        <div className="flex flex-1 flex-col gap-3 p-6">
          <div className="flex items-center gap-2.5">
            <span className={'flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white ' + post.avatarColor} aria-hidden="true">
              {post.initials}
            </span>
            <span className="flex flex-wrap items-center gap-1.5 text-sm font-semibold text-ink-dark">
              {post.user}
              {post.verified && (
                <span className="flex items-center gap-0.5 rounded-full bg-primary-bg px-2 py-0.5 text-[10px] font-bold text-primary">
                  <BadgeCheck className="h-3 w-3" aria-hidden="true" />
                  Verified
                </span>
              )}
            </span>
          </div>
          <p className="text-sm font-light leading-relaxed text-ink-medium">{post.caption}</p>
          {post.hostel && (
            <span className="w-fit rounded-full border border-primary-lighter/60 bg-primary-bg px-2.5 py-1 text-[11px] font-semibold text-primary">
              🏨 Stayed at: {post.hostel}
            </span>
          )}
          <div className="mt-auto flex items-center gap-4 pt-2 text-sm text-ink-medium">
            <button
              type="button"
              onClick={() => {
                setLiked((v) => !v);
                if (!liked) toast('Liked! The traveler feels the love ❤️');
              }}
              aria-pressed={liked}
              aria-label={liked ? 'Unlike this story' : 'Like this story'}
              className="flex min-h-[40px] min-w-[44px] items-center gap-1.5 font-semibold transition hover:text-primary"
            >
              <motion.span animate={liked ? { scale: [1, 1.5, 1] } : {}} transition={{ duration: 0.35 }}>
                <Heart className={cn('h-4 w-4', liked && 'fill-rose-500 text-rose-500')} aria-hidden="true" />
              </motion.span>
              {post.likes + (liked ? 1 : 0)}
            </button>
            <button
              type="button"
              onClick={() => toast('Comments open in the full app — say hi to fellow travelers!')}
              className="flex min-h-[40px] min-w-[44px] items-center gap-1.5 font-semibold transition hover:text-primary"
              aria-label="View comments"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              {post.comments}
            </button>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

export function LikeButton() {
  const { toast } = useToast();
  return (
    <Button variant="ghost" size="sm" onClick={() => toast('Liked!')}>
      Like
    </Button>
  );
}
