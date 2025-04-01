import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { createUserSchema, TCreateUserRequest } from "@/api/users/schema";
import { ROUTES } from "@/common/constants/routes";
import PageContainer from "@/components/providers/page-container";
import { useCreateUserMutation } from "@/hooks/api/users/use-create-user-mutation";
import UserForm from "../_components/form-user";

export default function CreateUserPage() {
  const breadcrumbs = [
    { text: "Users", url: ROUTES.USERS.LIST },
    { text: "Create User", url: ROUTES.USERS.CREATE },
  ];
  const navigate = useNavigate();
  const { mutateAsync } = useCreateUserMutation();

  const form = useForm<TCreateUserRequest>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      phone_number: "",
    },
  });

  const handleSubmit = async (data: TCreateUserRequest) => {
    try {
      await mutateAsync(data);
      toast.success("User created successfully");
      void navigate(ROUTES.USERS.LIST);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <PageContainer breadcrumbs={breadcrumbs} title="Create User" withBackButton>
      <UserForm form={form} isSubmitting={form.formState.isSubmitting} onSubmit={handleSubmit} />
    </PageContainer>
  );
}
