
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    PacienteListCreateView,
    ConsultaCreateView,
    HistorialPorPaciente,
    ConsultaRetrieveView,
    PacienteRetrieveView,
    EstadisticasDiariasView,
    ProcedimientoViewSet,
    RegistroViewSet,
    MedicamentoFrecuenteViewSet,
    CIE10DiagnosisListAPIView
)



router = DefaultRouter()
router.register(r'procedimientos', ProcedimientoViewSet)
router.register(r'registros', RegistroViewSet)
router.register(r'medicamentos-frecuentes', MedicamentoFrecuenteViewSet)


urlpatterns = [
    path('', PacienteListCreateView.as_view(), name='lista-crea-pacientes'),
    path('<int:pk>/', PacienteRetrieveView.as_view(), name='detalle-paciente'),
    path('consultas/', ConsultaCreateView.as_view(), name='crear-consulta'),
    path('historial/<int:paciente_id>/', HistorialPorPaciente.as_view(), name='historial_por_paciente'),    
    path('consultas/<int:consulta_id>/', ConsultaRetrieveView.as_view(), name='ver-consulta'),
    path('api/consultas/paciente/<int:paciente_id>/', HistorialPorPaciente.as_view()),
    path('estadisticas/diarias/', EstadisticasDiariasView.as_view(), name='estadisticas-diarias'),
    path('diagnosticos/', CIE10DiagnosisListAPIView.as_view(), name='diagnosticos-cie10'),
    
    path('', include(router.urls)),
    
    ] 




