import { Card, Metric, Text } from "@tremor/react";
import { rupiah } from "@/lib/format";

export default function Bento({ data }) {
 // data: { kas, arisan, jimpitan, sampah }
 return (
 <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
 <Card decoration="top" decorationColor="emerald">
 <Text>Saldo Kas</Text>
 <Metric>{rupiah(data?.kas?.saldo)}</Metric>
 <Text className="opacity-70 text-sm">
 +{rupiah(data?.kas?.pemasukan)} / -{rupiah(data?.kas?.pengeluaran)}
 </Text>
 </Card>

 <Card decoration="top" decorationColor="cyan">
 <Text>Arisan</Text>
 <Metric>{data?.arisan?.peserta} peserta</Metric>
 <Text className="opacity-70 text-sm">
 Putaran ke-{data?.arisan?.putaran}
 </Text>
 </Card>

 <Card decoration="top" decorationColor="amber">
 <Text>Jimpitan Bulan Ini</Text>
 <Metric>{rupiah(data?.jimpitan?.bulanIni)}</Metric>
 <Text className="opacity-70 text-sm">
 Rata2 harian {rupiah(data?.jimpitan?.ratarataHarian)}
 </Text>
 </Card>

 <Card decoration="top" decorationColor="violet">
 <Text>Bank Sampah</Text>
 <Metric>{rupiah(data?.sampah?.pemasukan)}</Metric>
 <Text className="opacity-70 text-sm">
 {data?.sampah?.transaksi} transaksi
 </Text>
 </Card>
 </div>
 );
}
