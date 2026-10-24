"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Activity, TrendingUp, Flame, Star, ChevronRight, Calendar, MapPin, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { AdsBannerStrip } from "@/features/ads/components/AdsBannerStrip";
import { authAwareHref } from "@/lib/auth";
import { useSessionStore } from "@/stores/session";

export default function PlayerHomePage() {
  const t = useTranslations("playerHome");
  const isAuthenticated = useSessionStore((s) => s.isAuthenticated);
  const joinHref = authAwareHref("/player/open-matches", isAuthenticated);
  const bookingsHref = authAwareHref("/player/bookings", isAuthenticated);

  return (
    <div className="flex flex-col gap-6 pb-8 sm:gap-8 sm:pb-12">
      <section className="relative w-full min-h-[280px] overflow-hidden sm:min-h-[340px] sm:h-[400px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("/images/hero-banner.jpg")' }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1A2D]/90 via-[#0B1A2D]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B1A2D]/40 to-transparent" />
        </div>

        <div className="relative flex h-full min-h-[280px] flex-col justify-end px-4 py-8 sm:min-h-[340px] sm:justify-center sm:px-8 sm:py-12 md:px-12 max-w-4xl">
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-wider text-white/90 sm:mb-4 sm:text-sm">
            <Trophy className="h-4 w-4 text-[#C0FF00] sm:h-5 sm:w-5" />
            {t("brand")}
          </div>
          <h1 className="mb-3 text-2xl leading-tight font-black text-white sm:mb-4 sm:text-4xl md:text-6xl">
            {t("heroTitle")}
            <br />
            {t("heroTitleLine2")}
          </h1>
          <p className="mb-5 max-w-xl text-sm font-medium text-white/80 sm:mb-8 sm:text-lg">
            {t("heroSubtitle")}
          </p>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:gap-4">
            <Button
              asChild
              className="h-12 w-full rounded-full border-none bg-[#C0FF00] px-6 text-sm font-bold text-[#0B1A2D] shadow-lg shadow-[#C0FF00]/20 hover:bg-[#C0FF00]/90 sm:h-auto sm:w-auto sm:px-8 sm:py-6 sm:text-base"
            >
              <Link href="/player/clubs">
                <span className="mr-2 text-lg">+</span> {t("ctaBook")}
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-12 w-full rounded-full border-white bg-white px-6 text-sm font-bold text-[#0B1A2D] shadow-lg hover:bg-white/90 sm:h-auto sm:w-auto sm:px-8 sm:py-6 sm:text-base"
            >
              <Link href="/player/open-matches">{t("ctaJoin")}</Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-4 sm:gap-12 sm:px-6 md:px-8">
        <AdsBannerStrip placement="HOME" />
        {isAuthenticated ? (
        <section className="grid grid-cols-2 gap-3 md:grid-cols-2 lg:grid-cols-4 sm:gap-4">
          <Card className="rounded-2xl border border-slate-100 shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                <Activity className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{t("statMatches")}</p>
                <p className="text-2xl font-black text-slate-900 tracking-tight">42</p>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border border-slate-100 shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{t("statLevel")}</p>
                <p className="text-2xl font-black text-slate-900 tracking-tight">P100</p>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border border-slate-100 shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                <Flame className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{t("statStreak")}</p>
                <p className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-1">3</p>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border border-slate-100 shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-[#f0fdf4] flex items-center justify-center text-[#22c55e]">
                <Star className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{t("statCredits")}</p>
                <p className="text-2xl font-black text-slate-900 tracking-tight">250 TND</p>
              </div>
            </CardContent>
          </Card>
        </section>
        ) : null}

        {isAuthenticated ? (
        <section>
          <div className="mb-4 flex items-center justify-between gap-2 sm:mb-6">
            <h2 className="text-lg font-black tracking-tight text-slate-900 sm:text-[22px]">
              {t("upcomingBookings")}
            </h2>
            <Link href={bookingsHref} className="flex shrink-0 items-center text-xs font-semibold text-slate-500 hover:text-slate-900 sm:text-sm">
              {t("seeAll")} <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 sm:gap-6">
            <Card className="rounded-[20px] border border-slate-100 shadow-sm">
              <CardContent className="flex p-0">
                <div className="flex w-16 shrink-0 flex-col items-center justify-center rounded-l-[20px] border-r border-slate-100 bg-slate-50 py-4 sm:w-[88px] sm:py-6">
                  <span className="mb-1 text-[10px] font-bold text-slate-400 sm:text-xs">JEU</span>
                  <span className="text-2xl font-black tracking-tighter text-[#0B1A2D] sm:text-3xl">15</span>
                </div>
                <div className="flex flex-1 flex-col justify-center p-3 sm:p-5">
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <h3 className="text-sm font-bold text-slate-900 sm:text-[17px]">Padel Club Carthage</h3>
                    <Badge variant="secondary" className="bg-[#f0fdf4] text-[#15803d] hover:bg-[#f0fdf4] border-none font-bold text-[10px] uppercase tracking-wider px-2 py-1 rounded-md">
                      Confirmé
                    </Badge>
                  </div>
                  <div className="flex items-center text-[13px] text-slate-500 font-medium">
                    <Calendar className="h-[14px] w-[14px] mr-2 text-slate-400" />
                    18:00 - 19:30 • Court Central
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Resa 2 */}
            <Card className="rounded-[20px] border border-slate-100 shadow-sm">
              <CardContent className="p-0 flex">
                <div className="w-[88px] bg-slate-50 flex flex-col items-center justify-center border-r border-slate-100 rounded-l-[20px] py-6">
                  <span className="text-xs font-bold text-slate-400 mb-1">SAM</span>
                  <span className="text-3xl font-black text-[#0B1A2D] tracking-tighter">18</span>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-center">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-slate-900 text-[17px]">The Box Padel Soukra</h3>
                    <Badge variant="outline" className="text-slate-500 font-bold border-slate-200 text-[10px] uppercase tracking-wider px-2 py-1 rounded-md">
                      En attente
                    </Badge>
                  </div>
                  <div className="flex items-center text-[13px] text-slate-500 font-medium">
                    <Calendar className="h-[14px] w-[14px] mr-2 text-slate-400" />
                    10:00 - 11:30 • Court N°3
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
        ) : null}

        {/* Promo Banner */}
        <section>
          <Card className="relative overflow-hidden rounded-2xl border-none bg-slate-50 shadow-sm sm:rounded-3xl">
            <div
              className="absolute inset-y-0 right-0 hidden w-1/3 bg-cover bg-center sm:block"
              style={{ backgroundImage: 'url("/images/hero-banner.jpg")' }}
            />
            <CardContent className="relative z-10 w-full p-5 sm:w-2/3 sm:p-8 md:p-10">
              <h2 className="mb-2 text-lg font-black tracking-tight text-slate-900 sm:text-[22px]">
                Nouvelle Collection Drop Shot
              </h2>
              <p className="mb-4 max-w-md text-sm font-medium text-slate-500 sm:mb-6">
                Découvrez les raquettes 2024 utilisées par les pros. Performance et contrôle absolu.
              </p>
              <Link href="#" className="group flex items-center text-sm font-bold text-[#0B1A2D] hover:underline">
                Voir la collection{" "}
                <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </CardContent>
          </Card>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between gap-2 sm:mb-6">
            <h2 className="text-lg font-black tracking-tight text-slate-900 sm:text-[22px]">
              Matchs Ouverts à Proximité
            </h2>
            <Link href="/player/open-matches" className="flex shrink-0 items-center text-xs font-semibold text-slate-500 hover:text-slate-900 sm:text-sm">
              Rechercher plus <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Match 1 */}
            <Card className="rounded-[24px] border border-slate-100 shadow-sm">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-5">
                  <div className="flex -space-x-2">
                    <Avatar className="border-2 border-white h-9 w-9"><AvatarImage src="/placeholder-avatar.jpg" /><AvatarFallback>A</AvatarFallback></Avatar>
                    <Avatar className="border-2 border-white h-9 w-9"><AvatarImage src="/placeholder-avatar.jpg" /><AvatarFallback>B</AvatarFallback></Avatar>
                    <div className="h-9 w-9 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[11px] font-bold text-slate-500 z-10">+1</div>
                  </div>
                  <Badge variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-100 font-bold text-[10px]">Niveau P100-P250</Badge>
                </div>
                <h3 className="font-bold text-slate-900 text-[16px] mb-4 flex items-center"><Users className="h-[18px] w-[18px] mr-2 text-slate-400"/> Partie Ouverte</h3>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-[13px] text-slate-500 font-medium">
                    <MapPin className="h-[14px] w-[14px] mr-2 text-slate-400" /> Gammarth Padel Club
                  </div>
                  <div className="flex items-center text-[13px] text-slate-500 font-medium">
                    <Calendar className="h-[14px] w-[14px] mr-2 text-slate-400" /> Aujourd&apos;hui, 19:00
                  </div>
                </div>
                <Button asChild className="w-full bg-[#0B1A2D] hover:bg-[#0B1A2D]/90 text-white rounded-full font-semibold text-sm py-5">
                  <Link href={joinHref}>{t("joinPlaces", { count: 2 })}</Link>
                </Button>
              </CardContent>
            </Card>
            {/* Match 2 */}
            <Card className="rounded-[24px] border border-slate-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#C0FF00]"></div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-5">
                  <div className="flex -space-x-2">
                    <Avatar className="border-2 border-white h-9 w-9"><AvatarImage src="/placeholder-avatar.jpg" /><AvatarFallback>C</AvatarFallback></Avatar>
                    <Avatar className="border-2 border-white h-9 w-9"><AvatarImage src="/placeholder-avatar.jpg" /><AvatarFallback>D</AvatarFallback></Avatar>
                    <Avatar className="border-2 border-white h-9 w-9"><AvatarImage src="/placeholder-avatar.jpg" /><AvatarFallback>E</AvatarFallback></Avatar>
                  </div>
                  <Badge variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-100 font-bold text-[10px]">Niveau Débutant</Badge>
                </div>
                <h3 className="font-bold text-slate-900 text-[16px] mb-4 flex items-center"><Users className="h-[18px] w-[18px] mr-2 text-slate-400"/> Partie Ouverte</h3>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-[13px] text-slate-500 font-medium">
                    <MapPin className="h-[14px] w-[14px] mr-2 text-slate-400" /> Lake Padel Tunis
                  </div>
                  <div className="flex items-center text-[13px] text-slate-500 font-medium">
                    <Calendar className="h-[14px] w-[14px] mr-2 text-slate-400" /> Aujourd&apos;hui, 21:30
                  </div>
                </div>
                <Button asChild className="w-full bg-[#0B1A2D] hover:bg-[#0B1A2D]/90 text-white rounded-full font-semibold text-sm py-5">
                  <Link href={joinHref}>{t("joinPlaces", { count: 1 })}</Link>
                </Button>
              </CardContent>
            </Card>
            {/* Match 3 */}
            <Card className="rounded-[24px] border border-slate-100 shadow-sm">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-5">
                  <div className="flex -space-x-2">
                    <Avatar className="border-2 border-white h-9 w-9"><AvatarImage src="/placeholder-avatar.jpg" /><AvatarFallback>F</AvatarFallback></Avatar>
                    <div className="h-9 w-9 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[11px] font-bold text-slate-500 z-10">+1</div>
                  </div>
                  <Badge variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-100 font-bold text-[10px]">Niveau P500+</Badge>
                </div>
                <h3 className="font-bold text-slate-900 text-[16px] mb-4 flex items-center"><Users className="h-[18px] w-[18px] mr-2 text-slate-400"/> Partie Ouverte</h3>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-[13px] text-slate-500 font-medium">
                    <MapPin className="h-[14px] w-[14px] mr-2 text-slate-400" /> Olympique Padel
                  </div>
                  <div className="flex items-center text-[13px] text-slate-500 font-medium">
                    <Calendar className="h-[14px] w-[14px] mr-2 text-slate-400" /> Aujourd&apos;hui, 17:00
                  </div>
                </div>
                <Button asChild className="w-full bg-[#0B1A2D] hover:bg-[#0B1A2D]/90 text-white rounded-full font-semibold text-sm py-5">
                  <Link href={joinHref}>{t("joinPlaces", { count: 3 })}</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Secondary Banners */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="rounded-[24px] border-none shadow-sm overflow-hidden bg-slate-50 relative flex items-center h-[180px]">
            <div className="p-8 w-2/3 z-10">
              <h2 className="text-xl font-black text-slate-900 mb-2 tracking-tight">Hydratation Optimale</h2>
              <p className="text-[13px] text-slate-500 mb-4 font-medium leading-relaxed">Restez au top de votre forme avec nos boissons isotoniques.</p>
              <Link href="#" className="text-[13px] font-bold text-slate-900 flex items-center hover:underline group">
                Découvrir <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-cover bg-center" style={{ backgroundImage: 'url("/images/hero-banner.jpg")' }}></div>
          </Card>
          
          <Card className="rounded-[24px] border-none shadow-sm overflow-hidden bg-gradient-to-br from-[#FF4D4D] to-[#FF6B35] relative flex items-center h-[180px]">
            <div className="p-8 w-full z-10 relative">
              <h2 className="text-xl font-black text-white mb-2 tracking-tight">PROGRAMME FIDÉLITÉ</h2>
              <p className="text-[13px] text-white/80 mb-4 font-medium leading-relaxed">Cumulez des points à chaque match et gagnez des parties gratuites.</p>
              <Link href="#" className="text-[13px] font-bold text-white flex items-center hover:underline group">
                En savoir plus <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="absolute -right-8 -top-8 opacity-10">
              <Trophy className="h-[240px] w-[240px] text-white" />
            </div>
          </Card>
        </section>

        {/* Events & Tournaments */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[22px] font-black text-slate-900 tracking-tight">Événements & Tournois</h2>
            <Link href="/player/events" className="text-sm font-semibold text-slate-500 flex items-center hover:text-slate-900 transition-colors">
              Agenda complet <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Event 1 */}
            <Card className="rounded-[20px] border-none overflow-hidden relative h-[220px] group cursor-pointer shadow-sm">
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: 'url("/images/hero-banner.jpg")' }}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1A2D]/90 via-[#0B1A2D]/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-5 w-full">
                <Badge className="bg-[#FF4D4D] text-white hover:bg-[#FF4D4D] font-bold mb-2.5 text-[10px] px-2 py-0.5 rounded-md">Tournoi P1000</Badge>
                <h3 className="font-bold text-white text-[17px] leading-tight mb-1">Open de Tunis 2024</h3>
                <p className="text-[12px] text-slate-300 font-medium">25 - 27 Octobre</p>
              </div>
            </Card>
            {/* Event 2 */}
            <Card className="rounded-[20px] border-none overflow-hidden relative h-[220px] group cursor-pointer shadow-sm">
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: 'url("/images/hero-banner.jpg")' }}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1A2D]/90 via-[#0B1A2D]/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-5 w-full">
                <Badge className="bg-[#C0FF00] text-[#0B1A2D] hover:bg-[#C0FF00] font-bold mb-2.5 text-[10px] px-2 py-0.5 rounded-md">Stage Intensif</Badge>
                <h3 className="font-bold text-white text-[17px] leading-tight mb-1">Clinique de Volée Pro</h3>
                <p className="text-[12px] text-slate-300 font-medium">Chaque Samedi</p>
              </div>
            </Card>
            {/* Event 3 */}
            <Card className="rounded-[20px] border-none overflow-hidden relative h-[220px] group cursor-pointer shadow-sm">
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: 'url("/images/hero-banner.jpg")' }}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1A2D]/90 via-[#0B1A2D]/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-5 w-full">
                <Badge className="bg-[#3B82F6] text-white hover:bg-[#3B82F6] font-bold mb-2.5 text-[10px] px-2 py-0.5 rounded-md">Social</Badge>
                <h3 className="font-bold text-white text-[17px] leading-tight mb-1">Americano Night</h3>
                <p className="text-[12px] text-slate-300 font-medium">Mardi Prochain</p>
              </div>
            </Card>
            {/* Event 4 */}
            <Card className="rounded-[20px] border border-slate-100 overflow-hidden relative h-[220px] group cursor-pointer shadow-sm bg-white flex items-center justify-center">
              <div className="absolute inset-0 bg-cover bg-center opacity-30 transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: 'url("/images/hero-banner.jpg")', filter: 'grayscale(100%)' }}></div>
              <div className="z-10 text-center p-4">
                <Badge className="bg-[#FF4D4D] text-white hover:bg-[#FF4D4D] font-bold mb-3 text-[10px] px-2 py-0.5 rounded-md">Communauté</Badge>
                <h3 className="font-bold text-[#0B1A2D] text-[17px] leading-tight">Rejoignez le<br/>Padel Day</h3>
              </div>
            </Card>
          </div>
        </section>
        
        {/* Footer */}
        <footer className="mt-4 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 py-8 text-[13px] font-medium text-slate-500">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-[#0B1A2D] flex items-center justify-center">
              <Trophy className="h-4 w-4 text-[#C0FF00]" />
            </div>
            <span className="font-black text-[#0B1A2D] tracking-tight text-lg">PadelTunisie</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-slate-900 transition-colors">Conditions</Link>
            <Link href="#" className="hover:text-slate-900 transition-colors">Confidentialité</Link>
            <Link href="#" className="hover:text-slate-900 transition-colors">Aide</Link>
            <Link href="#" className="hover:text-slate-900 transition-colors">Contact</Link>
          </div>
          <div>
            © 2024 PadelPlatform.tn - Tous droits réservés.
          </div>
        </footer>
      </div>
    </div>
  );
}
