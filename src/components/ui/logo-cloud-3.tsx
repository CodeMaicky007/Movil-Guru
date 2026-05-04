'use client';
import { InfiniteSlider } from '@/components/ui/infinite-slider';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

type Logo = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
};

type LogoCloudProps = React.ComponentProps<'div'> & {
  logos: Logo[];
};

function LogoCloud({ className, logos, ...props }: LogoCloudProps) {
  return (
    <div
      {...props}
      className={cn(
        'overflow-hidden py-4 [mask-image:linear-gradient(to_right,transparent,black,transparent)]',
        className
      )}
    >
      <InfiniteSlider gap={56} speed={60} speedOnHover={20}>
        {logos.map((logo) => (
          <img
            alt={logo.alt}
            className="pointer-events-none h-8 select-none object-contain md:h-10 opacity-80 hover:opacity-100 transition-opacity duration-300"
            height={logo.height ?? 40}
            key={`logo-${logo.alt}`}
            loading="lazy"
            src={logo.src}
            width={logo.width ?? 'auto'}
          />
        ))}
      </InfiniteSlider>
    </div>
  );
}

const BRAND_LOGOS: Logo[] = [
  { src: '/images/Apple.png',        alt: 'Apple',       height: 40 },
  { src: '/images/Samsung.png',      alt: 'Samsung',     height: 40 },
  { src: '/images/Xiaomi.png',       alt: 'Xiaomi',      height: 40 },
  { src: '/images/GooglePixel.png',  alt: 'Google Pixel',height: 40 },
  { src: '/images/huawei.png',       alt: 'Huawei',      height: 40 },
  { src: '/images/oneplus.png',      alt: 'OnePlus',     height: 40 },
];

export function BrandLogoCloud() {
  return (
    <section
      className="relative w-full bg-white py-16 px-4"
      style={{ borderTop: '1px solid rgba(0,56,255,0.08)' }}
    >
      <motion.div
        className="mx-auto max-w-3xl text-center mb-10"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <p
          className="text-[10px] font-black uppercase tracking-[0.4em] mb-3"
          style={{ color: '#0038FF' }}
        >
          ◆ Marcas que reparamos
        </p>
        <h2
          className="text-3xl md:text-4xl font-black uppercase leading-tight tracking-[-0.03em]"
          style={{ color: '#0A1F3A' }}
        >
          Expertos en{' '}
          <span style={{ color: '#0038FF' }}>todas</span> las marcas.
          <span style={{ color: '#CCFF00' }}> Sin excepción.</span>
        </h2>
        <div className="mx-auto mt-5 h-px max-w-sm [mask-image:linear-gradient(to_right,transparent,black,transparent)]" style={{ background: '#CCFF00' }} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <LogoCloud logos={BRAND_LOGOS} />
      </motion.div>

      <div className="mx-auto mt-6 h-px max-w-sm [mask-image:linear-gradient(to_right,transparent,black,transparent)]" style={{ background: 'rgba(0,56,255,0.15)' }} />
    </section>
  );
}
