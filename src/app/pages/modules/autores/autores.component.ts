import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import { Autor } from 'src/app/core/models/autor.models';
import { AutorService } from 'src/app/core/services/api/autores.service';
import { AutorModalComponent } from '../../modals/autor/autor.component';

@Component({
    selector: 'app-autores',
    templateUrl: './autores.component.html',
    styleUrls: ['./autores.component.scss']
})
export class AutoresComponent {

    title = 'Autores';

    breadCrumbItems!: Array<{}>;

    itemsList: any[] = [];
    autoresList: Autor[] = [];
    allAutores: Autor[] = [];
    selectedItems: Autor[] = [];

    loading = true;
    searchTerm = '';
    viewMode: 'table' | 'cards' = 'table';

    headersImport = ['Nombres', 'Apellidos', 'Nacionalidad', 'Fecha Nacimiento', 'Estado'];

    constructor(
        private modalService: NgbModal,
        private autorService: AutorService
    ) {}

    ngOnInit(): void {
        this.breadCrumbItems = [
            { label: '' },
            { label: this.title, active: true }
        ];

        this.itemsList = [
            { name: 'Nombres', prop: 'nombres', visible: true, primary: true },
            { name: 'Apellidos', prop: 'apellidos', visible: true },
            { name: 'Nacionalidad', prop: 'nacionalidad', visible: true },
            { name: 'Fecha Nacimiento', prop: 'fechaNacimiento', visible: true, date: true },
            { name: 'Estado', prop: 'activo', visible: true, tag: true }
        ];

        this.getAutores();
    }

    getSelectedItems(items: Autor[]) {
        this.selectedItems = items;
    }

    toggleViewMode(): void {
        this.viewMode = this.viewMode === 'table' ? 'cards' : 'table';
        localStorage.setItem('dataTableViewMode', this.viewMode);
    }

    openModal(content: Autor | undefined, accion: string, size: string) {
        const modalRef = this.modalService.open(AutorModalComponent, {
            backdrop: 'static',
            size: size
        });

        modalRef.componentInstance.row = content;
        modalRef.componentInstance.accion = accion;

        modalRef.componentInstance.emitList.subscribe(() => {
            this.searchTerm = '';
            this.getAutores();
        });
    }

    performSearch(): void {
        this.applyFilters();
    }

    applyFilters(): void {
        const search = this.searchTerm.toLowerCase().trim();

        this.autoresList = this.allAutores.filter((item: Autor) => {
            return !search ||
                item.nombres?.toLowerCase().includes(search) ||
                item.apellidos?.toLowerCase().includes(search) ||
                item.nacionalidad?.toLowerCase().includes(search) ||
                item.biografia?.toLowerCase().includes(search) ||
                (item.activo ? 'activo' : 'inactivo').includes(search);
        });
    }

    csvFileExport() {
        const itemsToExport = this.selectedItems.length > 0 ? this.selectedItems : this.autoresList;

        const list = itemsToExport.map((item: Autor) => ({
            nombres: item.nombres || '',
            apellidos: item.apellidos || '',
            nacionalidad: item.nacionalidad || '',
            fechaNacimiento: item.fechaNacimiento || '',
            activo: item.activo ? 'ACTIVO' : 'INACTIVO'
        }));

        new ngxCsv(list, this.title, {
            fieldSeparator: ',',
            quoteStrings: '"',
            decimalseparator: '.',
            showLabels: true,
            showTitle: true,
            title: 'Lista de ' + this.title,
            useBom: true,
            noDownload: false,
            headers: this.headersImport
        });
    }

    private getAutores(): void {
        this.loading = true;

        this.autorService.getAll().subscribe({
            next: (data: Autor[]) => {
                this.loading = false;
                this.allAutores = data;
                this.applyFilters();
            },
            error: (error) => {
                this.loading = false;
                console.error('Error al obtener autores', error);
            }
        });
    }
}