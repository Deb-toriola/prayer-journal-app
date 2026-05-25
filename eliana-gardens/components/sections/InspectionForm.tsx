'use client';

import { useState } from 'react';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/ui/Reveal';
import { buildWhatsAppUrl } from '@/lib/constants';
import { trackEvent } from '@/lib/analytics';

type Status = 'idle' | 'submitting' | 'success' | 'error';

export function InspectionForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setStatus('submitting');

    const fd = new FormData(e.currentTarget);
    // Honeypot — real users will not fill this field
    if ((fd.get('company') as string)?.trim()) {
      setStatus('success'); // silently no-op
      return;
    }

    const payload = {
      fullName: (fd.get('fullName') as string)?.trim(),
      phone: (fd.get('phone') as string)?.trim(),
      email: ((fd.get('email') as string) || '').trim() || undefined,
      preferredDate: fd.get('preferredDate') as string,
      preferredTimeSlot: fd.get('preferredTimeSlot') as 'morning' | 'afternoon',
      message: ((fd.get('message') as string) || '').trim() || undefined,
    };

    try {
      const res = await fetch('/api/inspection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Submission failed');
      setStatus('success');
      trackEvent('inspection_lead', { surface: 'form' });

      const msg = [
        `Hi Eliana Gardens — I just booked a site inspection.`,
        `Name: ${payload.fullName}`,
        `Phone: ${payload.phone}`,
        `Date: ${payload.preferredDate} (${payload.preferredTimeSlot})`,
        payload.message ? `Note: ${payload.message}` : '',
      ].filter(Boolean).join('\n');

      window.setTimeout(() => {
        window.open(buildWhatsAppUrl(msg), '_blank', 'noopener,noreferrer');
      }, 1200);
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Something went wrong');
    }
  }

  return (
    <section id="inspection" className="relative bg-bone-50 py-section-y-lg">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Lede */}
          <Reveal className="lg:col-span-5">
            <Eyebrow tone="forest">09 · Site Inspection</Eyebrow>
            <h2 className="mt-5 font-display text-h2 text-forest">
              See it for yourself.{' '}
              <span className="italic">Free, guided, no pressure.</span>
            </h2>
            <p className="mt-7 max-w-reading text-body-lg text-ink-soft">
              We encourage every prospective buyer to walk the land before
              deciding. Your inspection includes a guided estate tour, a look
              at surrounding developments, an accessibility assessment, and a
              no-pressure investment consultation.
            </p>
            <ul className="mt-8 space-y-3 text-body text-ink-soft">
              <li className="flex items-baseline gap-3"><span className="text-gold">+</span> Free and obligation-free</li>
              <li className="flex items-baseline gap-3"><span className="text-gold">+</span> Choose a date and time that suits you</li>
              <li className="flex items-baseline gap-3"><span className="text-gold">+</span> Our team handles directions and meeting arrangements</li>
            </ul>
          </Reveal>

          {/* Form */}
          <Reveal delay={140} className="lg:col-span-7">
            {status === 'success' ? (
              <SuccessState />
            ) : (
              <form onSubmit={onSubmit} className="relative bg-forest p-7 text-bone md:p-10">
                <div aria-hidden className="pointer-events-none absolute inset-0 bg-noise opacity-[0.05] mix-blend-overlay" />
                <p className="font-display text-h4">Book your inspection</p>
                <p className="mt-1 text-small text-bone/70">Takes under a minute.</p>

                {/* Honeypot — hidden from users */}
                <div className="absolute -left-[9999px]" aria-hidden>
                  <label>Company<input name="company" tabIndex={-1} autoComplete="off" /></label>
                </div>

                <div className="mt-8 grid gap-5 md:grid-cols-2">
                  <Field name="fullName" label="Full name" required autoComplete="name" />
                  <Field name="phone" label="Phone (WhatsApp)" required type="tel" autoComplete="tel" inputMode="tel" />
                  <Field name="email" label="Email (optional)" type="email" autoComplete="email" inputMode="email" />
                  <Field name="preferredDate" label="Preferred date" required type="date" />
                  <div className="md:col-span-2">
                    <SelectField
                      name="preferredTimeSlot"
                      label="Preferred time"
                      required
                      options={[
                        { value: 'morning', label: 'Morning (9am – 12pm)' },
                        { value: 'afternoon', label: 'Afternoon (1pm – 4pm)' },
                      ]}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <TextareaField name="message" label="Message / number of plots of interest (optional)" rows={3} />
                  </div>
                </div>

                {error && (
                  <p role="alert" className="mt-5 text-small text-gold-200">
                    {error}. Please try again or message us directly on WhatsApp.
                  </p>
                )}

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-micro text-bone/60">
                    By submitting, you agree to be contacted about your inspection.
                  </p>
                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="btn-primary w-full sm:w-auto disabled:cursor-wait disabled:opacity-70"
                  >
                    {status === 'submitting' ? 'Sending…' : 'Book Inspection'}
                  </button>
                </div>
              </form>
            )}
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

function SuccessState() {
  return (
    <div className="bg-forest p-10 text-bone md:p-14">
      <p className="eyebrow text-gold-200">Confirmed</p>
      <p className="mt-4 font-display text-h3">Thank you. We&rsquo;ll be in touch shortly.</p>
      <p className="mt-4 max-w-reading text-body-lg text-bone/85">
        Your inspection request has been received. Opening WhatsApp now so our
        team can confirm logistics directly — if it doesn&rsquo;t open
        automatically, use the floating button at the bottom-right of the page.
      </p>
    </div>
  );
}

interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
}

function Field({ name, label, type = 'text', required, ...rest }: FieldProps) {
  return (
    <label className="block">
      <span className="block text-micro uppercase tracking-[0.14em] text-bone/70">
        {label}{required && <span className="ml-1 text-gold-200">*</span>}
      </span>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="
          mt-2 block w-full bg-transparent border-0 border-b border-bone/30
          px-0 py-2.5 text-body text-bone
          placeholder:text-bone/40
          focus:border-gold focus:outline-none focus:ring-0
          transition-colors
        "
        {...rest}
      />
    </label>
  );
}

function SelectField({
  name, label, options, required,
}: {
  name: string; label: string; required?: boolean;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block">
      <span className="block text-micro uppercase tracking-[0.14em] text-bone/70">
        {label}{required && <span className="ml-1 text-gold-200">*</span>}
      </span>
      <select
        id={name}
        name={name}
        required={required}
        defaultValue=""
        className="
          mt-2 block w-full bg-transparent border-0 border-b border-bone/30
          px-0 py-2.5 text-body text-bone
          focus:border-gold focus:outline-none focus:ring-0
        "
      >
        <option value="" disabled className="text-ink">Select a time slot…</option>
        {options.map((o) => (
          <option key={o.value} value={o.value} className="text-ink">{o.label}</option>
        ))}
      </select>
    </label>
  );
}

function TextareaField({
  name, label, rows = 4,
}: { name: string; label: string; rows?: number }) {
  return (
    <label className="block">
      <span className="block text-micro uppercase tracking-[0.14em] text-bone/70">{label}</span>
      <textarea
        id={name}
        name={name}
        rows={rows}
        className="
          mt-2 block w-full bg-transparent border-0 border-b border-bone/30
          px-0 py-2.5 text-body text-bone
          placeholder:text-bone/40
          focus:border-gold focus:outline-none focus:ring-0
          resize-none
        "
      />
    </label>
  );
}
