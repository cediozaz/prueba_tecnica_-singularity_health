
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

export default function DatabaseSchema() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-primary">
          Esquema de la Base de Datos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="visual" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="visual">Visual</TabsTrigger>
            <TabsTrigger value="description">Descripción</TabsTrigger>
          </TabsList>
          
          <TabsContent value="visual" className="mt-4">
            <div className="relative w-full h-[500px] overflow-auto border rounded-md p-4">
              <div className="absolute left-[50px] top-[50px] schema-entity" style={{width: "200px"}}>
                <div className="schema-title">User</div>
                <div className="schema-field">PK: id</div>
                <div className="schema-field">Name: varchar(50)</div>
                <div className="schema-field">LastName: varchar(50)</div>
                <div className="schema-field">Email: varchar(100)</div>
                <div className="schema-field">Password: varchar</div>
                <div className="schema-field">FK: TypeDocument_id</div>
                <div className="schema-field">FK: Contact_id</div>
              </div>
              
              <div className="absolute left-[50px] top-[250px] schema-entity" style={{width: "200px"}}>
                <div className="schema-title">TypeDocument</div>
                <div className="schema-field">PK: id</div>
                <div className="schema-field">Name: varchar(50)</div>
                <div className="schema-field">Document: varchar(50)</div>
              </div>
              
              <div className="absolute left-[350px] top-[50px] schema-entity" style={{width: "200px"}}>
                <div className="schema-title">AppUser</div>
                <div className="schema-field">PK: id</div>
                <div className="schema-field">FK: User_id</div>
                <div className="schema-field">Status: bool</div>
                <div className="schema-field">TemporalCode: varchar(50)</div>
                <div className="schema-field">username</div>
                <div className="schema-field">groups</div>
                <div className="schema-field">email</div>
                <div className="schema-field">password</div>
                <div className="schema-field">isSuperadmin</div>
              </div>
              
              <div className="absolute left-[350px] top-[300px] schema-entity" style={{width: "200px"}}>
                <div className="schema-title">Country</div>
                <div className="schema-field">PK: id</div>
                <div className="schema-field">CountryCode: varchar(10)</div>
                <div className="schema-field">CountryName: varchar(50)</div>
                <div className="schema-field">variable FK</div>
              </div>
              
              <div className="absolute left-[650px] top-[150px] schema-entity" style={{width: "200px"}}>
                <div className="schema-title">Contact</div>
                <div className="schema-field">PK: id</div>
                <div className="schema-field">Address: varchar(80)</div>
                <div className="schema-field">FK: Country_id</div>
                <div className="schema-field">Phone: varchar(20)</div>
                <div className="schema-field">CellPhone: varchar(20)</div>
                <div className="schema-field">EmergencyName: varchar(50)</div>
                <div className="schema-field">EmergencyPhone: varchar(20)</div>
              </div>
              
              {/* Relationship lines */}
              <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
                {/* User to TypeDocument */}
                <path d="M 150 200 L 150 250" stroke="#718096" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)"></path>
                
                {/* User to Contact */}
                <path d="M 250 125 L 650 175" stroke="#718096" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)"></path>
                
                {/* User to AppUser */}
                <path d="M 250 100 L 350 100" stroke="#718096" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)"></path>
                
                {/* Contact to Country */}
                <path d="M 650 250 L 550 325" stroke="#718096" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)"></path>
                
                {/* Define the arrowhead */}
                <defs>
                  <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#718096" />
                  </marker>
                </defs>
              </svg>
            </div>
          </TabsContent>
          
          <TabsContent value="description" className="mt-4 space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-primary">Descripción del Esquema</h3>
              <p className="text-sm mt-2">
                Este esquema representa un sistema de registro de usuarios con validación de datos. Consta de las siguientes tablas:
              </p>
            </div>
            
            <div>
              <h4 className="font-medium">User</h4>
              <p className="text-sm mt-1">
                Almacena la información básica del usuario como nombre, apellido, email y contraseña.
                Se relaciona con TypeDocument para el documento de identidad y con Contact para la información de contacto.
              </p>
            </div>
            
            <Separator className="my-2" />
            
            <div>
              <h4 className="font-medium">TypeDocument</h4>
              <p className="text-sm mt-1">
                Contiene los diferentes tipos de documentos de identidad disponibles en el sistema.
              </p>
            </div>
            
            <Separator className="my-2" />
            
            <div>
              <h4 className="font-medium">AppUser</h4>
              <p className="text-sm mt-1">
                Extiende la información del usuario con datos relacionados con la aplicación,
                como estado, código temporal, nombre de usuario, grupos y permisos de administrador.
              </p>
            </div>
            
            <Separator className="my-2" />
            
            <div>
              <h4 className="font-medium">Country</h4>
              <p className="text-sm mt-1">
                Almacena información de países, como código y nombre.
              </p>
            </div>
            
            <Separator className="my-2" />
            
            <div>
              <h4 className="font-medium">Contact</h4>
              <p className="text-sm mt-1">
                Contiene la información de contacto del usuario, como dirección, país,
                teléfonos y contacto de emergencia.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
