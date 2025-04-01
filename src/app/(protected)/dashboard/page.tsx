import { Home } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { ROUTES } from "@/common/constants/routes";
import { BreadcrumbsItem } from "@/components/breadcrumbs";
import { DateTimePicker } from "@/components/datetime-picker";
import PageContainer from "@/components/providers/page-container";
import { Button } from "@/components/ui/button";
import Combobox from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";

export default function DashboardPage() {
  const breadcrumbs: BreadcrumbsItem[] = [
    {
      text: <Home className="h-4 w-4" />,
      url: ROUTES.DASHBOARD,
    },
  ];

  const [date, setDate] = useState<Date | undefined>(undefined);

  const handleClick = () => {
    toast.success(date?.toString() || "No date selected");
    console.log(date);
  };

  const OPTIONS = [
    { label: "nextjs", value: "Nextjs" },
    { label: "React", value: "react" },
    { label: "Remix", value: "remix" },
    { label: "Vite", value: "vite" },
    { label: "Nuxt", value: "nuxt" },
    { label: "Vue", value: "vue" },
    { label: "Svelte", value: "svelte" },
    { label: "Angular", value: "angular" },
    { label: "Ember", value: "ember" },
    { label: "Gatsby", value: "gatsby" },
    { label: "Astro", value: "astro" },
  ];

  return (
    <PageContainer breadcrumbs={breadcrumbs} showHomeIcon={false} title="Dashboard">
      <section className="flex flex-col gap-4">
        <h1 className="text-lg font-medium">Hello, Welcome Back</h1>
        <div className="flex flex-col gap-2">
          <h2>Input</h2>
          <Input placeholder="Type something..." />
        </div>
        <div className="flex flex-col gap-2">
          <h2>DateTime Picker</h2>
          <DateTimePicker granularity="day" onChange={setDate} placeholder="Pilih Tanggal" />
          <Button onClick={handleClick}>Log Date</Button>
        </div>
        <div className="flex flex-col gap-2">
          <h2>Combobox</h2>
          <Combobox
            defaultOptions={OPTIONS}
            emptyIndicator="No options found"
            placeholder="Select a framework"
          />
        </div>
      </section>
    </PageContainer>
  );
}
