import Map from '../components/Map';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Header de FlowGo */}
      <header className="bg-yellow-400 p-4 shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          🚌 FlowGo <span className="text-sm font-normal">| Réseau Cars Jaunes</span>
        </h1>
      </header>

      {/* Zone de la carte */}
      <section className="flex-grow relative">
        <Map />
      </section>

      {/* Footer informatif */}
      <footer className="bg-gray-100 p-2 text-center text-xs text-gray-500">
        Données fournies par la Région Réunion - Réalisé avec Next.js & MapLibre
      </footer>
    </main>
  );
}