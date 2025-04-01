import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router";
import { updateUserSchema, TUpdateUserRequest } from "@/api/users/schema";
import Loading from "@/app/loading";
import { ROUTES } from "@/common/constants/routes";
import PageContainer from "@/components/providers/page-container";
import { useUpdateUserMutation } from "@/hooks/api/users/use-update-user-mutation";
import { useUserQuery } from "@/hooks/api/users/use-user-query";
import UserForm from "../../_components/form-user";

export default function EditUserPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { mutateAsync } = useUpdateUserMutation(id as string);
  const { data, isLoading } = useUserQuery(id as string);

  const breadcrumbs = [
    { text: "Users", url: ROUTES.USERS.LIST },
    { text: data?.data.name || "User", url: ROUTES.USERS.DETAIL.replace(":id", id as string) },
    { text: "Edit", url: ROUTES.USERS.EDIT.replace(":id", id as string) },
  ];

  const form = useForm<TUpdateUserRequest>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      email: "",
      name: "",
      phone_number: "",
    },
  });

  useEffect(() => {
    if (data?.data) {
      form.reset({
        email: data.data.email,
        name: data.data.name,
        phone_number: data.data.phone_number,
      });
    }
  }, [data, form]);

  const handleSubmit = async (formData: TUpdateUserRequest) => {
    try {
      await mutateAsync(formData);
      toast.success("User updated successfully");
      void navigate(ROUTES.USERS.LIST);
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <PageContainer breadcrumbs={breadcrumbs} title="Edit User" withBackButton>
      <UserForm
        form={form}
        isSubmitting={form.formState.isSubmitting}
        isUpdateMode
        onSubmit={handleSubmit}
      />
    </PageContainer>
  );
}
