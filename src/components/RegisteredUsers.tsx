
import { useState, useEffect } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, RefreshCw, Database, User, AlertTriangle } from "lucide-react";

// Define the UserRecord type based on our database schema
type UserRecord = {
  id: string;
  name: string;
  lastName: string;
  email: string;
  document_type: string;
  document_number: string;
  created_at: string;
};

export default function RegisteredUsers() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchUsers = async () => {
    if (!isSupabaseConfigured()) {
      setError("Supabase no está configurado correctamente. Por favor, configure las variables de entorno VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fix the SQL query syntax by using separate select() calls
      const { data, error } = await supabase
        .from('users')
        .select('id, name, lastname, email, document_type, document_number, created_at')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      // Transform data to match UserRecord type
      const formattedUsers = data?.map(user => ({
        id: user.id,
        name: user.name,
        lastName: user.lastname || '',
        email: user.email,
        document_type: user.document_type,
        document_number: user.document_number,
        created_at: user.created_at || new Date().toISOString(),
      })) || [];

      setUsers(formattedUsers);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar usuarios');
      toast({
        title: "Error",
        description: "No se pudieron cargar los usuarios registrados",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    
    // Only set up subscription if Supabase is configured
    if (isSupabaseConfigured()) {
      // Set up real-time subscription
      const channel = supabase
        .channel('table-db-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'users',
          },
          (payload) => {
            console.log('Cambio en tiempo real:', payload);
            fetchUsers(); // Refresh data when there's a change
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, []);

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-2xl font-bold text-primary">
            Usuarios Registrados
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Visualización en tiempo real de los usuarios en la base de datos
          </p>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={fetchUsers}
          disabled={loading || !isSupabaseConfigured()}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
        </Button>
      </CardHeader>
      <CardContent>
        {!isSupabaseConfigured() && (
          <div className="bg-yellow-50 p-4 rounded-md text-yellow-800 my-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 mt-0.5" />
            <div>
              <p className="font-medium">Configuración de Supabase incompleta</p>
              <p className="text-sm mt-1">
                Para conectar con Supabase, necesitas proporcionar las variables de entorno VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.
                Puedes encontrarlas en tu proyecto de Supabase bajo Configuración &gt; API.
              </p>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex justify-center my-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-50 p-4 rounded-md text-red-800 my-4">
            <p>Error: {error}</p>
            <p className="text-sm mt-2">
              Asegúrate de que la tabla 'users' exista en tu proyecto de Supabase.
            </p>
          </div>
        )}

        {!loading && !error && isSupabaseConfigured() && users.length === 0 && (
          <div className="text-center py-8 bg-muted/30 rounded-md">
            <Database className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-medium text-lg">No hay usuarios registrados</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Los usuarios que registres aparecerán aquí automáticamente
            </p>
          </div>
        )}

        {!loading && !error && users.length > 0 && (
          <div className="space-y-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="border rounded-lg p-4 bg-background hover:bg-accent/20 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <h3 className="font-medium">
                        {user.name} {user.lastName}
                      </h3>
                      <div className="text-sm text-muted-foreground">
                        {new Date(user.created_at).toLocaleString('es')}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Email:</span>{" "}
                        {user.email}
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">
                          Documento:
                        </span>{" "}
                        {user.document_type} {user.document_number}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
