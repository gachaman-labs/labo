// 검색엔진 노출 여부. 기본은 "차단"이고, 정식 공개 때 NEXT_PUBLIC_ALLOW_INDEXING=true 로 빌드하면 풀린다.
// (빌드 때 값이 정해진다. 바꾸면 다시 빌드·배포해야 한다.)
export const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";

export const noIndexRobots = { index: false, follow: false } as const;
