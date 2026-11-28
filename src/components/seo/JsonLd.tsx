type JsonLdData = Record<string, unknown>;

type JsonLdProps = {
  data: JsonLdData | JsonLdData[];
};

export function JsonLd({ data }: JsonLdProps) {
  // 빈 객체나 문항이 모두 빠진 FAQPage는 출력하지 않는다(json-ld.ts의 반복 FAQ 제외 후 생길 수 있음)
  const schemas = (Array.isArray(data) ? data : [data]).filter(
    (schema) =>
      schema &&
      Object.keys(schema).length > 0 &&
      !(schema["@type"] === "FAQPage" && Array.isArray(schema.mainEntity) && schema.mainEntity.length === 0),
  );

  return (
    <>
      {schemas.map((schema, index) => {
        const key =
          typeof schema["@id"] === "string"
            ? schema["@id"]
            : `${JSON.stringify(schema["@type"])}-${index}`;

        return (
          <script
            key={key}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        );
      })}
    </>
  );
}
