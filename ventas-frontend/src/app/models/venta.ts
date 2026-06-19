import { Cliente } from './cliente';
import { Producto } from './producto';

export interface DetalleVenta {
  id?: number;
  producto: Producto;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface Venta {
  id?: number;
  fecha?: string;
  cliente: Cliente;
  total: number;
  estado: string;
  detalles: DetalleVenta[];
}