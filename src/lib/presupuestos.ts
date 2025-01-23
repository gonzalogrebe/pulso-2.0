// src/lib/presupuestos.ts

import prisma from '@/lib/prisma';

export async function obtenerPresupuestos() {
  try {
    console.log('Conectando a la base de datos para obtener presupuestos...');
    const presupuestos = await prisma.TablaPresupuesto.findMany();
    console.log('Presupuestos recuperados:', presupuestos);
    return presupuestos;
  } catch (error) {
    console.error('Error en obtenerPresupuestos:', error);
    throw error;
  }
}

export async function crearPresupuesto(data: Partial<Presupuesto>) {
  try {
    console.log('Creando presupuesto con datos:', data);
    const nuevoPresupuesto = await prisma.TablaPresupuesto.create({
      data,
    });
    return nuevoPresupuesto;
  } catch (error) {
    console.error('Error en crearPresupuesto:', error);
    throw error;
  }
}

export async function obtenerPresupuestoPorId(id: string) {
  try {
    console.log(`Buscando presupuesto con ID: ${id}`);
    const presupuesto = await prisma.TablaPresupuesto.findUnique({
      where: { id },
    });
    if (!presupuesto) {
      console.warn(`Presupuesto con ID ${id} no encontrado`);
    }
    return presupuesto;
  } catch (error) {
    console.error('Error en obtenerPresupuestoPorId:', error);
    throw error;
  }
}

export async function actualizarPresupuesto(id: string, data: Partial<Presupuesto>) {
  try {
    console.log(`Actualizando presupuesto con ID: ${id} con datos:`, data);
    const presupuestoActualizado = await prisma.TablaPresupuesto.update({
      where: { id },
      data,
    });
    return presupuestoActualizado;
  } catch (error) {
    console.error('Error en actualizarPresupuesto:', error);
    throw error;
  }
}

export async function eliminarPresupuesto(id: string) {
  try {
    console.log(`Eliminando presupuesto con ID: ${id}`);
    const presupuestoEliminado = await prisma.TablaPresupuesto.delete({
      where: { id },
    });
    return presupuestoEliminado;
  } catch (error) {
    console.error('Error en eliminarPresupuesto:', error);
    throw error;
  }
}
