import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="min-h-[80svh] bg-forest text-bone flex items-center">
      <div className="shell">
        <p className="eyebrow text-gold-200">404 · Not found</p>
        <h1 className="mt-5 font-display text-h1 text-bone">
          That page doesn&rsquo;t exist.
        </h1>
        <p className="mt-6 max-w-reading text-body-lg text-bone/85">
          The link you followed may be broken, or the page may have moved.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link href="/" className="btn-primary">Return home</Link>
          <Link href="/#inspection" className="btn-ghost-light">Book inspection</Link>
        </div>
      </div>
    </section>
  );
}
