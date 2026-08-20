import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { SensorReading } from "@/types/sensor";
import { formatTime } from "@/utils/format";

export interface Series {
  key: keyof SensorReading;
  name: string;
  color: string;
  unit: string;
  yAxisId?: "left" | "right";
}

interface Props {
  data: SensorReading[];
  series: Series[];
  height?: number;
  threshold?: number;
  dualAxis?: boolean;
}

export function SensorChart({ data, series, height = 280, threshold, dualAxis }: Props) {
  const chartData = data.map((d) => ({ ...d, time: formatTime(d.timestamp) }));

  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
          <defs>
            {series.map((s) => (
              <linearGradient key={s.key} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={s.color} stopOpacity={0.35} />
                <stop offset="100%" stopColor={s.color} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 6" vertical={false} />
          <XAxis
            dataKey="time"
            stroke="var(--color-muted-foreground)"
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            minTickGap={28}
          />
          <YAxis
            yAxisId="left"
            stroke="var(--color-muted-foreground)"
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            width={48}
          />
          {dualAxis && (
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="var(--color-muted-foreground)"
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              width={48}
            />
          )}
          <Tooltip
            contentStyle={{
              background: "var(--color-popover)",
              border: "1px solid var(--color-border-strong)",
              borderRadius: 10,
              fontSize: 12,
            }}
            labelStyle={{ color: "var(--color-muted-foreground)" }}
            formatter={(value: number | string, name: string) => {
              const s = series.find((x) => x.name === name);
              return [`${value} ${s?.unit ?? ""}`, name];
            }}
          />
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
          {threshold !== undefined && (
            <ReferenceLine
              y={threshold}
              yAxisId="left"
              stroke="var(--color-warning)"
              strokeDasharray="6 4"
              label={{
                value: `Threshold ${threshold}`,
                position: "insideTopRight",
                fill: "var(--color-warning)",
                fontSize: 11,
              }}
            />
          )}
          {series.map((s) => (
            <Area
              key={s.key}
              yAxisId={s.yAxisId ?? "left"}
              type="monotone"
              dataKey={s.key as string}
              name={s.name}
              stroke={s.color}
              strokeWidth={2}
              fill={`url(#grad-${s.key})`}
              dot={false}
              isAnimationActive={false}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
