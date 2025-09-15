from datetime import date
from django.utils.timezone import localtime
from rest_framework import serializers
from .models import (
    Consulta,
    Paciente,
    Procedimiento,
    Registro,
    CIE10Diagnosis,
    MedicamentoFrecuente,
    Alergia,
)

# -------------------------------
# Serializers auxiliares
# -------------------------------

# Para tratamiento individual (nombre y posología)
class TratamientoSerializer(serializers.Serializer):
    nombre = serializers.CharField()
    posologia = serializers.CharField()


# -------------------------------
# Pacientes
# -------------------------------

class AlergiaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alergia
        fields = ['id', 'nombre']


class PacienteSerializer(serializers.ModelSerializer):
    # ✅ Lectura: devuelve objetos completos
    alergias = AlergiaSerializer(many=True, read_only=True)

    # ✅ Escritura: permite pasar solo los IDs
    alergias_ids = serializers.PrimaryKeyRelatedField(
        queryset=Alergia.objects.all(),
        many=True,
        write_only=True,
        required=False
    )

    class Meta:
        model = Paciente
        fields = '__all__'

    def create(self, validated_data):
        alergias = validated_data.pop('alergias_ids', [])
        paciente = Paciente.objects.create(**validated_data)
        if alergias:
            paciente.alergias.set(alergias)
        return paciente

    def update(self, instance, validated_data):
        alergias = validated_data.pop('alergias_ids', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if alergias is not None:
            instance.alergias.set(alergias)
        return instance


# Serializer para crear un paciente con consulta directa
class PacienteConConsultaSerializer(serializers.Serializer):
    nombre = serializers.CharField()
    fecha_nacimiento = serializers.DateField()
    telefono = serializers.CharField()
    correo = serializers.EmailField()
    motivo = serializers.CharField()
    diagnostico = serializers.CharField()
    tratamiento = TratamientoSerializer(many=True)


# -------------------------------
# Consultas
# -------------------------------

class ConsultaSerializer(serializers.ModelSerializer):
    fecha = serializers.SerializerMethodField()
    edad_paciente = serializers.SerializerMethodField()

    class Meta:
        model = Consulta
        fields = '__all__'
        extra_kwargs = {
            'peso': {'required': False, 'allow_null': True},
            'talla': {'required': False, 'allow_null': True},
            'imc': {'required': False, 'allow_null': True},
            'frecuencia_cardiaca': {'required': False, 'allow_null': True},
            'frecuencia_respiratoria': {'required': False, 'allow_null': True},
            'presion_arterial': {'required': False, 'allow_null': True},
            'glucometria': {'required': False, 'allow_null': True},
            'oximetria': {'required': False, 'allow_null': True},
            'tratamiento': {'required': False, 'allow_null': True},
            'antecedentes': {'required': False, 'allow_null': True},
            'notas': {'required': False, 'allow_null': True},   # ✅ campo nuevo
        }

    def get_edad_paciente(self, obj):
        if obj.paciente and obj.paciente.fecha_nacimiento:
            hoy = date.today()
            nacimiento = obj.paciente.fecha_nacimiento
            edad = hoy.year - nacimiento.year - (
                (hoy.month, hoy.day) < (nacimiento.month, nacimiento.day)
            )
            return edad
        return None

    def validate(self, data):
        peso = data.get('peso')
        talla_cm = data.get('talla')

        if peso and talla_cm and peso > 0 and talla_cm > 0:
            talla_m = talla_cm / 100
            imc = round(peso / (talla_m * talla_m), 2)
            data['imc'] = imc

        return data

    def get_fecha(self, obj):
        return localtime(obj.fecha).isoformat()


# -------------------------------
# Procedimientos y registros
# -------------------------------

class ProcedimientoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Procedimiento
        fields = '__all__'


class RegistroSerializer(serializers.ModelSerializer):
    procedimientos = ProcedimientoSerializer(many=True)

    class Meta:
        model = Registro
        fields = '__all__'

    def create(self, validated_data):
        procedimientos_data = validated_data.pop('procedimientos')
        registro = Registro.objects.create(**validated_data)
        for proc_data in procedimientos_data:
            proc = Procedimiento.objects.create(**proc_data)
            registro.procedimientos.add(proc)
        return registro


# -------------------------------
# Catálogos varios
# -------------------------------

class MedicamentoFrecuenteSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicamentoFrecuente
        fields = ['id', 'nombre', 'posologia']


class CIE10DiagnosisSerializer(serializers.ModelSerializer):
    class Meta:
        model = CIE10Diagnosis
        fields = ['id', 'codigo', 'descripcion']
