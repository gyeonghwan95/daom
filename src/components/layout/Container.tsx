type ContainerProps = {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "header" | "footer" | "nav" | "article";
  /** 헤더 등 뷰포트 전체 너비가 필요할 때 */
  fullWidth?: boolean;
};

export function Container({
  children,
  className = "",
  as: Tag = "div",
  fullWidth = false,
}: ContainerProps) {
  return (
    <Tag
      className={`mx-auto w-full ${fullWidth ? "max-w-none" : "max-w-[1280px]"} px-4 md:px-6 xl:px-8 ${className}`}
    >
      {children}
    </Tag>
  );
}
