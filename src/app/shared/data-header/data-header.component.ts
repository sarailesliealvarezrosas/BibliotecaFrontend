import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-data-header',
  templateUrl: './data-header.component.html',
  styleUrls: ['./data-header.component.scss']
})
export class DataHeaderComponent {
  @Output() createEmitter = new EventEmitter();
  @Output() consultEmitter = new EventEmitter();
  @Output() notifyEmitter = new EventEmitter();
  @Output() filterEmitter = new EventEmitter();
  // ELIMINA ESTOS DOS:
  // @Output() importEmitter = new EventEmitter();
  // @Output() exportEmitter = new EventEmitter();

  @Input() newShow!: boolean;
  @Input() consultShow!: boolean;
  @Input() notifyShow!: boolean;
  // @Input() headersImport:any[]=[]  // ELIMINA ESTO TAMBIÉN
  @Input() title=''

  public openPopup() {
    this.createEmitter.emit();
  }

  public consult() {
    this.consultEmitter.emit();
  }

  public notify() {
    this.notifyEmitter.emit();
  }

  public filterList(event: any){
    this.filterEmitter.emit(event);
  }


}