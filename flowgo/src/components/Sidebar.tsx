"use client";
import { useEffect, useState } from 'react';
import { busService } from '../services/busService';
import { Menu, X } from 'lucide-react'; // Installe lucide-react ou utilise des emojis

// On définit l'interface de ce que contient une "Feature" de bus
// pour que TypeScript sache que .properties.name existe.
interface BusFeature extends GeoJSON.Feature {
  properties: {
    name: string;
    color: string;
  }
}

export default function Sidebar() {
  const [routes, setRoutes] = useState<BusFeature[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false); // État pour le mobile

  useEffect(() => {
    async function loadData() {
        try {
            const data = await busService.getRoutes();
            setRoutes(data.features as BusFeature[]);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
        }
        loadData();
    }, []);

    // Fermer le menu avec la touche Echap (Standard accessibilité)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setIsOpen(false);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

  return (
    <>
        {/* Bouton de menu pour mobile */}
        <button
          className="md:hidden p-2 m-2 rounded-md bg-yellow-500 text-slate-900 z-50 fixed top-4 left-4 shadow-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={isOpen}
          aria-controls="sidebar-menu"
        >
          {isOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
        </button>

        {/* Sidebar */}
        <aside
            id="sidebar-menu"
            aria-hidden={!isOpen && typeof window !== 'undefined' && window.innerWidth < 768}
            className="fixed md:relative inset-y-0 left-0 w-80 h-full max-h-full bg-slate-50 border-r border-slate-200 
                flex flex-col shadow-xl z-40 transform transition-transform duration-300 ease-in-out overflow-hidden
                ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0"
            >      
          <div className="flex flex-col h-full min-h-0">
            {/* <div className="p-6 bg-yellow-400">
              <h1 className="text-2xl font-black text-slate-800 tracking-tighter">FLOWGO</h1>
              <p className="text-xs font-bold text-yellow-900 uppercase tracking-widest">Cars Jaunes Réunion</p>
            </div> */}

            <nav className="flex-1 min-h-0 overflow-y-auto p-4 custom-scrollbar" aria-label="Liste des lignes de bus">
              <h2 className="text-sm font-semibold text-slate-700 mb-4 uppercase">Lignes disponibles</h2>
                
                {loading ? (
                    <div className="space-y-4" aria-live="polite" aria-busy="true">
                    <p className="text-sm text-slate-400 animate-pulse italic">Chargement des lignes...</p>
                    </div>              
                ) : routes.length === 0 ? (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg" role="alert">
                    <p className="text-sm text-red-700 font-medium">⚠️ Erreur : Impossible de charger les lignes de bus.</p>
                    <p className="text-xs text-red-600 mt-1">Vérifiez votre connexion Internet et réessayez.</p>
                    </div>
                ) : (
                    <div className="space-y-2 pb-4">
                    {routes.map((route, index) => (
                        <button
                        key={index}
                        className="w-full text-left p-3 rounded-lg bg-white border-2 border-slate-200 hover:border-yellow-400 hover:shadow-md transition-all group focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                        aria-label={`Ligne ${route.properties.name}`}
                        title={`Cliquez pour voir la ligne ${route.properties.name}`}
                        >
                        <div className="flex items-center gap-3">
                            <div 
                                className="w-3 h-3 rounded-full flex-shrink-0" 
                                style={{ backgroundColor: route.properties.color }}
                                aria-hidden="true"
                            />
                            <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
                                {route.properties.name}
                            </span>
                        </div>
                        </button>
                    ))}
                    </div>
                )}
            </nav>

            {/* Légende simple pour les arrêts de bus */}
            <div className="p-4 border-t border-slate-200 bg-white" aria-hidden="true">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="w-2 h-2 rounded-full bg-white border border-slate-400"></span>
                <span>Arrêts de bus</span>
              </div>
            </div>

            {/* Footer de la sidebar (Fixe en bas) */}
            <div className="p-4 border-t border-slate-200 bg-white flex-none">
                <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold uppercase tracking-tight">
                    <span className="w-2 h-2 rounded-full bg-white border-2 border-slate-400"></span>
                    <span>{routes.length} Lignes chargées</span>
                </div>
            </div>
          </div>
        </aside>

       {/* Overlay (Flou derrière la sidebar sur mobile quand elle est ouverte) */}
        {isOpen && (
            <div 
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 lg:hidden"
                aria-hidden="true"
            />
        )} 
    </>
  );
}