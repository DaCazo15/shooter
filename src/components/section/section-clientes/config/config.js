import { ref } from 'vue'

// Estado para la calculadora de inversiones
export const formData = ref({})

// Estado para la gestión de clientes
export const clienteFormData = ref({
  nombre: '',
  apellido: '',
  telefono: '',
  correo: '',
  direccion: '',
  cantidadPedidos: 0
})
