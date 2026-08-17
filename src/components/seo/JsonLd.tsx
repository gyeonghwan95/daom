type JsonLdData = Record<string, unknown>;

type JsonLdProps = {
  data: JsonLdData | JsonLdData[];
};

export function JsonLd({ data }: JsonLdProps) {
  const schemas = Array.isArray(data) ? data : [data];

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
