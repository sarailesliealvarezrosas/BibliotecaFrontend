import { ChangeDetectorRef ,EventEmitter,  Input, Output,  Component,  OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscriber } from 'rxjs';
import * as L from 'leaflet';
import { OpenStreetMapProvider, GeoSearchControl} from 'leaflet-geosearch';
import 'leaflet-filelayer';
import 'leaflet-omnivore';
import 'leaflet.locatecontrol';
import 'leaflet-fullscreen';

declare global { interface Window {
    omnivore: { kml(url: string): any;}
}}

@Component({
  selector: 'app-map',
  templateUrl: './leaflet.component.html',
  styleUrls: ['./leaflet.component.scss']
})
export class LeafletComponent implements OnInit {
  @Input() title: string='Mapa';
  @Input() embed:boolean=false;
  @Input() form:boolean=false;
  @Input() kmlUrl!: string;
  @Input() latitud!: any;
  @Input() longitud!: any;
  @Input() address!: string;
  @Output('latLngEmitter') latLngEmitter = new EventEmitter();

  provider!: any;
  mapa!: L.Map;
  marcadores = L.featureGroup();
  icon= L.icon({
    iconUrl: 'assets/icons/pin-Map_icon.svg ',   
    // shadowUrl: 'assets/marker-shadow.png',
    iconSize: [28/* 25 */, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
  
  constructor(
    private http: HttpClient,
    private activeModal: NgbActiveModal,
    private cdr: ChangeDetectorRef
  ) { this.provider = new OpenStreetMapProvider(); }


  ngOnInit(): void {
    if (!this.latitud || !this.longitud) {
      // this.getUserLocation().then(location => {
      //   if (location) {
      //     this.latitud = location.latitude;
      //     this.longitud = location.longitude;
      //   } else {
          this.latitud = -17.39753966183384;
          this.longitud = -66.28070536289276;
        }
      //   this.setupMapComponents();
      //   // this.cdr.detectChang();
      // });
    // } else {
      this.setupMapComponents();
    // }    
  }
    
  private setupMapComponents(lat = this.latitud, lng = this.longitud) {
    this.mapa = L.map('map').setView([lat, lng], 14);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 25, minZoom: 3,
    }).addTo(this.mapa);
  
    let marcador = L.marker([lat, lng], {
      icon: this.icon,
      draggable: this.form,
      autoPan: true
    });
  
    marcador.addTo(this.mapa);
    this.marcadores.addLayer(marcador);
    this.marcadores.addTo(this.mapa);
    
    if (this.kmlUrl) {
      this.loadKmlLayer(this.kmlUrl);
    }
    
    if(this.form) {
      const buscador = GeoSearchControl({
        provider: this.provider,
        style: '',
        showMarker: false,
      });
      this.mapa.addControl(buscador);
            
      this.mapa.on('geosearch/showlocation', (position: any) => {
        this.marcadores.clearLayers();
        this.mapa.setView([position.location.y, position.location.x]);
        const marcador = L.marker([position.location.y, position.location.x], {
          icon: this.icon,
          draggable: true,
          autoPan: true
        }).addTo(this.mapa);
        this.marcadores.addLayer(marcador);
        this.moverMarcador(marcador, this.mapa, null);
      });
      // Add fullscreen control
      // this.mapa.addControl(new (L.Control as any).Fullscreen({
      //   position: 'topleft',
      //   title: 'Show me the fullscreen!',
      //   titleCancel: 'Exit fullscreen'
      // }));

      // Add Locate Control (Fix TypeScript Issue)
      // this.mapa.addControl(new (L.Control as any).Locate({
      //   position: 'topright',
      //   drawCircle: true,
      //   keepCurrentZoomLevel: true,
      //   showPopup: false,
      //   strings: {
      //     title: "Ubicar mi posición"
      //   }
      // })); 
    }
    
    this.moverMarcador(marcador, this.mapa, null);
  }

  private loadKmlLayer(kmlUrl: string) {
    // if (window.omnivore) {
      const kmlLayer = window.omnivore.kml(kmlUrl).on('ready', () => {
        const bounds = this.marcadores.getBounds().extend(kmlLayer.getBounds());
        this.mapa.fitBounds(bounds);
      }).on('error', (e: any) => {
        console.error('Error loading KML:', e);
      });
      kmlLayer.addTo(this.mapa);
    // } else {
    //   this.loadKmlWithFetch(kmlUrl);
    // }
  }
  
  private loadKmlWithFetch(kmlUrl: string) {
    // This is an alternative approach that doesn't require the omnivore plugin
    fetch(kmlUrl)
      .then(response => response.text())
      .then(kmlText => {
        // Use a script tag to import the Leaflet KML parser dynamically
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet-kml@1.0.1/L.KML.js';
        script.onload = () => {
          try {
            // Create a temporary DOM element to parse the KML
            const parser = new DOMParser();
            const kmlDoc = parser.parseFromString(kmlText, 'text/xml');
            
            // @ts-ignore - The L.KML will be available after the script loads
            const kmlLayer = new L.KML(kmlDoc);
            kmlLayer.addTo(this.mapa);
            
            // Zoom to KML bounds while keeping the marker in view
            const bounds = this.marcadores.getBounds().extend(kmlLayer.getBounds());
            this.mapa.fitBounds(bounds);
          } catch (e) {
            console.error('Error parsing KML:', e);
          }
        };
        document.head.appendChild(script);
      })
      .catch(error => {
        console.error('Error fetching KML:', error);
      });
  }

  private getUserLocation(): Promise<{latitude: number, longitude: number} | null> {
    return new Promise((resolve) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            });
          },
          (error) => {
            console.error('Error getting user location:', error);
            resolve(null);
          },
          { timeout: 5000, enableHighAccuracy: true }
        );
      } else {
        console.warn('Geolocation is not supported by this browser.');
        resolve(null);
      }
    });
  }

  private getCurrentPosition(): any {
    return new Observable((observer: Subscriber<any>) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position: any) => {
          observer.next({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          observer.complete();
        });
      } else {
        observer.error();
      }
    });
  }

  public moverMarcador(marcador:any, mapa:any, geocodeService:any) {
            let position = marcador.getLatLng();
            mapa.panTo(new L.LatLng(position.lat, position.lng));
            this.setLatLng(position);
        marcador.on('moveend', (e:any) => {
            let position = marcador.getLatLng();
            mapa.panTo(new L.LatLng(position.lat, position.lng));
            this.setLatLng(position);
        });
    }

  private setLatLng({ lat, lng }: { lat: number, lng: number }) {
    this.getAddress(lat,lng);
    this.latitud = lat;
    this.longitud = lng;
  }
  getAddress(lat: number, lng: number) {
    this.http.get(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=7fc648af73b44797bbf7e52b584cea51`)
      .subscribe((response:any) => {
        const address = response['results'][0]['formatted'];
        this.address=address
      });
  }

  public guardarUbicacion() {
    let latLng = {
      lat: this.latitud,
      lng: this.longitud,
      dir: this.address
    }
    this.latLngEmitter.emit(latLng);
    if(!this.embed){
     this.activeModal.close();
    }
  }
  
  public cerrarMapa() {
    this.activeModal.close();
  }
}
