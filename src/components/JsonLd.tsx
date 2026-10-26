export function JsonLd({ data }: { data: Record<string, unknown> }) {
  // < 문자를 이스케이프해 </script> 삽입을 막는다.
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
