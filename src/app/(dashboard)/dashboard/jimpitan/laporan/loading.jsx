import TableSkeleton from "@/components/TableSkeleton";

export default function LoadingDokumen() {
  return (
    <TableSkeleton
      rows={9}
      cols={5}
      withToolbar
      colTemplate="60px minmax(200px,1.5fr) 160px 1.4fr 112px"
    />
  );
}