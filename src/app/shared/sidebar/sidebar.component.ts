import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription, filter } from 'rxjs';

interface NavChild {
  label: string;
  path: string;
}

interface NavItem {
  label: string;
  icon: string;
  path?: string;
  children?: NavChild[];
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {

  @Input() open = true;
  @Output() closeMobile = new EventEmitter<void>();
  @Output() toggleCollapse = new EventEmitter<void>();

  navItems: NavItem[] = [
    { label: 'Apresentação', icon: 'fa-solid fa-house', path: '/quemsomos/apresentacao' },
    {
      label: 'Constitucional', icon: 'fa-solid fa-landmark', path: '/constitucional',
      children: [
        { label: 'Constituição Federal', path: '/constitucional' },
        { label: 'Constitucional Estado SP', path: '/constitucional/constitucional-estado-sp' },
      ]
    },
    {
      label: 'Administrativo', icon: 'fa-solid fa-stamp', path: '/administrativo',
      children: [
        { label: 'LLICA', path: '/administrativo' },
        { label: 'Improbidade Administrativa', path: '/administrativo/administrativo-improbidade' },
        { label: 'Serviços Públicos', path: '/administrativo/administrativo-servicosPublicos' },
        { label: 'Processo Administrativo', path: '/administrativo/administrativo-processo' },
        { label: 'Servidores Públicos', path: '/administrativo/administrativo-servidoresPublicos' },
        { label: 'Parceria Públicos', path: '/administrativo/administrativo-parceriaPublico' },
      ]
    },
    { label: 'Tributário', icon: 'fa-solid fa-file-invoice-dollar', path: '/tributario' },
    {
      label: 'Penal', icon: 'fa-solid fa-gavel', path: '/penal',
      children: [
        { label: 'Código Penal', path: '/penal' },
        { label: 'Código Processo Penal', path: '/penal/processo-penal' },
        { label: 'Crimes Hediondos', path: '/penal/crimes-hediondos' },
        { label: 'Lei Maria da Penha', path: '/penal/lei-maria-penha' },
        { label: 'Lei De Drogas', path: '/penal/lei-de-drogas' },
        { label: 'Organização Criminosa', path: '/penal/lei-organizacao-criminosa' },
        { label: 'Ocultação Bens', path: '/penal/lei-ocultacao-bens' },
      ]
    },
    {
      label: 'Civil', icon: 'fa-solid fa-scale-balanced', path: '/civil',
      children: [
        { label: 'Código Civil', path: '/civil' },
        { label: 'Código Processo Civil', path: '/civil/civil-codigo-processo' },
        { label: 'LINDB', path: '/civil/civil-normas-direito-brasileiro' },
      ]
    },
    { label: 'Contato', icon: 'fa-solid fa-envelope', path: '/admin/contato' },
  ];

  openGroups = new Set<string>();
  private activeUrl = '';
  private routerSub?: Subscription;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.syncOpenGroupWithUrl(this.router.url);
    this.routerSub = this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(event => this.syncOpenGroupWithUrl(event.urlAfterRedirects));
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
  }

  toggleGroup(item: NavItem): void {
    if (this.openGroups.has(item.label)) {
      this.openGroups.delete(item.label);
    } else {
      this.openGroups.add(item.label);
    }
  }

  isGroupOpen(item: NavItem): boolean {
    return this.openGroups.has(item.label);
  }

  isGroupActive(item: NavItem): boolean {
    return !!item.children?.some(child => this.activeUrl.startsWith(child.path));
  }

  onLinkClick(): void {
    this.closeMobile.emit();
  }

  private syncOpenGroupWithUrl(url: string): void {
    this.activeUrl = url;
    for (const item of this.navItems) {
      if (item.children?.some(child => url.startsWith(child.path))) {
        this.openGroups.add(item.label);
      }
    }
  }
}
