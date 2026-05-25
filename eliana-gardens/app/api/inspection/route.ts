import { NextResponse } from 'next/server';
import { notifyInspectionLead, type InspectionLead } from '@/lib/notify';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  let body: Partial<InspectionLead>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const required = ['fullName', 'phone', 'preferredDate', 'preferredTimeSlot'] as const;
  for (const k of required) {
    if (!body[k] || typeof body[k] !== 'string') {
      return NextResponse.json({ error: `Missing ${k}` }, { status: 400 });
    }
  }
  if (body.preferredTimeSlot !== 'morning' && body.preferredTimeSlot !== 'afternoon') {
    return NextResponse.json({ error: 'Invalid time slot' }, { status: 400 });
  }

  const lead: InspectionLead = {
    fullName: body.fullName!,
    phone: body.phone!,
    email: body.email,
    preferredDate: body.preferredDate!,
    preferredTimeSlot: body.preferredTimeSlot,
    message: body.message,
    submittedAt: new Date().toISOString(),
  };

  const ok = await notifyInspectionLead(lead);
  return ok
    ? NextResponse.json({ ok: true })
    : NextResponse.json({ error: 'Notify failed' }, { status: 502 });
}
