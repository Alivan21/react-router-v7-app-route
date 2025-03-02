import { Home } from "lucide-react";
import { useState } from "react";
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

  return (
    <PageContainer breadcrumbs={breadcrumbs} showHomeIcon={false} title="Dashboard">
      <div className="flex flex-col gap-4">
        <p>Hello, Welcome Back</p>
        <DateTimePicker date={date} mode="datetime" setDate={setDate} />
        <Button onClick={() => console.log(date)}>Log Date</Button>
      </div>
    </PageContainer>
  );
}
