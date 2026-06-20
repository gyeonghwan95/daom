type ContainerProps = {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "header" | "footer" | "nav" | "article";
};

export function Container({
  children,
  className = "",
  as: Tag = "div",
}: ContainerProps) {
  return (
    <Tag
      className={`mx-auto w-full max-w-[1280px] px-4 md:px-6 xl:px-8 ${className}`}
    >
      {children}
    </Tag>
  );
}
