import { Component, OnInit, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Categoria } from '../../../models/categoria.model';
import { CategoriaService } from '../../../services/categoria.service';
import { MascotaService } from '../../../services/mascota.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-form-mascota',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="page-head">
      <div><h1>{{ id ? 'Editar Mascota' : 'Nueva Mascota' }}</h1><p>Completa los datos de adopci&oacute;n.</p></div>
      <a class="btn btn-outline-secondary" routerLink="/mascotas">Cancelar</a>
    </div>
    <form class="panel form-grid" [formGroup]="form" (ngSubmit)="guardar()">
      <label>Nombre<input class="form-control" formControlName="nombre"></label>
      <label>Tipo de mascota<select class="form-select" formControlName="especie"><option>Perro</option><option>Gato</option><option>Conejo</option><option>Ave</option><option>Otro</option></select></label>
      <label>Raza<input class="form-control" formControlName="raza"></label>
      <label>A&ntilde;os<input class="form-control" type="number" formControlName="edadAnios"></label>
      <label>Meses adicionales<input class="form-control" type="number" formControlName="edadMeses"></label>
      <label>Estado salud<select class="form-select" formControlName="estadoSalud"><option>SIN NOVEDADES</option><option>EN TRATAMIENTO</option><option>CRITICO</option></select></label>
      <label>Estado adopci&oacute;n<select class="form-select" formControlName="estadoAdopcion"><option>DISPONIBLE</option><option>RESERVADO</option><option>ADOPTADO</option><option>INACTIVO</option></select></label>
      <label>Categor&iacute;a de adopci&oacute;n<select class="form-select" formControlName="idCategoria"><option value="">Sin categor&iacute;a</option>@for (c of categorias; track c.id) {<option [value]="c.id">{{ c.nombre }}</option>}</select></label>
      <label class="span-2">Descripci&oacute;n<textarea class="form-control" formControlName="descripcion" rows="3"></textarea></label>
      <label class="span-2">Imagen<input class="form-control" type="file" accept="image/*" (change)="onFile($event)"></label>
      @if (preview) { <img class="preview" [src]="preview" alt=""> }
      <div class="actions span-2">
        <button class="btn btn-primary" type="submit" [disabled]="form.invalid">Guardar</button>
      </div>
    </form>
  `,
})
export class FormMascotaComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly mascotaService = inject(MascotaService);
  private readonly categoriaService = inject(CategoriaService);
  private readonly toast = inject(ToastService);

  id?: number;
  categorias: Categoria[] = [];
  file?: File;
  preview = '';
  form = this.fb.group({
    nombre: ['', Validators.required],
    especie: ['Perro', Validators.required],
    raza: ['', Validators.required],
    edadAnios: [0, [Validators.required, Validators.min(0)]],
    edadMeses: [0, [Validators.required, Validators.min(0), Validators.max(11)]],
    descripcion: [''],
    estadoSalud: ['SIN NOVEDADES', Validators.required],
    estadoAdopcion: ['DISPONIBLE', Validators.required],
    idCategoria: [''],
  });

  ngOnInit(): void {
    this.categoriaService.getAll().subscribe({
      next: (categorias) => this.categorias = categorias,
      error: () => this.toast.showError('No se pudieron cargar las categorias de adopcion'),
    });
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.id = Number(idParam);
      this.mascotaService.getById(this.id).subscribe({
        next: (m) => {
          this.form.patchValue({
            nombre: m.nombre,
            especie: m.especie,
            raza: m.raza,
            edadAnios: m.edadAnios,
            edadMeses: m.edadMeses,
            descripcion: m.descripcion ?? '',
            estadoSalud: m.estadoSalud,
            estadoAdopcion: m.estadoAdopcion,
            idCategoria: m.categoriaId ? String(m.categoriaId) : '',
          });
          this.preview = this.mascotaService.imageUrl(m.rutaImagen);
        },
        error: (error: HttpErrorResponse) => this.toast.showError(error.error?.mensaje || 'No se pudo cargar la mascota'),
      });
    }
  }

  onFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.file = input.files?.[0];
    if (this.file) this.preview = URL.createObjectURL(this.file);
  }

  guardar(): void {
    const v = this.form.getRawValue();
    const formData = new FormData();
    formData.append('nombre', v.nombre ?? '');
    formData.append('especie', v.especie ?? '');
    formData.append('raza', v.raza ?? '');
    formData.append('edad_anios', String(v.edadAnios ?? 0));
    formData.append('edad_meses', String(v.edadMeses ?? 0));
    formData.append('descripcion', v.descripcion ?? '');
    formData.append('est_salud', v.estadoSalud ?? '');
    formData.append('est_adopcion', v.estadoAdopcion ?? '');
    if (v.idCategoria) formData.append('idCategoria', v.idCategoria);
    if (this.file) formData.append('archivo', this.file);
    const request = this.id ? this.mascotaService.update(this.id, formData) : this.mascotaService.create(formData);
    request.subscribe({
      next: () => {
        this.toast.showSuccess('Mascota guardada');
        void this.router.navigate(['/mascotas']);
      },
      error: (error: HttpErrorResponse) => this.toast.showError(error.error?.mensaje || 'No se pudo guardar la mascota'),
    });
  }
}
