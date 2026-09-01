import { Component, OnInit, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';
import { TranslateService } from '@ngx-translate/core';

import { Alert } from 'src/app/core/models/alert.models';
import { EventService } from 'src/app/core/services/event.service';
import { Subject, takeUntil, forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AlertService } from 'src/app/core/services/api/alerts.service';

interface NotificationItem {
  avatar: string;
  name: string;
  message: string;
  cost: string;
  time_ago: Date | string;
  stateItem: string;
  read: boolean;
  checkboxId: string;
  originalEvent: Alert;
  type: string;
  priority: 'low' | 'medium' | 'high';
}
@Component({
  selector: 'app-notices',
  templateUrl: './notices.component.html',
  styleUrls: ['./notices.component.scss']
})
export class NoticesComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  avatar = "default-profile1.png";
  alertsList: Alert[] = [];
  allNotifications: NotificationItem[] = []; 
  messages: NotificationItem[] = [];        
  alerts: NotificationItem[] = [];
  
  selectedNotifications: Set<string> = new Set();
  isLoading = false;
  lastUpdateTime: Date | null = null;
  
  totalNotifications = 0;
  unreadCount = 0;
  alertsCount = 0;
  
  isDropdownOpen = false;
  activeTab = 1;
  refreshInterval: any;

  @ViewChild('removenotification') removenotification!: TemplateRef<any>;

  constructor(
    private eventService: EventService,
    private modalService: NgbModal,
    private cookieService: CookieService, 
    public translate: TranslateService,  
    private alertService: AlertService
  ) { }
  
  async ngOnInit() {
   this.avatar = "default-profile1.png";
   await this.loadNotifications();
    this.refreshInterval = setInterval(() => {
      this.loadNotifications();
    }, 300000);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }
  
  async loadNotifications() {
    this.isLoading = true;
    try {
      await this.getAlerts();
      this.processNotifications();
      this.filterNotifications();
      this.updateCounters();
      this.lastUpdateTime = new Date();
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      this.isLoading = false;
    }
  }  

  private processNotifications() {
    this.allNotifications = this.alertsList.map((alert: Alert) => {
      let message = alert.mensaje;
      let cost = '';
      let stateItem = '';
      let priority: 'low' | 'medium' | 'high' = 'medium';
      if (alert.infraccionDto) {
        message = `Infracción ${alert.infraccionDto.tipoInfraccionDto.grado.toLowerCase()} - ${alert.mensaje}`;
        cost = `Valor UFV: ${alert.infraccionDto.tipoInfraccionDto.valorUFV}`;
        stateItem = alert.estado ? 'Activa' : 'Inactiva';
        priority = 'high';
      } else if (alert.notificacionDto) {
        message = `Notificación: ${alert.mensaje}`;
        stateItem = alert.esLeido ? 'Leída' : 'No leída';
        priority = alert.esLeido ? 'low' : 'medium';
      } else {
        stateItem = alert.estado ? 'Activa' : 'Inactiva';
        priority = alert.tipo === 'URGENTE' ? 'high' : 'medium';
      }

      return {
        originalEvent: alert,
        avatar: this.getIcon(alert.tipo),
        name: alert.tipo,
        message: message,
        cost: cost,
        time_ago: alert.fechaAlerta,
        stateItem: stateItem,
        read: alert.esLeido,
        checkboxId: alert.uuid || '',
        type: alert.tipo,
        priority: priority
      };
    });
  }
  
  private filterNotifications() {
    this.messages = this.allNotifications.filter(
      notification => !notification.read
    );

    this.alerts = this.allNotifications.filter(
      notification =>
        ['ALERTA', 'URGENTE', 'INFRACCION'].includes(notification.type) &&
        notification.originalEvent.estado
    );
  }


  private updateCounters() {
    this.totalNotifications = this.allNotifications.length;
    this.unreadCount = this.messages.length;
    this.alertsCount = this.alerts.length;
  }
areAllMessagesSelected(): boolean {
  return this.messages.length > 0 && this.messages.every(m => this.selectedNotifications.has(m.checkboxId));
}

areAllAlertsSelected(): boolean {
  return this.alerts.length > 0 && this.alerts.every(a => this.selectedNotifications.has(a.checkboxId));
}
  getIcon(tipo: string): string {
    const iconMap: Record<string, string> = {
      'NOTIFICACION': 'pi pi-bell',
      'INFRACCION': 'pi pi-times-circle',
      'ALERTA': 'pi pi-exclamation-triangle',
      'INFORME': 'pi pi-file',
      'URGENTE': 'pi pi-exclamation-circle'
    };
    return iconMap[tipo] || 'pi pi-question-circle';
  }

  getBadgeStatus(value: string): string {
    const statusMap: Record<string, string> = {
      'Activo': 'success',
      'Bloqueado': 'warning',
      'Pagado': 'success',
      'Pendiente': 'secondary',
      'Vencido': 'danger',
      'Anulado': 'warning',
      'Con Orden': 'success',
      'Sin Orden': 'secondary',
      'Leída': 'success',
      'No leída': 'warning',
      'Activa': 'success',
      'Inactiva': 'danger'
    };
    return statusMap[value] || 'info';
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return '';
    }
  }

  markAsRead(notificationId: string) {
    const notification = this.allNotifications.find(n => n.checkboxId === notificationId);
    if (notification && !notification.read) {
      notification.read = true;
      notification.originalEvent.esLeido = true;
      notification.stateItem = 'Leída';
      notification.priority = 'low';
      this.alertService.update(notification.originalEvent)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (updatedAlert) => {
            this.filterNotifications();
            this.updateCounters();
          },
          error: (err) => {
            console.error('Error marking notification as read:', err);
            notification.read = false;
            notification.originalEvent.esLeido = false;
            notification.stateItem = 'No leída';
            notification.priority = 'medium';
          }
        });
    }
  }

  markAllAsRead() {
    const unreadNotifications = this.allNotifications.filter(n => !n.read);
    
    if (unreadNotifications.length === 0) {
      return;
    }    
    this.isLoading = true;
    unreadNotifications.forEach(notification => {
      notification.read = true;
      notification.originalEvent.esLeido = true;
      notification.stateItem = 'Leída';
      notification.priority = 'low';
    });
    const updateRequests = unreadNotifications.map(notification => 
      this.alertService.update(notification.originalEvent).pipe(
        catchError(error => {
          console.error('Error updating notification:', notification.checkboxId, error);
          notification.read = false;
          notification.originalEvent.esLeido = false;
          notification.stateItem = 'No leída';
          notification.priority = 'medium';
          return of(null);
        })
      )
    );
    forkJoin(updateRequests)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (results) => {
          this.filterNotifications();
          this.updateCounters();
        },
        error: (err) => {
          console.error('Error in bulk mark as read:', err);
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }

  selectAll(event: Event, currentList: NotificationItem[] = this.allNotifications) {
    const target = event.target as HTMLInputElement;
    const isChecked = target.checked;
    if (isChecked) {
      currentList.forEach(notification => {
        this.selectedNotifications.add(notification.checkboxId);
      });
    } else {
      currentList.forEach(notification => {
        this.selectedNotifications.delete(notification.checkboxId);
      });
    }
  }

  onCheckboxChange(notification: NotificationItem, event: Event) {
    const target = event.target as HTMLInputElement;
    const isChecked = target.checked;
    if (isChecked) {
      this.selectedNotifications.add(notification.checkboxId);
      if (!notification.read) {
        this.markAsRead(notification.checkboxId);
      }
    } else {
      this.selectedNotifications.delete(notification.checkboxId);
    }
  }

  openDeleteModal() {
    if (this.selectedNotifications.size > 0) {
      this.modalService.open(this.removenotification, { centered: true });
    }
  }

  deleteSelectedNotifications() {
    if (this.selectedNotifications.size === 0) {
      return;
    }    
    const selectedIds = Array.from(this.selectedNotifications);
    this.isLoading = true;    
    const deleteRequests = selectedIds.map(id => 
      this.alertService.delete(id).pipe(
        catchError(error => {
          console.error('Error deleting notification:', id, error);
          return of(null);
        })
      )
    );
    
    forkJoin(deleteRequests)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (results) => {
          selectedIds.forEach(id => {
            this.allNotifications = this.allNotifications.filter(n => n.checkboxId !== id);
          });
          this.selectedNotifications.clear();
          this.filterNotifications();
          this.updateCounters();
          this.modalService.dismissAll();
        },
        error: (err) => {
          console.error('Error in bulk delete:', err);
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }
  
  dismissAlert(alertId: string) {
    const alertIndex = this.alerts.findIndex(a => a.checkboxId === alertId);
    if (alertIndex !== -1) {
      const alert = this.alerts[alertIndex];
      alert.originalEvent.estado = false;
      alert.stateItem = 'Inactiva';
      this.alertService.update(alert.originalEvent)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.alerts.splice(alertIndex, 1);
            this.filterNotifications();
            this.updateCounters();
          },
          error: (err) => {
            console.error('Error dismissing alert:', err);
            alert.originalEvent.estado = true;
            alert.stateItem = 'Activa';
          }
        });
    }
  }

  refreshNotifications() {
    this.loadNotifications();
  }

  trackByNotificationId(index: number, item: NotificationItem): string {
    return item.checkboxId;
  }

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  onTabChange(tabId: number) {
    this.activeTab = tabId;
    this.selectedNotifications.clear();
  }

  getCurrentTabNotifications(): NotificationItem[] {
    switch (this.activeTab) {
      case 1: return this.allNotifications;
      case 2: return this.messages;
      case 3: return this.alerts;
      default: return this.allNotifications;
    }
  }

  isAllSelected(): boolean {
    const currentList = this.getCurrentTabNotifications();
    return currentList.length > 0 && currentList.every(n => this.selectedNotifications.has(n.checkboxId));
  }

  isSomeSelected(): boolean {
    const currentList = this.getCurrentTabNotifications();
    return currentList.some(n => this.selectedNotifications.has(n.checkboxId));
  }

  getSelectedCount(): number {
    return this.selectedNotifications.size;
  }

  clearSelection() {
    this.selectedNotifications.clear();
  }

  /* API REQUESTS */
  private getAlerts(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.alertService.getAll()
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res: Alert[]) => {
            this.alertsList = res || [];
            resolve();
          },
          error: (err) => {
            console.error('Error fetching alerts:', err);
            this.alertsList = [];
            reject(err);
          }
        });
    });
  }

  windowScroll() {
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
      (document.getElementById("back-to-top") as HTMLElement).style.display = "block";
      document.getElementById('page-topbar')?.classList.add('topbar-shadow');
    } else {
      (document.getElementById("back-to-top") as HTMLElement).style.display = "none";
      document.getElementById('page-topbar')?.classList.remove('topbar-shadow');
    }
  }

  closeBtn() {
    var searchOptions = document.getElementById("search-close-options") as HTMLAreaElement;
    var dropdown = document.getElementById("search-dropdown") as HTMLAreaElement;
    var searchInputReponsive = document.getElementById("search-options") as HTMLInputElement;
    dropdown?.classList.remove("show");
    searchOptions?.classList.add("d-none");
    if (searchInputReponsive) {
      searchInputReponsive.value = "";
    }
  }
}