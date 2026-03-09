import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchFilterComponent } from './search-filter.component';

describe('SearchFilterComponent', () => {
  let component: SearchFilterComponent;
  let fixture: ComponentFixture<SearchFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchFilterComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should highlight word correctly', () => {
    const paragrafo = 'This is a test paragraph';
    const termo = 'test';
    const result = component.highlightWord(paragrafo, termo);
    expect(result).toContain('<span class="highlight">test</span>');
  });

  it('should update ocorrencias when searching', () => {
    component.paragrafos = ['test 1', 'test 2', 'other'];
    component.termoPesquisa = 'test';
    component.atualizarOcorrencias();
    expect(component.ocorrencias.length).toBe(2);
  });

  it('should toggle search visibility', () => {
    expect(component.isSearchVisible).toBeFalse();
    component.toggleSearch();
    expect(component.isSearchVisible).toBeTrue();
  });
});
