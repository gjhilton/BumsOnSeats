import { CalendarOfPerformances } from "@components/CalendarOfPerformances/CalendarOfPerformances";
import { PageLayout, PageWidth } from "@components/PageLayout";
import { css } from "@generated/css";
import { html as titleHtml } from "@content/performances/title.md";
import { html as descriptionHtml } from "@content/performances/description.md";

export function PerformancesPage({ data }) {
  return (
    <PageLayout>
      <PageWidth>
        <h1
          className={css({
            fontSize: "5rem",
            mb: "lg",
            fontWeight: "normal",
            lineHeight: "1.1",
            marginTop: "2rem",
          })}
          dangerouslySetInnerHTML={{ __html: titleHtml }}
        />

        <div
          className={css({
            "& p": {
              fontSize: "1.5rem",
              mb: "xl",
              lineHeight: "1.5",
              maxWidth: "800px"
            },
            "& p:first-child": {
              fontSize: "2rem"
            }
          })}
          dangerouslySetInnerHTML={{ __html: descriptionHtml }}
        />
      </PageWidth>

      <CalendarOfPerformances data={data} />
    </PageLayout>
  );
}
