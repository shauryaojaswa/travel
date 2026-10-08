import { useState } from 'react';
import { motion } from 'framer-motion';
import { PenLine, Send } from 'lucide-react';
import { SectionHeader } from '@/components/SectionHeader';
import { Reveal } from '@/components/Reveal';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/Modal';
import { PostCard } from '@/components/PostCard';
import { GuideCard, MeetupCard } from '@/components/CommunityCards';
import { useToast } from '@/context/ToastContext';
import { usePageMeta } from '@/hooks/usePageMeta';
import { achievements, communityPosts, localGuides, meetups } from '@/data/community';
import { cn } from '@/lib/utils';

function Composer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { toast } = useToast();
  const [text, setText] = useState('');
  return (
    <Modal open={open} onClose={onClose} labelledBy="composer-title">
      <div className="p-6 sm:p-8">
        <h2 id="composer-title" className="font-serif text-2xl text-ink-dark">
          Share your story
        </h2>
        <p className="mt-2 text-sm font-light text-ink-medium">
          A hidden stall, a sunrise run, a hostel hack — the community wants it.
        </p>
        <label htmlFor="composer-text" className="mb-1.5 mt-5 block text-xs font-semibold uppercase tracking-wider text-ink-light">
          Your story
        </label>
        <textarea
          id="composer-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          maxLength={280}
          placeholder="Found a sunset spot nobody knows about…"
          className="calm-input min-h-[120px] resize-y"
        />
        <p className="mt-1.5 text-right text-[11px] text-ink-light">{text.length}/280</p>
        <div className="mt-4 flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="flex-1"
            onClick={() => {
              if (text.trim().length < 10) {
                toast('Give your story a little more love (10+ characters)');
                return;
              }
              toast('Story shared with the community 🎉');
              setText('');
              onClose();
            }}
          >
            <Send className="h-4 w-4" aria-hidden="true" />
            Post Story
          </Button>
        </div>
      </div>
    </Modal>
  );
}

const trustItems = [
  { emoji: '🛡️', title: 'Verified Hostels Only', body: 'Every hostel is personally visited and verified.' },
  { emoji: '🔒', title: 'Secure Escrow Payments', body: 'Your money is held safely until check-in.' },
  { emoji: '📞', title: '24/7 Emergency Support', body: 'Helpline: 1800-CALM-DEL (toll-free, always answered).' },
  { emoji: '⚖️', title: 'Fair Pricing Guarantee', body: '7-9% commission. No hidden fees. Ever.' },
  { emoji: '🗣️', title: 'Community Reviews', body: 'Real reviews from verified travelers only.' },
];

export default function Community() {
  usePageMeta(
    'Community',
    'Delhi Calm Travel community: traveler stories, local guides, meetups, trust & safety, and achievements.',
  );
  const [composerOpen, setComposerOpen] = useState(false);

  return (
    <section className="px-5 pb-24 pt-32 sm:px-8 sm:pt-36">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Community"
          title="The Calm Community"
          subtitle="Travel is better together. Stories, local guides, and meetups — even when you're not traveling."
        />

        <div className="mt-12 flex items-end justify-between gap-4">
          <h2 className="font-serif text-2xl text-ink-dark sm:text-3xl">📸 Delhi Traveler Feed</h2>
          <Button variant="soft" onClick={() => setComposerOpen(true)}>
            <PenLine className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Share Your Story</span>
            <span className="sm:hidden">Share</span>
          </Button>
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {communityPosts.map((post, i) => (
            <PostCard key={post.id} post={post} index={i} />
          ))}
        </div>
        {/* __SECTIONS__ */}
        <h2 className="mt-24 font-serif text-2xl text-ink-dark sm:text-3xl">🧭 Local Guides & Hosts</h2>
        <p className="mt-2 max-w-2xl text-sm font-light text-ink-medium sm:text-base">
          Book straight from the people who know Delhi best. Verified IDs, escrow payments, real reviews.
        </p>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {localGuides.map((g, i) => (
            <GuideCard key={g.id} guide={g} index={i} />
          ))}
        </div>

        <h2 className="mt-24 font-serif text-2xl text-ink-dark sm:text-3xl">🎉 Upcoming Meetups & Events</h2>
        <p className="mt-2 max-w-2xl text-sm font-light text-ink-medium sm:text-base">
          Run clubs, art walks, food crawls, cowork days. Show up solo, leave with friends.
        </p>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {meetups.map((m, i) => (
            <MeetupCard key={m.id} meetup={m} index={i} />
          ))}
        </div>
        {/* __TRUST__ */}
        <h2 className="mt-24 font-serif text-2xl text-ink-dark sm:text-3xl">🛡️ Safety & Trust Center</h2>
        <div className="glass mt-6 grid gap-4 rounded-card p-6 shadow-calm sm:grid-cols-2 sm:p-8 lg:grid-cols-3">
          {trustItems.map((t) => (
            <Reveal key={t.title}>
              <div className="h-full rounded-2xl border border-gray-100 bg-white p-5">
                <p className="text-2xl" aria-hidden="true">
                  {t.emoji}
                </p>
                <h3 className="mt-2 font-serif text-lg text-ink-dark">{t.title}</h3>
                <p className="mt-1 text-sm font-light text-ink-medium">{t.body}</p>
              </div>
            </Reveal>
          ))}
          <Reveal>
            <div className="h-full rounded-2xl bg-primary p-5 text-white">
              <p className="text-2xl" aria-hidden="true">
                📞
              </p>
              <h3 className="mt-2 font-serif text-lg">Emergency? We're here.</h3>
              <p className="mt-1 text-sm font-light text-white/85">
                24/7 helpline, on-ground buddies in Paharganj & Hauz Khas, and instant trip freeze.
              </p>
            </div>
          </Reveal>
        </div>

        <h2 className="mt-24 font-serif text-2xl text-ink-dark sm:text-3xl">🏅 Your Achievements</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {achievements.map((a) => (
            <div
              key={a.id}
              className={cn(
                'rounded-card border p-5 text-center shadow-calm transition-all duration-300 hover:-translate-y-1',
                a.status === 'unlocked'
                  ? 'border-primary-lighter bg-primary-bg'
                  : 'border-gray-100 bg-white opacity-80',
              )}
            >
              <p className={cn('text-3xl', a.status === 'locked' && 'opacity-40 grayscale')} aria-hidden="true">
                {a.emoji}
              </p>
              <p className="mt-2 text-xs font-bold leading-tight text-ink-dark">{a.title}</p>
              <p className={cn('mt-1 text-[11px] font-semibold', a.status === 'unlocked' ? 'text-primary' : 'text-ink-light')}>
                {a.status === 'unlocked' ? '✓ ' : ''}
                {a.note}
              </p>
            </div>
          ))}
        </div>

        <Composer open={composerOpen} onClose={() => setComposerOpen(false)} />

        {!composerOpen && (
          <motion.button
            type="button"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => setComposerOpen(true)}
            aria-label="Share your story"
            className="fixed bottom-24 right-6 z-40 flex h-14 items-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-white shadow-bloom transition-transform hover:scale-105"
          >
            <PenLine className="h-4 w-4" aria-hidden="true" />
            Share
          </motion.button>
        )}
      </div>
    </section>
  );
}
