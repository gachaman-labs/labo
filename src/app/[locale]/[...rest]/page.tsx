import { notFound } from "next/navigation";

// 정의되지 않은 경로는 locale 레이아웃 안에서 404 를 보여준다.
export default function CatchAll() {
  notFound();
}
