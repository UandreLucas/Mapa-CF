'use client'

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import { getLeadStatusMeta } from '@/lib/utils'

interface LeadsAreaChartProps {
  data: { date: string; leads: number }[]
}

export function LeadsAreaChart({ data }: LeadsAreaChartProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="leadsGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#C9A96E" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#C9A96E" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12, fill: '#737373' }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fontSize: 12, fill: '#737373' }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          contentStyle={{
            borderRadius: 8,
            border: '1px solid #e5e5e5',
            fontSize: 13,
          }}
          labelStyle={{ color: '#1A1A2E', fontWeight: 600 }}
        />
        <Area
          type="monotone"
          dataKey="leads"
          name="Leads"
          stroke="#C9A96E"
          strokeWidth={2}
          fill="url(#leadsGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

const PIE_COLORS = [
  '#1A1A2E',
  '#C9A96E',
  '#8B7355',
  '#4A4A6A',
  '#B08F54',
  '#6B6B8A',
  '#E0CBA0',
]

interface LeadsStatusPieProps {
  data: Record<string, number>
}

export function LeadsStatusPie({ data }: LeadsStatusPieProps) {
  const chartData = Object.entries(data)
    .filter(([, value]) => value > 0)
    .map(([status, value]) => ({
      name: getLeadStatusMeta(status).label,
      value,
    }))

  if (!chartData.length) {
    return (
      <div className="flex h-[280px] items-center justify-center text-sm text-muted-foreground">
        Sem dados de leads ainda.
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={90}
          paddingAngle={2}
        >
          {chartData.map((_, index) => (
            <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            borderRadius: 8,
            border: '1px solid #e5e5e5',
            fontSize: 13,
          }}
        />
        <Legend
          iconType="circle"
          wrapperStyle={{ fontSize: 12 }}
          formatter={(value) => (
            <span style={{ color: '#525252' }}>{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
