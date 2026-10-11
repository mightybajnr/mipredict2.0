export default function Card({
  as: Tag = "div",
  className = "",
  children,
  ...rest
}) {
  return (
    <Tag
      className={`rounded-2xl border border-white/10 bg-surface ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}
