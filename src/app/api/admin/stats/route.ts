import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/admin-auth';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const sb = getSupabaseAdmin();

  const [leadsRes, projectsRes, invoicesRes] = await Promise.all([
    sb.from('leads').select('id, status, budget, created_at'),
    sb.from('projects').select('id, status, agreed_budget, monthly_rate, hosting_status'),
    sb.from('invoices').select('id, status, line_items'),
  ]);

  const leads = leadsRes.data || [];
  const projects = projectsRes.data || [];
  const invoices = invoicesRes.data || [];

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const newLeads = leads.filter(l => l.status === 'new').length;
  const leadsThisWeek = leads.filter(l => new Date(l.created_at) >= sevenDaysAgo).length;
  const leadsThisMonth = leads.filter(l => new Date(l.created_at) >= thirtyDaysAgo).length;
  const activeProjects = projects.filter(p => ['discovery', 'building', 'review'].includes(p.status)).length;
  const launchedProjects = projects.filter(p => p.status === 'launched').length;

  const totalRevenue = invoices
    .filter(i => i.status === 'paid')
    .reduce((sum, i) => {
      const items = i.line_items || [];
      return sum + items.reduce((s: number, item: { amount?: number }) => s + (item.amount || 0), 0);
    }, 0);

  const monthlyRecurring = projects
    .filter(p => p.hosting_status === 'active' && p.monthly_rate)
    .reduce((sum, p) => sum + (p.monthly_rate || 0), 0);

  const pipelineByStatus = {
    new: leads.filter(l => l.status === 'new').length,
    contacted: leads.filter(l => l.status === 'contacted').length,
    call_scheduled: leads.filter(l => l.status === 'call_scheduled').length,
    proposal_sent: leads.filter(l => l.status === 'proposal_sent').length,
    won: leads.filter(l => l.status === 'won').length,
    lost: leads.filter(l => l.status === 'lost').length,
  };

  return NextResponse.json({
    newLeads,
    leadsThisWeek,
    leadsThisMonth,
    totalLeads: leads.length,
    activeProjects,
    launchedProjects,
    totalRevenue,
    monthlyRecurring,
    pipelineByStatus,
  });
}
