import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryManager } from "@/components/categories/category-manager";

export default async function CategoriesSettingsPage() {
  const supabase = await createClient();

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    redirect("/auth/login");
  }

  // Fetch all categories (both predefined and custom)
  const { data: categories } = await supabase
    .from("task_categories")
    .select("*")
    .or(`user_id.is.null,user_id.eq.${user.id}`)
    .order("is_predefined", { ascending: false })
    .order("name");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="heading-2">Category Settings</h1>
        <p className="text-lead">
          Manage your task categories and customize your workflow
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Custom Categories */}
        <div>
          <CategoryManager categories={categories || []} userId={user.id} />
        </div>

        {/* Predefined Categories */}
        <div>
          <Card className="card-art-nouveau">
            <CardHeader>
              <CardTitle>Predefined Categories</CardTitle>
              <CardDescription>
                System categories that help organize your tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {categories
                  ?.filter((c) => c.is_predefined)
                  .map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center gap-3 p-3 rounded-lg border-2 border-border/50"
                    >
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="font-medium">{category.name}</span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
