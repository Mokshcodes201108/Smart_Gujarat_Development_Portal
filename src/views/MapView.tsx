import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import { 
  MapPin, 
  Layers, 
  Filter, 
  Search, 
  Compass, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Building2, 
  IndianRupee, 
  X,
  Maximize2
} from 'lucide-react';
import { Project, ProjectCategory } from '../types';
import { DEPARTMENTS, CATEGORIES_LIST } from '../data/sampleProjects';
import { formatCurrencyINR, getStatusBadgeProps } from '../utils/formatters';

interface MapViewProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onNavigateTab: (tab: any) => void;
}

export const MapView: React.FC<MapViewProps> = ({
  projects,
  onSelectProject,
  onNavigateTab
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const [selectedDept, setSelectedDept] = useState('All Departments');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [filterConflictsOnly, setFilterConflictsOnly] = useState(false);
  const [selectedMapProject, setSelectedMapProject] = useState<Project | null>(null);
  const [mapError, setMapError] = useState(false);

  // Bharuch District geographical center
  const BHARUCH_CENTER: [number, number] = [21.7100, 72.9900];

  // Filter projects for map
  const visibleProjects = useMemo(() => {
    return projects.filter(p => {
      const matchDept = selectedDept === 'All Departments' || p.department === selectedDept;
      const matchCat = selectedCategory === 'All Categories' || p.category === selectedCategory;
      const matchConflict = !filterConflictsOnly || p.isFlaggedDuplicate;
      return matchDept && matchCat && matchConflict;
    });
  }, [projects, selectedDept, selectedCategory, filterConflictsOnly]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    try {
      if (!mapInstanceRef.current) {
        const map = L.map(mapContainerRef.current, {
          center: BHARUCH_CENTER,
          zoom: 10,
          zoomControl: true,
          scrollWheelZoom: true
        });

        // Add OpenStreetMap TileLayer with clean carto basemap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | SGDP Bharuch',
          maxZoom: 18
        }).addTo(map);

        const markersLayer = L.layerGroup().addTo(map);
        mapInstanceRef.current = map;
        markersLayerRef.current = markersLayer;
      }
    } catch (err) {
      console.error('Error initializing Leaflet map:', err);
      setMapError(true);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markersLayerRef.current = null;
      }
    };
  }, []);

  // Update Markers whenever visible projects change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    try {
      markersLayerRef.current.clearLayers();

      visibleProjects.forEach(project => {
        if (!project.latitude || !project.longitude) return;

        // Determine marker color:
        // Green: Completed
        // Blue: In Progress
        // Orange: Pending / Proposed
        // Red: Potential conflict / duplicate overlap
        let markerBg = '#0284c7'; // Blue
        let ringColor = 'border-blue-400';
        let label = 'IN PROGRESS';

        if (project.isFlaggedDuplicate) {
          markerBg = '#ef4444'; // Red
          ringColor = 'border-rose-300 ring-4 ring-rose-500/40 animate-pulse';
          label = 'DUPLICATE OVERLAP';
        } else if (project.status === 'Completed') {
          markerBg = '#10b981'; // Green
          ringColor = 'border-emerald-300';
          label = 'COMPLETED';
        } else if (project.status === 'Pending Approval' || project.status === 'Proposed') {
          markerBg = '#f59e0b'; // Orange
          ringColor = 'border-amber-300';
          label = 'PENDING';
        }

        const iconHtml = `
          <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;">
            <div style="
              background-color: ${markerBg};
              width: 28px;
              height: 28px;
              border-radius: 50%;
              border: 3px solid white;
              box-shadow: 0 4px 10px rgba(0,0,0,0.35);
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: 800;
              font-size: 11px;
            ">
              ${project.isFlaggedDuplicate ? '⚠️' : '🏛️'}
            </div>
            ${project.isFlaggedDuplicate ? '<div style="position: absolute; top: -4px; right: -4px; width: 10px; height: 10px; border-radius: 50%; background: #ef4444; border: 2px solid white;"></div>' : ''}
          </div>
        `;

        const customIcon = L.divIcon({
          html: iconHtml,
          className: 'custom-project-pin',
          iconSize: [34, 34],
          iconAnchor: [17, 34],
          popupAnchor: [0, -32]
        });

        const marker = L.marker([project.latitude, project.longitude], { icon: customIcon });

        // Popup Content
        const popupContent = document.createElement('div');
        popupContent.className = 'p-3 bg-slate-900 text-white rounded-xl text-xs max-w-xs';
        popupContent.innerHTML = `
          <div style="font-family: 'Plus Jakarta Sans', sans-serif;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <span style="font-family: monospace; color: #14b8a6; font-weight: bold;">${project.id}</span>
              <span style="background: ${markerBg}; color: white; padding: 2px 6px; border-radius: 9999px; font-size: 9px; font-weight: bold;">${label}</span>
            </div>
            <h4 style="font-weight: bold; font-size: 13px; color: white; margin-bottom: 6px; line-height: 1.3;">${project.projectName}</h4>
            <div style="color: #94a3b8; margin-bottom: 4px;"><strong>Dept:</strong> ${project.department}</div>
            <div style="color: #94a3b8; margin-bottom: 6px;"><strong>Location:</strong> ${project.village}, ${project.taluka}</div>
            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #334155; padding-top: 6px; margin-top: 6px;">
              <span style="color: #10b981; font-weight: bold; font-size: 13px;">${formatCurrencyINR(project.sanctionedBudget)}</span>
              <button id="inspect-btn-${project.id}" style="background: #0d9488; color: white; border: none; padding: 4px 10px; border-radius: 6px; font-weight: bold; font-size: 10px; cursor: pointer;">
                Inspect Work
              </button>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);

        marker.on('popupopen', () => {
          setSelectedMapProject(project);
          const btn = document.getElementById(`inspect-btn-${project.id}`);
          if (btn) {
            btn.onclick = () => onSelectProject(project);
          }
        });

        markersLayerRef.current?.addLayer(marker);
      });
    } catch (err) {
      console.error('Error rendering map markers:', err);
    }
  }, [visibleProjects]);

  const flyToProject = (p: Project) => {
    setSelectedMapProject(p);
    if (mapInstanceRef.current && p.latitude && p.longitude) {
      mapInstanceRef.current.flyTo([p.latitude, p.longitude], 13, { duration: 1.2 });
    }
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Header Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-bold border border-teal-500/30">
              GEOSPATIAL INTELLIGENCE
            </span>
            <span className="text-xs text-slate-400">Bharuch District Master Grid</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Interactive Developmental Works GIS Map
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Real-time coordinate mapping across Bharuch, Ankleshwar, Vagra, Dahej, Hansot, Amod, Jambusar, and Valia.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs bg-slate-950 px-3 py-2 rounded-xl border border-slate-800">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Pins:</span>
          <span className="flex items-center gap-1.5 text-emerald-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Completed
          </span>
          <span className="flex items-center gap-1.5 text-blue-300">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> In Progress
          </span>
          <span className="flex items-center gap-1.5 text-amber-300">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Pending
          </span>
          <span className="flex items-center gap-1.5 text-rose-300 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span> Duplicate Overlap
          </span>
        </div>
      </div>

      {/* Map Filter Bar */}
      <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-md grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        <div className="sm:col-span-5">
          <select
            value={selectedDept}
            onChange={e => setSelectedDept(e.target.value)}
            className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-teal-500"
          >
            <option value="All Departments">All Executing Departments ({projects.length})</option>
            {DEPARTMENTS.map(d => (
              <option key={d.code} value={d.name}>{d.name}</option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-4">
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-teal-500"
          >
            {CATEGORIES_LIST.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-3 flex items-center justify-end">
          <button
            onClick={() => setFilterConflictsOnly(!filterConflictsOnly)}
            className={`w-full py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              filterConflictsOnly 
                ? 'bg-rose-600 text-white shadow-md' 
                : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Show Conflicts Only</span>
          </button>
        </div>
      </div>

      {/* Map Canvas & Side Panel Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Main Leaflet Map Viewport */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative min-h-[500px]">
          {mapError ? (
            <div className="p-8 text-center text-slate-300">
              <Compass className="w-12 h-12 text-teal-400 mx-auto mb-3" />
              <h3 className="font-bold text-lg text-white">GIS Coordinates Fallback</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                Unable to load map tile layers directly in this browser viewport. Interactive coordinate list available in the right panel.
              </p>
            </div>
          ) : (
            <div 
              ref={mapContainerRef} 
              className="w-full h-[520px] z-10"
              style={{ minHeight: '520px' }}
            />
          )}

          {/* Floating Map Reset Button */}
          <button
            onClick={() => {
              if (mapInstanceRef.current) {
                mapInstanceRef.current.flyTo(BHARUCH_CENTER, 10);
              }
            }}
            className="absolute bottom-4 left-4 z-20 px-3 py-1.5 rounded-lg bg-slate-900/90 text-slate-200 border border-slate-700 text-xs font-semibold shadow-lg hover:bg-slate-800 cursor-pointer flex items-center gap-1.5"
          >
            <Compass className="w-3.5 h-3.5 text-teal-400" />
            <span>Reset District View</span>
          </button>
        </div>

        {/* Right: Quick Location Navigator & Selected Project Card */}
        <div className="lg:col-span-4 space-y-4">
          {/* Selected Work Detail Pill */}
          {selectedMapProject ? (
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-700 shadow-xl space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="font-mono text-xs text-teal-400 font-bold bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                  {selectedMapProject.id}
                </span>
                <button
                  onClick={() => setSelectedMapProject(null)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {selectedMapProject.isFlaggedDuplicate && (
                <div className="px-2.5 py-1 rounded-lg bg-rose-500/20 border border-rose-500/40 text-[11px] font-bold text-rose-300 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                  <span>Conflicting Duplicate Work Zone!</span>
                </div>
              )}

              <h4 className="font-bold text-sm text-white line-clamp-2">
                {selectedMapProject.projectName}
              </h4>

              <div className="text-xs text-slate-300 space-y-1">
                <div><span className="text-slate-400">Department:</span> {selectedMapProject.department}</div>
                <div><span className="text-slate-400">Location:</span> {selectedMapProject.village}, Taluka {selectedMapProject.taluka}</div>
                <div><span className="text-slate-400">GPS:</span> {selectedMapProject.latitude.toFixed(4)}°N, {selectedMapProject.longitude.toFixed(4)}°E</div>
                <div><span className="text-slate-400">Budget:</span> <span className="font-bold text-emerald-400">{formatCurrencyINR(selectedMapProject.sanctionedBudget)}</span></div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
                <button
                  onClick={() => onSelectProject(selectedMapProject)}
                  className="w-full py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>Open Full Specifications</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center py-6 text-slate-400 text-xs">
              <MapPin className="w-6 h-6 text-teal-400 mx-auto mb-1 opacity-70" />
              <p>Click any map pin to inspect project coordinates & status</p>
            </div>
          )}

          {/* Quick Bharuch Hotspots Fly-to Selector */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
              Conflict Zones & Key Clusters
            </h4>
            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {visibleProjects.slice(0, 7).map(p => (
                <div
                  key={p.id}
                  onClick={() => flyToProject(p)}
                  className={`p-2 rounded-xl text-xs cursor-pointer transition-colors flex items-center justify-between ${
                    selectedMapProject?.id === p.id 
                      ? 'bg-teal-950/60 border border-teal-500/50 text-white' 
                      : p.isFlaggedDuplicate
                      ? 'bg-rose-950/20 hover:bg-rose-950/40 border border-rose-500/30 text-rose-200'
                      : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <div className="truncate pr-2">
                    <div className="font-semibold truncate">{p.projectName}</div>
                    <div className="text-[10px] text-slate-400">{p.village} ({p.taluka})</div>
                  </div>
                  {p.isFlaggedDuplicate ? (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-500 text-white font-bold shrink-0">
                      Overlap
                    </span>
                  ) : (
                    <span className="text-[10px] text-teal-400 font-mono shrink-0">
                      Fly →
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
