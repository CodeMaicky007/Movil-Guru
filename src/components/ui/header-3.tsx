'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MenuToggleIcon } from '@/components/ui/menu-toggle-icon';
import { createPortal } from 'react-dom';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { type LucideIcon } from 'lucide-react';
import {
  Smartphone,
  Battery,
  Droplets,
  Camera,
  PlugIcon,
  LayersIcon,
  Database,
  Cpu,
  Users,
  Star,
  Shield,
  FileText,
  RotateCcw,
  Leaf,
  HelpCircle,
  Briefcase,
  User as UserIcon,
  LogIn,
  UserPlus,
  Wrench,
  LogOut,
  Store,
  Phone,
} from 'lucide-react';

type LinkItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  description?: string;
  logoSrc?: string;
};

export function Header({ dark = false, transparent = false }: { dark?: boolean; transparent?: boolean }) {
  const [open, setOpen] = React.useState(false);
  const [showMoreBrands, setShowMoreBrands] = React.useState(false);
  const [mobileBrandsOpen, setMobileBrandsOpen] = React.useState(false);
  const scrolled = useScroll(10);
  const router = useRouter();

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 mx-auto w-full max-w-6xl border-b border-transparent lg:rounded-full lg:border lg:border-transparent lg:transition-all lg:duration-300 lg:ease-out',
        !dark && !scrolled && !open ? 'bg-white' : '',
        {
          'bg-background/95 supports-[backdrop-filter]:bg-background/50 border-border backdrop-blur-lg lg:top-4 lg:max-w-5xl lg:shadow lg:rounded-full':
            scrolled && !open,
          'bg-transparent': dark && !scrolled && !open,
          'bg-background/90': open && !dark,
          'bg-[#060d12]/95': open && dark,
        }
      )}
    >
      <nav className={cn('flex h-14 w-full items-center justify-between px-4 lg:transition-all lg:duration-300 lg:ease-out', (dark && !scrolled) ? 'text-white' : 'text-black', scrolled && 'lg:px-2')} style={{ fontFamily: "var(--font-display), sans-serif" }}>
        <div className="flex items-center gap-5">
          <Link href="/" className={cn('rounded-md px-2 py-1 flex items-center gap-1.5', (dark && !scrolled) ? 'hover:bg-white/10' : 'hover:bg-accent')}>
            <div className={cn('font-black text-xs px-2.5 py-1 rounded-xl rounded-bl-sm', (dark && !scrolled) ? 'bg-[#080e14] text-white border border-white/20' : 'bg-foreground text-background')}>
              MOVIL
            </div>
            <div className="bg-[#CCFF00] text-black font-black text-xs px-2.5 py-1 rounded-full border border-foreground/10">
              GURU
            </div>
          </Link>
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className={cn('bg-transparent', (dark && !scrolled) && 'text-white hover:bg-white/10 hover:text-white data-[state=open]:bg-white/10')}
                  onClick={() => router.push('/marcas')}
                >
                  Marcas
                </NavigationMenuTrigger>
                <NavigationMenuContent className="bg-background p-1 pr-1.5">
                  <div style={{ width: 560 }}>
                    <ul className="bg-popover grid grid-cols-2 gap-2 rounded-md border p-2 shadow">
                      {primaryBrandLinks.map((item, i) => (
                        <li key={i}>
                          <ListItem {...item} />
                        </li>
                      ))}
                    </ul>

                    {/* Más marcas toggle */}
                    <div className="px-2 pt-2">
                      <button
                        onClick={() => setShowMoreBrands((v) => !v)}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-accent transition-colors text-sm font-semibold text-muted-foreground hover:text-foreground"
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-xs font-black uppercase tracking-widest text-[#0038FF]">
                            {showMoreBrands ? '▲' : '▼'}
                          </span>
                          {showMoreBrands ? 'Menos marcas' : 'Más marcas — LG · Nokia · Vivo · HTC · BQ · Meizu · Asus'}
                        </span>
                      </button>

                      {/* Extra brands — animated reveal */}
                      <div
                        style={{
                          overflow: 'hidden',
                          maxHeight: showMoreBrands ? 999 : 0,
                          opacity: showMoreBrands ? 1 : 0,
                          transition: 'max-height 0.35s cubic-bezier(0.16,1,0.3,1), opacity 0.25s ease',
                        }}
                      >
                        <ul className="bg-popover grid grid-cols-2 gap-2 rounded-md border p-2 shadow mt-2">
                          {extraBrandLinks.map((item, i) => (
                            <li key={i}>
                              <ListItem {...item} />
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="p-2 pt-1">
                      <p className="text-muted-foreground text-sm">
                        <Link
                          href="/marcas"
                          className="text-foreground font-medium hover:underline"
                        >
                          Ver todas las marcas →
                        </Link>
                      </p>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className={cn('bg-transparent', (dark && !scrolled) && 'text-white hover:bg-white/10 hover:text-white data-[state=open]:bg-white/10')}>
                  Nosotros
                </NavigationMenuTrigger>
                <NavigationMenuContent className="bg-background p-1 pr-1.5 pb-1.5">
                  <div className="grid w-[500px] grid-cols-2 gap-2">
                    <ul className="bg-popover space-y-2 rounded-md border p-2 shadow">
                      {companyLinks.map((item, i) => (
                        <li key={i}>
                          <ListItem {...item} />
                        </li>
                      ))}
                    </ul>
                    <ul className="space-y-2 p-3">
                      {companyLinks2.map((item, i) => (
                        <li key={i}>
                          <NavigationMenuLink
                            href={item.href}
                            className="flex p-2 hover:bg-accent flex-row rounded-md items-center gap-x-2"
                          >
                            <item.icon className="text-foreground size-4" />
                            <span className="font-medium">{item.title}</span>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuLink className="px-4" asChild>
                <Link href="/tiendas" className={cn('rounded-md p-2 flex items-center gap-1.5', (dark && !scrolled) ? 'text-white hover:bg-white/10' : 'hover:bg-accent')}>
                  <Store className="size-3.5" />
                  Tiendas
                </Link>
              </NavigationMenuLink>
              <NavigationMenuLink className="px-4" asChild>
                <Link href="/tienda" className={cn('rounded-md p-2 font-semibold flex items-center gap-1.5', (dark && !scrolled) ? 'text-[#CCFF00] hover:bg-white/10' : 'text-[#0038FF] hover:bg-accent')}>
                  <span className="size-1.5 rounded-full bg-[#CCFF00] shadow-[0_0_6px_#CCFF00]" />
                  Tienda
                </Link>
              </NavigationMenuLink>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="hidden items-center gap-2 lg:flex">
          <ProfileMenu dark={(dark || transparent) && !scrolled} />
          <Link href="/tienda/carrito" className={cn('relative flex items-center justify-center size-9 rounded-full border transition-all', (dark && !scrolled) ? 'border-white/15 text-white hover:border-[#CCFF00]/60 hover:bg-[#CCFF00]/10' : 'border-foreground/10 hover:border-foreground/30')} aria-label="Carrito">
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
          </Link>
          <Button asChild className="rounded-full bg-[#CCFF00] text-black border-[#CCFF00] hover:bg-[#b8e600] hover:text-black font-semibold"><Link href="/track">Rastrear Reparación</Link></Button>
        </div>
        <Button
          size="icon"
          variant="outline"
          onClick={() => setOpen(!open)}
          className={cn('lg:hidden', (dark && !scrolled) && 'border-white/30 text-white hover:bg-white/10 hover:text-white')}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label="Toggle menu"
        >
          <MenuToggleIcon open={open} className="size-5" duration={300} />
        </Button>
      </nav>
      <MobileMenu
        open={open}
        className="flex flex-col justify-between gap-2 overflow-y-auto"
      >
        <NavigationMenu className="max-w-full">
          <div className="flex w-full flex-col gap-y-2">
            <Link href="/tienda" className="flex items-center gap-2 font-black text-sm text-[#0038FF] uppercase tracking-wide px-2 py-2 rounded-lg bg-[#CCFF00]/10 hover:bg-[#CCFF00]/20 transition-colors">
              <span className="size-1.5 rounded-full bg-[#CCFF00] shadow-[0_0_6px_#CCFF00]" />
              Tienda
            </Link>
            <Link href="/tiendas" className="flex items-center gap-2 text-sm px-2 py-2 rounded-lg hover:bg-accent transition-colors">
              <Store className="size-4" />
              Tiendas
            </Link>

            {/* Marcas collapsible */}
            <button
              onClick={() => setMobileBrandsOpen(!mobileBrandsOpen)}
              className="flex items-center justify-between text-sm font-medium px-2 py-2 rounded-lg hover:bg-accent transition-colors w-full"
            >
              <span>Marcas</span>
              <svg className={`size-4 transition-transform ${mobileBrandsOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
            {mobileBrandsOpen && (
              <div className="flex flex-col gap-1 pl-2">
                {productLinks.map((link) => (
                  <ListItem key={link.title} {...link} />
                ))}
              </div>
            )}

            <span className="text-sm">Nosotros</span>
            {companyLinks.map((link) => (
              <ListItem key={link.title} {...link} />
            ))}
            {companyLinks2.map((link) => (
              <ListItem key={link.title} {...link} />
            ))}
            <span className="text-sm">Cuenta</span>
            {accountLinks.map((link) => (
              <ListItem key={link.title} {...link} />
            ))}
          </div>
        </NavigationMenu>
        <div className="flex flex-col gap-2">
          <Button className="w-full rounded-full bg-[#CCFF00] text-black border-[#CCFF00] hover:bg-[#b8e600] hover:text-black font-semibold" asChild>
            <Link href="/track">Rastrear Reparación</Link>
          </Button>
        </div>
      </MobileMenu>
    </header>
  );
}

type MobileMenuProps = React.ComponentProps<'div'> & { open: boolean };

function MobileMenu({ open, children, className, ...props }: MobileMenuProps) {
  if (!open || typeof window === 'undefined') return null;
  return createPortal(
    <div
      id="mobile-menu"
      className={cn(
        'bg-background/95 supports-[backdrop-filter]:bg-background/50 backdrop-blur-lg',
        'fixed top-14 right-0 bottom-0 left-0 z-40 flex flex-col overflow-hidden border-y lg:hidden'
      )}
    >
      <div
        data-slot={open ? 'open' : 'closed'}
        className={cn(
          'data-[slot=open]:animate-in data-[slot=open]:zoom-in-97 ease-out',
          'size-full p-4',
          className
        )}
        style={{ fontFamily: "var(--font-display), sans-serif" }}
        {...props}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}

function ListItem({
  title,
  description,
  icon: Icon,
  logoSrc,
  className,
  href,
  ...props
}: React.ComponentProps<typeof NavigationMenuLink> & LinkItem) {
  return (
    <NavigationMenuLink
      className={cn(
        'w-full flex flex-row gap-x-2 data-[active=true]:focus:bg-accent data-[active=true]:hover:bg-accent data-[active=true]:bg-accent/50 data-[active=true]:text-accent-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground rounded-sm p-2',
        className
      )}
      {...props}
      asChild
    >
      <Link href={href}>
        <div className="bg-background/40 flex aspect-square size-12 items-center justify-center rounded-md border shadow-sm">
          {logoSrc
            ? <img src={logoSrc} alt={title} className="size-6 object-contain" />
            : <Icon className="text-foreground size-5" />
          }
        </div>
        <div className="flex flex-col items-start justify-center">
          <span className="font-medium">{title}</span>
          <span className="text-muted-foreground text-xs">{description}</span>
        </div>
      </Link>
    </NavigationMenuLink>
  );
}

const primaryBrandLinks: LinkItem[] = [
  {
    title: 'iPhone',
    href: '/reparacion/iphone',
    description: 'iPhone 4 al 16 Pro Max · Garantía de por vida',
    icon: Smartphone,
    logoSrc: '/images/Apple.png',
  },
  {
    title: 'Samsung Galaxy',
    href: '/reparacion/samsung',
    description: 'Galaxy S, A, Z Fold y Flip · Mismo día',
    icon: Smartphone,
    logoSrc: '/images/Samsung.png',
  },
  {
    title: 'Xiaomi',
    href: '/reparacion/xiaomi',
    description: 'Xiaomi · Redmi · POCO · Diagnóstico gratis',
    icon: Smartphone,
    logoSrc: '/images/Xiaomi.png',
  },
  {
    title: 'Huawei',
    href: '/reparacion/huawei',
    description: 'P, Mate, Nova series · Presupuesto gratis',
    icon: Smartphone,
    logoSrc: '/images/huawei.png',
  },
  {
    title: 'Google Pixel',
    href: '/reparacion/pixel',
    description: 'Pixel 6 al 9 Pro Fold · Garantía incluida',
    icon: Smartphone,
    logoSrc: '/images/GooglePixel.png',
  },
  {
    title: 'OnePlus',
    href: '/reparacion/oneplus',
    description: 'OnePlus 9 al 13 · Nord series · Técnicos certificados',
    icon: Smartphone,
    logoSrc: '/images/oneplus.png',
  },
  {
    title: 'Sony Xperia',
    href: '/reparacion/sony',
    description: 'Xperia 1, 5 y 10 series · Mismo día',
    icon: Smartphone,
    logoSrc: 'https://www.google.com/s2/favicons?domain=sony.com&sz=64',
  },
  {
    title: 'Motorola',
    href: '/reparacion/motorola',
    description: 'Razr 40, 40 Ultra, 50, 50 Ultra · Plegables',
    icon: Smartphone,
    logoSrc: 'https://www.google.com/s2/favicons?domain=motorola.com&sz=64',
  },
];

const extraBrandLinks: LinkItem[] = [
  {
    title: 'LG',
    href: '/reparacion/lg',
    description: 'G, V, Q y K series · Presupuesto gratis',
    icon: Smartphone,
    logoSrc: 'https://www.google.com/s2/favicons?domain=lg.com&sz=64',
  },
  {
    title: 'Nokia',
    href: '/reparacion/nokia',
    description: 'G, C, X y XR series · Garantía incluida',
    icon: Smartphone,
    logoSrc: 'https://www.google.com/s2/favicons?domain=nokia.com&sz=64',
  },
  {
    title: 'Vivo',
    href: '/reparacion/vivo',
    description: 'X, V e Y series · Mismo día',
    icon: Smartphone,
    logoSrc: 'https://www.google.com/s2/favicons?domain=vivo.com&sz=64',
  },
  {
    title: 'HTC',
    href: '/reparacion/htc',
    description: 'U, One y Desire series · Garantía incluida',
    icon: Smartphone,
    logoSrc: 'https://www.google.com/s2/favicons?domain=htc.com&sz=64',
  },
  {
    title: 'BQ Aquaris',
    href: '/reparacion/bq',
    description: 'Aquaris X, V, U y M series · Diagnóstico gratis',
    icon: Smartphone,
    logoSrc: 'https://www.google.com/s2/favicons?domain=bq.com&sz=64',
  },
  {
    title: 'Meizu',
    href: '/reparacion/meizu',
    description: 'Meizu 16–21 · Pro · MX series',
    icon: Smartphone,
    logoSrc: 'https://www.google.com/s2/favicons?domain=meizu.com&sz=64',
  },
  {
    title: 'ASUS',
    href: '/reparacion/asus',
    description: 'ROG Phone · ZenFone series · Técnicos certificados',
    icon: Smartphone,
    logoSrc: 'https://www.google.com/s2/favicons?domain=asus.com&sz=64',
  },
];

// kept for mobile menu
const productLinks: LinkItem[] = [...primaryBrandLinks, ...extraBrandLinks];

const companyLinks: LinkItem[] = [
  {
    title: 'Quiénes somos',
    href: '/about',
    description: 'Nuestra historia, nuestros técnicos, nuestra promesa',
    icon: Users,
  },
  {
    title: 'Opiniones de clientes',
    href: '/opiniones',
    description: 'Reparaciones reales, resultados reales de clientes reales',
    icon: Star,
  },
  {
    title: 'Política de garantía',
    href: '/garantia',
    description: 'Garantía de por vida en cada reparación que realizamos',
    icon: Shield,
  },
];

const accountLinks: LinkItem[] = [
  { title: 'Iniciar sesión', href: '/login', description: 'Accede a tu cuenta', icon: LogIn },
  { title: 'Crear cuenta', href: '/registro', description: 'Regístrate en 60 segundos', icon: UserPlus },
  { title: 'Mi perfil', href: '/perfil', description: 'Reparaciones y facturas', icon: UserIcon },
];

const companyLinks2: LinkItem[] = [
  { title: 'B2B / Empresas', href: '/empresas', icon: Briefcase },
  { title: 'Contacto', href: '/contacto', icon: Phone },
  { title: 'Guía de reparación', href: '/guia', icon: FileText },
  { title: 'Blog', href: '/blog', icon: Leaf },
  { title: 'Preguntas frecuentes', href: '/faq', icon: HelpCircle },
];

function ProfileMenu({ dark }: { dark?: boolean }) {
  const [open, setOpen] = React.useState(false);
  const [loggedIn] = React.useState(false); // swap with real auth state later
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onEsc);
    };
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Menú de perfil"
        className={cn(
          'group relative flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-300',
          dark
            ? 'border-white/15 bg-white/5 text-white hover:border-[#CCFF00]/60 hover:bg-[#CCFF00]/10'
            : 'border-foreground/10 bg-background/40 text-foreground hover:border-[#CCFF00] hover:bg-[#CCFF00]/15',
          open && 'border-[#CCFF00]/70 bg-[#CCFF00]/10'
        )}
      >
        <UserIcon className="size-4 transition-transform duration-300 group-hover:scale-110" />
        {loggedIn && (
          <span className="absolute -top-0.5 -right-0.5 size-2.5 rounded-full bg-[#CCFF00] ring-2 ring-[#060d12]" />
        )}
      </button>

      <div
        role="menu"
        aria-hidden={!open}
        className={cn(
          'absolute right-0 top-[calc(100%+10px)] w-72 origin-top-right rounded-2xl border p-2 shadow-2xl backdrop-blur-xl transition-all duration-200',
          dark
            ? 'border-white/10 bg-[#070c10]/95'
            : 'border-foreground/10 bg-background/95',
          open
            ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
            : 'pointer-events-none -translate-y-1 scale-95 opacity-0'
        )}
        style={{
          boxShadow: dark
            ? '0 20px 60px -10px rgba(0,0,0,0.8), 0 0 0 1px rgba(204,255,0,0.05)'
            : undefined,
        }}
      >
        {/* Header */}
        <div
          className={cn(
            'relative overflow-hidden rounded-xl px-4 py-3.5 mb-1',
            dark ? 'bg-white/[0.04]' : 'bg-accent/50'
          )}
        >
          <div
            aria-hidden
            className="absolute -top-10 -right-10 size-24 rounded-full opacity-30"
            style={{
              background:
                'radial-gradient(closest-side, rgba(204,255,0,0.5), transparent)',
            }}
          />
          <div className="relative flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#CCFF00] to-[#84cc16] text-black font-black">
              {loggedIn ? 'CM' : <UserIcon className="size-4" />}
            </div>
            <div className="min-w-0">
              <div className={cn('text-sm font-bold truncate', dark ? 'text-white' : '')}>
                {loggedIn ? 'Carlos Mendoza' : 'Invitado'}
              </div>
              <div
                className={cn(
                  'text-xs truncate',
                  dark ? 'text-white/50' : 'text-muted-foreground'
                )}
              >
                {loggedIn ? 'carlos@correo.com' : 'Accede para ver tus reparaciones'}
              </div>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="flex flex-col gap-0.5">
          {(loggedIn
            ? [
                { title: 'Mi perfil', icon: UserIcon, href: '/perfil' },
                { title: 'Mis reparaciones', icon: Wrench, href: '/perfil' },
              ]
            : [
                { title: 'Iniciar sesión', icon: LogIn, href: '/login' },
                { title: 'Crear cuenta', icon: UserPlus, href: '/registro' },
              ]
          ).map((item) => (
            <Link
              key={item.title}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                dark
                  ? 'text-white/80 hover:bg-[#CCFF00]/10 hover:text-white'
                  : 'text-foreground/80 hover:bg-accent hover:text-foreground'
              )}
            >
              <item.icon
                className={cn(
                  'size-4 transition-colors',
                  dark
                    ? 'text-white/50 group-hover:text-[#CCFF00]'
                    : 'text-foreground/50 group-hover:text-foreground'
                )}
              />
              <span className="font-medium">{item.title}</span>
              <span
                className={cn(
                  'ml-auto text-[10px] font-black uppercase tracking-widest opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0',
                  dark ? 'text-[#CCFF00]' : 'text-foreground/60'
                )}
              >
                →
              </span>
            </Link>
          ))}
        </div>

        {loggedIn && (
          <>
            <div className={cn('mx-2 my-1.5 h-px', dark ? 'bg-white/10' : 'bg-border')} />
            <button
              className={cn(
                'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                dark
                  ? 'text-white/60 hover:bg-red-500/10 hover:text-red-300'
                  : 'text-foreground/70 hover:bg-red-500/10 hover:text-red-600'
              )}
            >
              <LogOut className="size-4" />
              <span className="font-medium">Cerrar sesión</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function useScroll(threshold: number) {
  const [scrolled, setScrolled] = React.useState(false);
  const onScroll = React.useCallback(() => {
    setScrolled(window.scrollY > threshold);
  }, [threshold]);
  React.useEffect(() => {
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [onScroll]);
  React.useEffect(() => {
    onScroll();
  }, [onScroll]);
  return scrolled;
}
