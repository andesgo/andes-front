// app/api/tiendas/route.ts
import { NextResponse } from "next/server";
import { getTiendas, totalTiendas } from "@/lib/tiendas";


// Cache del response por 1 hora en producción (ajustable)
export const revalidate = 3600;


export async function GET(request: Request) {
const { searchParams } = new URL(request.url);
const limitParam = searchParams.get("limit");


const limit = limitParam !== null ? Number(limitParam) : undefined;
if (limitParam !== null && (Number.isNaN(limit) || limit! < 0)) {
    return NextResponse.json(
        { error: 'Parámetro "limit" inválido' },
        { status: 400 }
    );
}


const items = getTiendas(limit);
    return NextResponse.json({
        items,
        count: items.length,
        total: totalTiendas(),
        limit: limit ?? null,
    });
}