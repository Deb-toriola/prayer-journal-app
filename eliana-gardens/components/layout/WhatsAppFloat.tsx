'use client';

import { buildWhatsAppUrl } from '@/lib/constants';
import { trackEvent } from '@/lib/analytics';

export function WhatsAppFloat() {
  return (
    <a
      href={buildWhatsAppUrl()}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent('whatsapp_click', { surface: 'float' })}
      aria-label="Chat on WhatsApp"
      className="
        fixed bottom-5 right-5 z-40 group
        flex items-center gap-3
        h-14 pl-4 pr-5
        rounded-full
        bg-[#25D366] text-white
        shadow-[0_10px_30px_-10px_rgba(37,211,102,0.6)]
        transition-all duration-300 ease-out-expo
        hover:-translate-y-0.5 hover:shadow-[0_15px_40px_-10px_rgba(37,211,102,0.8)]
      "
    >
      <svg
        aria-hidden
        viewBox="0 0 32 32"
        className="h-6 w-6"
        fill="currentColor"
      >
        <path d="M16.001 3.2C8.93 3.2 3.2 8.928 3.2 16c0 2.262.595 4.47 1.726 6.41L3.2 28.8l6.555-1.706A12.74 12.74 0 0 0 16 28.8c7.072 0 12.8-5.728 12.8-12.8S23.073 3.2 16.001 3.2zm0 23.36a10.54 10.54 0 0 1-5.376-1.472l-.384-.224-3.892 1.014 1.04-3.798-.25-.39A10.55 10.55 0 1 1 16 26.56zm5.764-7.91c-.314-.158-1.86-.918-2.148-1.024-.288-.106-.498-.158-.708.158-.21.314-.81 1.024-.994 1.234-.184.21-.366.236-.68.08-.314-.158-1.326-.488-2.526-1.558-.933-.832-1.563-1.86-1.745-2.174-.184-.314-.02-.486.138-.642.142-.142.314-.366.472-.55.158-.184.21-.314.314-.524.106-.21.052-.394-.026-.55-.078-.158-.708-1.706-.97-2.336-.255-.614-.515-.532-.708-.54l-.604-.012c-.21 0-.55.08-.838.394-.288.314-1.1 1.074-1.1 2.62 0 1.546 1.124 3.038 1.282 3.248.158.21 2.214 3.382 5.366 4.738.75.324 1.336.518 1.792.664.752.24 1.436.206 1.976.126.604-.09 1.86-.76 2.124-1.494.264-.734.264-1.362.184-1.494-.078-.132-.288-.21-.602-.366z" />
      </svg>
      <span className="text-small font-medium tracking-wide hidden sm:inline">
        Chat with us
      </span>
    </a>
  );
}
