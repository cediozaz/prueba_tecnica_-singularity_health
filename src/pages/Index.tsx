
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RegistrationForm from "@/components/RegistrationForm";
import DatabaseSchema from "@/components/DatabaseSchema";
import RegisteredUsers from "@/components/RegisteredUsers";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-primary">
            Singularity Health
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Sistema de Registro de Usuarios
          </p>
        </header>

        <Tabs defaultValue="form" className="w-full">
          <div className="flex justify-center mb-6">
            <TabsList>
              <TabsTrigger value="form">Formulario de Registro</TabsTrigger>
              <TabsTrigger value="schema">Esquema de Base de Datos</TabsTrigger>
              <TabsTrigger value="users">Usuarios Registrados</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="form" className="w-full">
            <RegistrationForm />
          </TabsContent>
          
          <TabsContent value="schema">
            <DatabaseSchema />
          </TabsContent>
          
          <TabsContent value="users">
            <RegisteredUsers />
          </TabsContent>
        </Tabs>

        <footer className="mt-12 text-center text-sm text-gray-500">
          <p>Prueba Técnica: Desarrollador Backend en Singularity Health</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
