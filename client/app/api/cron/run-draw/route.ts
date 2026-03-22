import { NextRequest, NextResponse } from "next/server";
import { executeDraw } from "@/lib/draw-engine";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const now = new Date();
  const month = now.toLocaleString('default', { month: 'long', year: 'numeric' });

  try {
    const res = await executeDraw(month);
    if (res.error) {
      return NextResponse.json({ error: res.error }, { status: 500 });
    }
    return NextResponse.json({ success: true, drawId: res.drawId });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
