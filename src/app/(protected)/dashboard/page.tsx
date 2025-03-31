import { Home } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { BreadcrumbsItem } from "@/components/breadcrumbs";
import { DateTimePicker } from "@/components/datetime-picker";
import PageContainer from "@/components/providers/page-container";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const breadcrumbs: BreadcrumbsItem[] = [
    {
      text: <Home className="h-4 w-4" />,
      url: "/dashboard",
    },
  ];
  const [date, setDate] = useState<Date | undefined>(undefined);

  const handleClick = () => {
    toast.success(date?.toString() || "No date selected");
    console.log(date);
  };

  return (
    <PageContainer breadcrumbs={breadcrumbs} showHomeIcon={false} title="Dashboard">
      <div className="flex flex-col gap-4">
        <h1>Hello, Welcome Back</h1>
        <DateTimePicker granularity="month" onChange={setDate} placeholder="Pilih Tanggal" />
        <Button onClick={handleClick}>Log Date</Button>
      </div>
    </PageContainer>
  );
}
