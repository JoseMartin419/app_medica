from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    PacienteListCreateView,
    HistorialPorPaciente,
    ConsultaRetrieveView,
    PacienteRetrieveView,
    EstadisticasDiariasView,
    ProcedimientoViewSet,
    RegistroViewSet,
    MedicamentoFrecuenteViewSet,
    CIE10DiagnosisListAPIView,
    ConsultaListCreateView,
    ConsultasEstadisticasView,
    pacientes_top_consultas,
    generar_receta_pdf,
    pacientes_estadisticas_diarias,
)

# Routers para ViewSets
router = DefaultRouter()
router.register(r'procedimientos', ProcedimientoViewSet)
router.register(r'registros', RegistroViewSet)
router.register(r'medicamentos-frecuentes', MedicamentoFrecuenteViewSet)

# URL patterns de vistas basadas en clases y funciones
urlpatterns = [
    # Pacientes
    path('pacientes/', PacienteListCreateView.as_view(), name='lista-crea-pacientes'),
    path('pacientes/<int:pk>/', PacienteRetrieveView.as_view(), name='detalle-paciente'),

    # Consultas
    path('consultas/', ConsultaListCreateView.as_view(), name='lista-crea-consultas'),
    path('consultas/<int:consulta_id>/', ConsultaRetrieveView.as_view(), name='ver-consulta'),
    path('consultas/paciente/<int:paciente_id>/', HistorialPorPaciente.as_view(), name='historial_por_paciente'),

    # Diagnósticos CIE10
    path('diagnosticos/', CIE10DiagnosisListAPIView.as_view(), name='diagnosticos-cie10'),

    # Recetas PDF
    path('recetas/<int:consulta_id>/', generar_receta_pdf, name='generar_receta_pdf'),

    # Estadísticas
    # path('estadisticas/diarias/', EstadisticasDiariasView.as_view(), name='estadisticas-diarias'),
    path("pacientes/top-consultas/", pacientes_top_consultas, name="pacientes-top-consultas"),
    path("pacientes/estadisticas/diarias/", pacientes_estadisticas_diarias, name="pacientes-estadisticas-diarias"),
    path("consultas/estadisticas/", ConsultasEstadisticasView.as_view(), name="consultas-estadisticas"),



    # Endpoints con routers (ViewSets)
    path('', include(router.urls)),
]


