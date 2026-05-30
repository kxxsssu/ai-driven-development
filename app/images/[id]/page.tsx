import { ImageDetailClient } from "@/app/images/[id]/ImageDetailClient";

export default function ImageDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return <ImageDetailClient id={params.id} />;
}
