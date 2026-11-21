import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PhotoSectionHeaderComponent } from '../../shared/photo-section-header.component';
import { PhotoSessionTaskIndexComponent } from '../photo-session-task-index/photo-session-task-index.component';

@Component({ selector: 'app-photo-session-task-index-page', imports: [PhotoSectionHeaderComponent, PhotoSessionTaskIndexComponent], styleUrl: '../../photo-session.scss',
  template: `<main class="photo-page" data-section="sessions"><app-photo-section-header section="sessions"><div><span class="eyebrow">SESIÓN FOTOGRÁFICA</span><h1>Tareas de la sesión</h1><p>Actualiza los preparativos que tienes asignados a esta sesión.</p></div></app-photo-section-header>@if (sessionId) { <app-photo-session-task-index [sessionId]="sessionId" /> }</main>` })
export class PhotoSessionTaskIndexPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  sessionId: number | null = null;
  ngOnInit(): void { this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => this.sessionId = Number(params.get('photo_session_id')) || null); }
}
