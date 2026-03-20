import Map from '../components/Map';
import Sidebar from '../components/Sidebar';

export default function Home() {
  return (
    <main className="h-screen flex flex-col overflow-hidden text-slate-900">
      
      {/* Header de FlowGo */}
      <header className="bg-yellow-400 p-4 shadow-md z-20 flex-none" role="banner">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <span aria-label="Bus">🚌</span> FlowGo <span className="text-sm font-normal">| Réseau Cars Jaunes Réunion</span>
        </h1>
      </header>

      {/* 2. Zone de contenu principal (Flex-row pour mettre côte à côte) */}
      <div className="flex flex-1 overflow-hidden relative">

        {/* Sidebar : Largeur fixe sur PC, cachée ou réduite sur mobile */}
        <Sidebar />

        {/* Zone de la carte */}
        <section className="flex-1 h-full relative bg-slate-200">
          <Map />
        </section>  
      </div>

      {/* Footer informatif */}
      <footer className="bg-gray-100 p-2 text-center text-[10px] text-gray-500 font-bold uppercase tracking-widest z-20" role="contentinfo">
        Données fournies par la Région Réunion - Réalisé avec Next.js & MapLibre
      </footer>
    </main>
  );
}