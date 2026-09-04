import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import { Categoria } from 'src/app/core/models/categoria.models';
import { CategoriaService } from 'src/app/core/services/api/categorias.service';
import { CategoriaModalComponent } from '../../modals/categoria/categoria.component';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.scss']
})
export class CategoriasComponent {

  title = 'Categorías';

  breadCrumbItems!: Array<{}>;

  itemsList: any[] = [];
  categoriasList: Categoria[] = [];
  allCategorias: Categoria[] = [];
  selectedItems: Categoria[] = [];

  loading = true;
  searchTerm = '';
  viewMode: 'table' | 'cards' = 'table';

  headersImport = ['Descripción', 'Estado'];

  constructor(
    private modalService: NgbModal,
    private categoriaService: CategoriaService
  ) {}

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: '' },
      { label: this.title, active: true }
    ];

    this.itemsList = [
      { name: 'Descripción', prop: 'descripcion', visible: true, primary: true },
      { name: 'Estado', prop: 'activo', visible: true, tag: true }
    ];

    this.getCategorias();
  }

  getSelectedItems(items: Categoria[]) {
    this.selectedItems = items;
  }

  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'table' ? 'cards' : 'table';
    localStorage.setItem('dataTableViewMode', this.viewMode);
  }

  openModal(content: Categoria | undefined, accion: string, size: string) {
    const modalRef = this.modalService.open(CategoriaModalComponent, {
      backdrop: 'static',
      size: size
    });

    modalRef.componentInstance.row = content;
    modalRef.componentInstance.accion = accion;

    modalRef.componentInstance.emitList.subscribe(() => {
      this.searchTerm = '';
      this.getCategorias();
    });
  }

  performSearch(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    const search = this.searchTerm.toLowerCase().trim();

    this.categoriasList = this.allCategorias.filter((item: Categoria) => {
      return !search ||
        item.descripcion?.toLowerCase().includes(search) ||
        (item.activo ? 'activo' : 'inactivo').includes(search);
    });
  }

  csvFileExport() {
    const itemsToExport = this.selectedItems.length > 0 ? this.selectedItems : this.categoriasList;

    const list = itemsToExport.map((item: Categoria) => ({
      descripcion: item.descripcion || '',
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

  private getCategorias(): void {
    this.loading = true;

    this.categoriaService.getAll().subscribe({
      next: (data: Categoria[]) => {
        this.loading = false;
        this.allCategorias = data;
        this.applyFilters();
      },
      error: (error) => {
        this.loading = false;
        console.error('Error al obtener categorías', error);
      }
    });
  }
}