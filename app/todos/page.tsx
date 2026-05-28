import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export default async function Page() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: todos } = await supabase.from("todos").select();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-background text-foreground">
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-sm">
        <h1 className="font-display text-2xl font-bold mb-4">Supabase Todos Test</h1>
        {todos && todos.length > 0 ? (
          <ul className="space-y-2">
            {todos.map((todo: any) => (
              <li key={todo.id} className="p-3 bg-accent rounded-md flex items-center justify-between">
                <span>{todo.name}</span>
                {todo.is_completed !== undefined && (
                  <span className={`text-xs px-2 py-1 rounded ${todo.is_completed ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                    {todo.is_completed ? 'Completed' : 'Pending'}
                  </span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <p>No todos found in the database.</p>
            <p className="text-xs mt-2">Make sure a &apos;todos&apos; table exists in your Supabase schema with at least a &apos;name&apos; column.</p>
          </div>
        )}
      </div>
    </main>
  );
}
