from rest_framework.generics import ListCreateAPIView, CreateAPIView
from rest_framework.response import Response
from rest_framework.views import APIView
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from .models import Paciente, Consulta, Procedimiento, Registro, CIE10Diagnosis
from .serializers import PacienteSerializer, ConsultaSerializer, ProcedimientoSerializer, RegistroSerializer, CIE10DiagnosisSerializer
import io
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from rest_framework import status, viewsets
from rest_framework.generics import RetrieveAPIView
from django.conf import settings
import os
from django.templatetags.static import static
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.utils.timezone import localtime
from django.utils import timezone
from django.db.models import Count, Q
from django.db import models
from datetime import date, timedelta
from rest_framework import viewsets
from rest_framework import generics
from django.db.models.functions import TruncDay, TruncWeek, TruncMonth, TruncYear

class ProcedimientoViewSet(viewsets.ModelViewSet):
    queryset = Procedimiento.objects.all()
    serializer_class = ProcedimientoSerializer


class RegistroViewSet(viewsets.ModelViewSet):
    queryset = Registro.objects.all().order_by('-fecha')
    serializer_class = RegistroSerializer


# views.py
from rest_framework import viewsets, filters
from .models import MedicamentoFrecuente
from .serializers import MedicamentoFrecuenteSerializer


class MedicamentoFrecuenteViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = MedicamentoFrecuente.objects.all()
    serializer_class = MedicamentoFrecuenteSerializer
    filter_backends = [filters.SearchFilter]  # ✅ agrega esta línea
    search_fields = ['nombre']


