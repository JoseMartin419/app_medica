from django.contrib import admin
from .models import Paciente, Consulta, Registro, MedicamentoFrecuente, CIE10Diagnosis, Alergia

# --------------------------
# Admin de Paciente
# --------------------------

@admin.register(Alergia)
class AlergiaAdmin(admin.ModelAdmin):
    search_fields = ['nombre']


@admin.register(Paciente)
class PacienteAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'fecha_nacimiento', 'telefono', 'correo', 'tutor')
    search_fields = ('nombre', 'telefono', 'correo', 'tutor')  # habilita la barra de búsqueda

# --------------------------
# Admin de Consulta
# --------------------------
@admin.register(Consulta)
class ConsultaAdmin(admin.ModelAdmin):
    list_display = ('paciente', 'fecha', 'motivo', 'diagnostico')
    search_fields = ('paciente__nombre', 'motivo', 'diagnostico')  # búsqueda por paciente y campos clave

# --------------------------
# Admin de Registro
# --------------------------
@admin.register(Registro)
class RegistroAdmin(admin.ModelAdmin):
    list_display = ('id', 'fecha', 'total', 'metodo_pago', 'estado_pago')
    search_fields = ('id', 'metodo_pago', 'estado_pago')  # permite buscar por ID y estado de pago

# --------------------------
# Admin de MedicamentoFrecuente
# --------------------------
@admin.register(MedicamentoFrecuente)
class MedicamentoFrecuenteAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'posologia')
    search_fields = ('nombre',)



@admin.register(CIE10Diagnosis)
class CIE10DiagnosisAdmin(admin.ModelAdmin):
    list_display = ('codigo', 'descripcion')
    search_fields = ('codigo', 'descripcion')



