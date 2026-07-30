export function PageSkeleton({
  variant = "article",
}: {
  variant?: "article" | "hub" | "home" | "consult";
}) {
  return (
    <div className="page-skeleton" aria-busy="true">
      <span className="sr-only" aria-live="polite">
        페이지를 불러오는 중입니다.
      </span>
      <div className="page-skeleton__inner" aria-hidden>
        {variant === "consult" ? (
          <>
            <div className="page-skeleton__crumb skel" />
            <div className="page-skeleton__steps">
              <div className="page-skeleton__step skel" />
              <div className="page-skeleton__step skel" />
              <div className="page-skeleton__step skel" />
            </div>
            <div className="page-skeleton__title skel" />
            <div className="page-skeleton__title page-skeleton__title--short skel" />
            <div className="page-skeleton__cards page-skeleton__cards--consult">
              <div className="page-skeleton__card skel" />
              <div className="page-skeleton__card skel" />
              <div className="page-skeleton__card skel" />
              <div className="page-skeleton__card skel" />
            </div>
            <div className="page-skeleton__cta skel" />
          </>
        ) : (
          <>
            <div className="page-skeleton__crumb skel" />
            <div className="page-skeleton__title skel" />
            <div className="page-skeleton__title page-skeleton__title--short skel" />
            <div className="page-skeleton__lead skel" />
            {variant === "hub" || variant === "home" ? (
              <div className="page-skeleton__cards">
                <div className="page-skeleton__card skel" />
                <div className="page-skeleton__card skel" />
                <div className="page-skeleton__card skel" />
              </div>
            ) : (
              <>
                <div className="page-skeleton__summary skel" />
                <div className="page-skeleton__line skel" />
                <div className="page-skeleton__line skel" />
                <div className="page-skeleton__line page-skeleton__line--mid skel" />
                <div className="page-skeleton__line page-skeleton__line--short skel" />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