@api_view(['GET'])
def obtener_consultas(request):
    consultas = Consulta.objects.all().order_by('-fecha')
    serializer = ConsultaSerializer(consultas, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def obtener_historial_por_paciente(request, pk):
    consultas = Consulta.objects.select_related('paciente').filter(paciente_id=pk).order_by('-fecha')
    serializer = ConsultaSerializer(consultas, many=True)
    return Response(serializer.data)


#-------------------------------
# Certificados Médicos
#-------------------------------
from rest_framework import generics
from .models import CertificadoMedico
from .serializers import CertificadoMedicoSerializer

class CertificadoMedicoListCreateView(generics.ListCreateAPIView):
    queryset = CertificadoMedico.objects.all()
    serializer_class = CertificadoMedicoSerializer

class CertificadoMedicoDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = CertificadoMedico.objects.all()
    serializer_class = CertificadoMedicoSerializer


#-------------------------------
# Estadísticas
#-------------------------------
class EstadisticasDiariasView(APIView):
    def get(self, request):
        hoy = date.today()
        semana = hoy - timedelta(days=6)
        consultas = Consulta.objects.filter(fecha__date__gte=semana) \
            .values('fecha__date').annotate(count=Count('id')).order_by('fecha__date')
        data = [{'fecha': str(item['fecha__date']), 'count': item['count']} for item in consultas]
        return Response(data)


from rest_framework import viewsets, filters
from .models import Alergia
from .serializers import AlergiaSerializer

class AlergiaViewSet(viewsets.ModelViewSet):
    queryset = Alergia.objects.all().order_by("nombre")
    serializer_class = AlergiaSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["nombre"]


class PacienteViewSet(viewsets.ModelViewSet):
    queryset = Paciente.objects.all().order_by("id")
    serializer_class = PacienteSerializer


class PacienteRetrieveView(RetrieveAPIView):
    queryset = Paciente.objects.all()
    serializer_class = PacienteSerializer

class PacienteListCreateView(ListCreateAPIView):
    queryset = Paciente.objects.all()
    serializer_class = PacienteSerializer

from rest_framework import generics

class ConsultaListCreateView(generics.ListCreateAPIView):
    serializer_class = ConsultaSerializer

    def get_queryset(self):
        qs = Consulta.objects.select_related('paciente').order_by('-fecha')
        q = self.request.query_params.get('q', '').strip()
        if q:
            qs = qs.filter(
                Q(motivo__icontains=q) |
                Q(diagnostico__icontains=q) |
                Q(paciente__nombre__icontains=q) |
                Q(paciente__apellido_paterno__icontains=q)
            )
        return qs

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        page = int(request.query_params.get('page', 1))
        page_size = int(request.query_params.get('page_size', 25))
        offset = (page - 1) * page_size
        total = queryset.count()
        items = queryset[offset: offset + page_size]
        serializer = self.get_serializer(items, many=True)
        return Response({
            'results': serializer.data,
            'total': total,
            'page': page,
            'page_size': page_size,
            'has_more': offset + page_size < total,
        })

 
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            consulta = serializer.save()
            receta_url = f"/api/recetas/{consulta.id}/"
            return Response({
                "mensaje": "Consulta guardada correctamente",
                "consulta_id": consulta.id,
                "url_receta": receta_url
            }, status=status.HTTP_201_CREATED)
        else:
            print("❌ Errores de validación:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ConsultaRetrieveView(APIView):
    def get(self, request, consulta_id):
        consulta = get_object_or_404(Consulta, id=consulta_id)
        serializer = ConsultaSerializer(consulta)
        return Response(serializer.data, status=status.HTTP_200_OK)

class HistorialPorPaciente(APIView):
    def get(self, request, paciente_id):
        consultas = Consulta.objects.select_related('paciente').filter(paciente__id=paciente_id).order_by('-fecha')
        serializer = ConsultaSerializer(consultas, many=True)
        return Response(serializer.data)


from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.colors import HexColor
from django.http import HttpResponse
from .models import Consulta
from datetime import date
from reportlab.lib.utils import ImageReader

def calcular_edad(fecha_nacimiento):
    hoy = date.today()
    return hoy.year - fecha_nacimiento.year - ((hoy.month, hoy.day) < (fecha_nacimiento.month, fecha_nacimiento.day))

def generar_receta_pdf(request, consulta_id):
    consulta = Consulta.objects.get(id=consulta_id)
    paciente = consulta.paciente
    edad = calcular_edad(paciente.fecha_nacimiento)

    # Colores
    azul_oscuro = HexColor("#1E3A8A")
    gris_claro = HexColor("#E5E7EB")
    gris_texto = HexColor("#374151")

    # Crear PDF
    response = HttpResponse(content_type="application/pdf")
    response["Content-Disposition"] = 'inline; filename="receta_profesional.pdf"'
    p = canvas.Canvas(response, pagesize=letter)
    width, height = letter

    def dibujar_receta(y_start, c):
        # Fondo principal
        p.setFillColor(gris_claro)
        p.roundRect(40, y_start - 320, width - 80, 250, 12, stroke=0, fill=1)

        # Marca de agua
        try:
            fondo_path = os.path.join(os.path.dirname(__file__), "static", "fondo.png")
            fondo = ImageReader(fondo_path)
            p.saveState()
            p.setFillAlpha(0.2)
            ancho_fondo = 300
            alto_fondo = 300
            x_fondo = 40 + (width - 80 - ancho_fondo) * 0.62  # desplazada a la derecha
            y_fondo = (y_start - 320) + (250 - alto_fondo) / 2
            p.drawImage(
                fondo,
                x_fondo,
                y_fondo,
                width=ancho_fondo,
                height=alto_fondo,
                preserveAspectRatio=True,
                mask="auto",
            )
            p.restoreState()
        except:
            pass

        # 🔹 Forzar opacidad normal para el texto posterior
        try:
            p.setFillAlpha(1)
        except:
            pass

        # Logo
        try:
            logo_path = os.path.join(os.path.dirname(__file__), "static", "logo.png")
            logo = ImageReader(logo_path)
            p.drawImage(
                logo, x=40, y=y_start - 60, width=80, height=80, preserveAspectRatio=True, mask="auto"
            )
        except Exception as e:
            print("No se pudo cargar el logo:", e)

        # Encabezado
        p.setFillColor(azul_oscuro)
        p.setFont("Helvetica-Bold", 16)
        # p.drawCentredString(width / 2, y_start, "Consultorio Médico La Silla")
        p.drawCentredString(width / 2, y_start, "Fundación Best")
        

        p.setFont("Helvetica-Bold", 11)
        p.drawCentredString(width / 2, y_start - 20, "Dr. José Martín González Durán")
        p.setFont("Helvetica", 9)
        p.drawCentredString(width / 2, y_start - 34, "Cédula Profesional: 12949813 • U.A.N.L.")
        p.setFont("Helvetica", 9)
        # p.drawCentredString(width / 2, y_start - 48, "Pedregal de la Marea #6700, C.P. 64898, Cd. Monterrey, N.L.")
        p.drawCentredString(width / 2, y_start - 48, "Av. Lazaro Cárdenas #4332, Col. Las Torres, C.P. 64930, Cd. Monterrey, N.L.")

        # QR
        try:
            qr_path = os.path.join(os.path.dirname(__file__), "static", "qr.png")
            qr = ImageReader(qr_path)
            p.drawImage(qr, width - 90, y_start - 35, width=50, height=50, preserveAspectRatio=True, mask="auto")
        except Exception as e:
            print("Error al cargar QR:", e)

        # Fecha
        p.setFont("Helvetica", 9)
        p.setFillColor(gris_texto)
        fecha_local = timezone.localtime(c.fecha)
        p.drawRightString(width - 40, y_start - 45, f"Fecha: {fecha_local.strftime('%d/%m/%Y')}")

        # fecha manual
        # p.drawRightString(width - 40, y_start - 45, "Fecha: 14/04/2026")

        # Datos del paciente
        p.setFillColor(gris_texto)
        p.setFont("Helvetica-Bold", 10)
        p.drawString(55, y_start - 68, "Nombre:")
        p.setFont("Helvetica", 10)
        p.drawString(110, y_start - 68, paciente.nombre)

        p.setFont("Helvetica-Bold", 10)
        p.drawString(350, y_start - 68, "Edad:")
        p.setFont("Helvetica", 10)
        p.drawString(390, y_start - 68, f"{edad} años")

        p.setFont("Helvetica-Bold", 10)
        p.drawString(450, y_start - 68, "Nacimiento:")
        p.setFont("Helvetica", 10)
        p.drawString(525, y_start - 68, paciente.fecha_nacimiento.strftime("%d/%m/%Y"))

        p.setFont("Helvetica-Bold", 10)
        p.drawString(55, y_start - 82, "Antecedentes:")
        p.setFont("Helvetica", 10)
        p.drawString(140, y_start - 82, c.antecedentes or "")

        # 🔹 Tratamiento
        p.setFont("Helvetica-Bold", 11)
        p.setFillColor(azul_oscuro)
        p.drawString(55, y_start - 105, "Tratamiento:")

        y = y_start - 120
        for i, item in enumerate(c.tratamiento):
            nombre = item.get("nombre", "").strip()
            posologia = item.get("posologia", "").strip()
            duracion = item.get("duracion", "").strip()

            if not nombre and not posologia:
                continue

            p.setFont("Helvetica-Bold", 10)
            p.setFillColor(gris_texto)
            p.drawString(65, y, f"{i+1}. {nombre}")

            # Texto de posología visible e imprimible (sin gris claro)
            if posologia:
                p.setFont("Helvetica", 10)
                p.setFillColor(gris_texto)
                p.drawString(80, y - 12, posologia)

            if duracion:
                p.setFont("Helvetica", 9)
                p.setFillColor(gris_texto)
                p.drawString(80, y - 24, f"Duración: {duracion}")

            y -= 32
            if y < y_start - 290:
                break

        # Signos vitales
        signos_y = y_start - 110
        p.setFont("Helvetica-Bold", 11)
        p.setFillColor(azul_oscuro)
        p.drawString(430, signos_y, "Signos vitales:")

        p.setFont("Helvetica", 9)
        p.setFillColor(gris_texto)
        signos = []
        if c.presion_arterial: signos.append(f"T/A: {c.presion_arterial}")
        if c.frecuencia_cardiaca: signos.append(f"FC: {c.frecuencia_cardiaca}")
        if c.frecuencia_respiratoria: signos.append(f"FR: {c.frecuencia_respiratoria}")
        if c.glucometria: signos.append(f"Gluco: {c.glucometria}")
        if c.oximetria: signos.append(f"Sat O2: {c.oximetria}")
        if c.peso: signos.append(f"Peso: {c.peso} kg")
        if c.talla: signos.append(f"Talla: {c.talla} m")
        if c.imc: signos.append(f"IMC: {c.imc}")
        if c.paciente.alergias.exists():
            alergias_list = ", ".join(c.paciente.alergias.values_list("nombre", flat=True))
            signos.append(f"Alergias: {alergias_list}")

        y_actual = signos_y - 15
        for signo in signos:
            p.drawString(430, y_actual, signo)
            y_actual -= 15

        # Firma
        firma_y = y_start - 290
        p.line(width - 200, firma_y, width - 60, firma_y)
        try:
            firma_path = os.path.join(os.path.dirname(__file__), "static", "firma.png")
            firma = ImageReader(firma_path)
            p.drawImage(firma, x=width - 180, y=firma_y + 8, width=100, preserveAspectRatio=True, mask="auto")
        except Exception as e:
            print("No se pudo cargar la firma:", e)

        p.drawRightString(width - 90, firma_y - 12, "Firma del médico")

    # Dibuja ambas recetas
    dibujar_receta(763, consulta)
    p.setDash(1, 3)
    p.line(40, height / 2, width - 40, height / 2)
    p.setDash()
    dibujar_receta(360, consulta)

    p.showPage()
    p.save()
    return response




from rest_framework import generics
from rest_framework.filters import SearchFilter
from .models import CIE10Diagnosis
from .serializers import CIE10DiagnosisSerializer

class CIE10DiagnosisListAPIView(generics.ListAPIView):
    queryset = CIE10Diagnosis.objects.all()
    serializer_class = CIE10DiagnosisSerializer
    filter_backends = [SearchFilter]
    search_fields = ['codigo', 'descripcion']  # permite buscar por ambos


from django.db.models import Count
from django.db.models.functions import TruncDay, TruncWeek, TruncMonth, TruncYear
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Consulta


class ConsultasEstadisticasView(APIView):
    def get(self, request):
        try:
            # --- Consultas por día ---
            consultas_por_dia = (
                Consulta.objects.annotate(fecha=TruncDay("fecha"))
                .values("fecha")
                .annotate(consultas=Count("id"))
                .order_by("fecha")
            )
            consultas_por_dia = [
                {
                    "fecha": c["fecha"].strftime("%d/%m/%Y") if c["fecha"] else None,
                    "consultas": c["consultas"],
                }
                for c in consultas_por_dia
            ]

            # --- Consultas por semana ---
            consultas_por_semana = (
                Consulta.objects.annotate(semana=TruncWeek("fecha"))
                .values("semana")
                .annotate(consultas=Count("id"))
                .order_by("semana")
            )
            consultas_por_semana = [
                {
                    "semana": f"Semana {c['semana'].isocalendar()[1]} - {c['semana'].strftime('%Y')}"
                    if c["semana"] else None,
                    "consultas": c["consultas"],
                }
                for c in consultas_por_semana
            ]

            # --- Consultas por mes ---
            consultas_por_mes = (
                Consulta.objects.annotate(mes=TruncMonth("fecha"))
                .values("mes")
                .annotate(consultas=Count("id"))
                .order_by("mes")
            )
            consultas_por_mes = [
                {
                    "mes": c["mes"].strftime("%m/%Y") if c["mes"] else None,
                    "consultas": c["consultas"],
                }
                for c in consultas_por_mes
            ]

            # --- Consultas por año ---
            consultas_por_anio = (
                Consulta.objects.annotate(anio=TruncYear("fecha"))
                .values("anio")
                .annotate(consultas=Count("id"))
                .order_by("anio")
            )
            consultas_por_anio = [
                {
                    "anio": c["anio"].strftime("%Y") if c["anio"] else None,
                    "consultas": c["consultas"],
                }
                for c in consultas_por_anio
            ]

            # --- Respuesta final ---
            return Response(
                {
                    "por_dia": consultas_por_dia,
                    "por_semana": consultas_por_semana,
                    "por_mes": consultas_por_mes,
                    "por_anio": consultas_por_anio,
                },
                status=status.HTTP_200_OK,
            )

        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Count
from .models import Paciente

@api_view(["GET"])
def pacientes_top_consultas(request):
    """
    Devuelve los pacientes con mayor número de consultas registradas.
    """
    pacientes = (
        Paciente.objects.annotate(num_consultas=Count("consulta"))
        .order_by("-num_consultas")[:10]  # top 10
    )
    data = [
        {
            "id": p.id,
            "nombre": p.nombre,
            "num_consultas": p.num_consultas,
        }
        for p in pacientes
    ]
    return Response(data)

from datetime import date, timedelta
from django.db.models import Count
from django.db.models.functions import TruncDay
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Consulta

@api_view(["GET"])
def pacientes_estadisticas_diarias(request):
    days = int(request.GET.get("days", 7))  # por defecto últimos 7 días
    desde = date.today() - timedelta(days=days)

    consultas = (
        Consulta.objects.filter(fecha__date__gte=desde)
        .annotate(dia=TruncDay("fecha"))
        .values("dia")
        .annotate(count=Count("id", distinct=True))
        .order_by("dia")
    )

    data = [{"fecha": c["dia"].strftime("%Y-%m-%d"), "count": c["count"]} for c in consultas]
    return Response(data)

# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Count
from django.utils import timezone
from .models import Consulta

class ConsultasEstadisticasView(APIView):
    """
    Devuelve número de consultas por día (últimos 7 días)
    """
    def get(self, request):
        try:
            hoy = timezone.localdate()
            hace_7_dias = hoy - timezone.timedelta(days=6)

            consultas_por_dia = (
                Consulta.objects.filter(fecha__range=[hace_7_dias, hoy])
                .values("fecha")
                .annotate(count=Count("id"))
                .order_by("fecha")
            )

            data = [{"fecha": c["fecha"], "count": c["count"]} for c in consultas_por_dia]

            return Response(data)
        except Exception as e:
            print("❌ Error en ConsultasEstadisticasView:", e)
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

from django.utils import timezone
from django.db.models.functions import TruncDate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import Consulta

class ConsultasHoyView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        hoy = timezone.localdate()
        consultas = (
            Consulta.objects.annotate(fecha_dia=TruncDate("fecha"))
            .filter(fecha_dia=hoy)
            .order_by("fecha")
        )

        data = [
            {
                "paciente": str(c.paciente),
                "hora": c.fecha.isoformat() if c.fecha else None,
            }
            for c in consultas
        ]

        return Response(data)
