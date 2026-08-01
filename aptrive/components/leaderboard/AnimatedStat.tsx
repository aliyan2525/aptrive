interface AnimatedNumberProps {
  value: number;
  suffix?: string;
  decimals?: number;
}

export default function AnimatedStat({
  value,
  suffix = "",
  decimals = 0,
}: AnimatedNumberProps) {
  return (
    <>
      {value.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </>
  );
}
