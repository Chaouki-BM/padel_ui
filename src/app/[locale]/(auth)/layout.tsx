import { type ReactNode } from "react";
import { Trophy } from "lucide-react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#0B1A2D] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: 'url("/images/hero-banner.jpg")' }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1A2D]/90 via-[#0B1A2D]/60 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B1A2D]/40 to-transparent"></div>
        </div>
        
        <div className="relative z-10 flex flex-col justify-center px-12 h-full w-full">
          <div className="flex items-center gap-2 text-white/90 mb-8 font-semibold tracking-wider text-sm">
            <Trophy className="h-5 w-5 text-[#C0FF00]" />
            PADELTUNISIE PRO
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-4">
            PRÊT POUR VOTRE<br />PROCHAIN MATCH ?
          </h1>
          <p className="text-white/80 text-lg max-w-md font-medium">
            Connectez-vous pour réserver les meilleurs terrains de Tunisie et rejoindre la communauté.
          </p>
        </div>
      </div>
      
      <div className="flex w-full items-center justify-center px-4 py-8 sm:px-6 sm:py-10 lg:w-1/2 lg:p-8">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center justify-center gap-2 text-sm font-bold tracking-wider text-[#0B1A2D] sm:mb-10 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0B1A2D]">
              <Trophy className="h-4 w-4 text-[#C0FF00]" />
            </div>
            PADELTUNISIE PRO
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
