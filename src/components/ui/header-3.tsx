'use client';
import React from 'react';
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
} from 'lucide-react';

type LinkItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  description?: string;
};

export function Header() {
  const [open, setOpen] = React.useState(false);
  const scrolled = useScroll(10);

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
        'sticky top-0 z-50 w-full border-b border-transparent',
        {
          'bg-background/95 supports-[backdrop-filter]:bg-background/50 border-border backdrop-blur-lg':
            scrolled,
        }
      )}
    >
      <nav className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-5">
          <a href="/" className="hover:bg-accent rounded-md px-2 py-1 flex items-center gap-1.5">
            <div className="bg-foreground text-background font-black text-xs px-2.5 py-1 rounded-xl rounded-bl-sm">
              MOVIL
            </div>
            <div className="bg-[#CCFF00] text-black font-black text-xs px-2.5 py-1 rounded-full border border-foreground/10">
              GURU
            </div>
          </a>
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent">
                  Servicios
                </NavigationMenuTrigger>
                <NavigationMenuContent className="bg-background p-1 pr-1.5">
                  <ul className="bg-popover grid w-[500px] grid-cols-2 gap-2 rounded-md border p-2 shadow">
                    {productLinks.map((item, i) => (
                      <li key={i}>
                        <ListItem {...item} />
                      </li>
                    ))}
                  </ul>
                  <div className="p-2">
                    <p className="text-muted-foreground text-sm">
                      ¿Tienes un dispositivo roto?{' '}
                      <a
                        href="#"
                        className="text-foreground font-medium hover:underline"
                      >
                        Obtén un presupuesto gratis
                      </a>
                    </p>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent">
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
                <a href="#pricing" className="hover:bg-accent rounded-md p-2">
                  Precios
                </a>
              </NavigationMenuLink>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="hidden items-center gap-2 md:flex">
          <Button variant="outline" asChild><a href="/track">Rastrear Reparación</a></Button>
          <Button asChild><a href="#pricing">Reservar Reparación</a></Button>
        </div>
        <Button
          size="icon"
          variant="outline"
          onClick={() => setOpen(!open)}
          className="md:hidden"
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
            <span className="text-sm">Servicios</span>
            {productLinks.map((link) => (
              <ListItem key={link.title} {...link} />
            ))}
            <span className="text-sm">Nosotros</span>
            {companyLinks.map((link) => (
              <ListItem key={link.title} {...link} />
            ))}
            {companyLinks2.map((link) => (
              <ListItem key={link.title} {...link} />
            ))}
          </div>
        </NavigationMenu>
        <div className="flex flex-col gap-2">
          <Button variant="outline" className="w-full bg-transparent" asChild>
            <a href="/track">Rastrear Reparación</a>
          </Button>
          <Button className="w-full" asChild><a href="#pricing">Reservar Reparación</a></Button>
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
        'fixed top-14 right-0 bottom-0 left-0 z-40 flex flex-col overflow-hidden border-y md:hidden'
      )}
    >
      <div
        data-slot={open ? 'open' : 'closed'}
        className={cn(
          'data-[slot=open]:animate-in data-[slot=open]:zoom-in-97 ease-out',
          'size-full p-4',
          className
        )}
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
      <a href={href}>
        <div className="bg-background/40 flex aspect-square size-12 items-center justify-center rounded-md border shadow-sm">
          <Icon className="text-foreground size-5" />
        </div>
        <div className="flex flex-col items-start justify-center">
          <span className="font-medium">{title}</span>
          <span className="text-muted-foreground text-xs">{description}</span>
        </div>
      </a>
    </NavigationMenuLink>
  );
}

const productLinks: LinkItem[] = [
  {
    title: 'Reparación de pantalla',
    href: '#',
    description: '¿Pantalla rota o resquebrajada? Lo arreglamos hoy',
    icon: Smartphone,
  },
  {
    title: 'Cambio de batería',
    href: '#',
    description: 'Recupera la autonomía de todo el día en 20 minutos',
    icon: Battery,
  },
  {
    title: 'Daño por agua',
    href: '#',
    description: 'Limpieza a nivel de placa y recuperación de componentes',
    icon: Droplets,
  },
  {
    title: 'Reparación de cámara',
    href: '#',
    description: 'Lentes borrosas, rotas o desalineadas, solucionadas',
    icon: Camera,
  },
  {
    title: 'Reparación de plegables',
    href: '#',
    description: 'Especialistas en pantalla interior, bisagra y serie Z',
    icon: LayersIcon,
  },
  {
    title: 'Recuperación de datos',
    href: '#',
    description: 'Recupera datos de dispositivos dañados o muertos',
    icon: Database,
  },
  {
    title: 'Puerto de carga',
    href: '#',
    description: 'Reparaciones USB-C, Lightning y Micro-USB',
    icon: PlugIcon,
  },
  {
    title: 'Placa base',
    href: '#',
    description: 'Microsoldadura y diagnóstico a nivel de componente',
    icon: Cpu,
  },
];

const companyLinks: LinkItem[] = [
  {
    title: 'Quiénes somos',
    href: '/about',
    description: 'Nuestra historia, nuestros técnicos, nuestra promesa',
    icon: Users,
  },
  {
    title: 'Opiniones de clientes',
    href: '#testimonials',
    description: 'Reparaciones reales, resultados reales de clientes reales',
    icon: Star,
  },
  {
    title: 'Política de garantía',
    href: '/warranty',
    description: 'Garantía de por vida en cada reparación que realizamos',
    icon: Shield,
  },
];

const companyLinks2: LinkItem[] = [
  { title: 'B2B / Empresas', href: '/business', icon: Briefcase },
  { title: 'Rastrear mi reparación', href: '/track', icon: RotateCcw },
  { title: 'Guía de reparación', href: '/guide', icon: FileText },
  { title: 'Blog', href: '/blog', icon: Leaf },
  { title: 'Preguntas frecuentes', href: '/faq', icon: HelpCircle },
];

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
