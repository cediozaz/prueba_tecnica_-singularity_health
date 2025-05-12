
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { Loader2, AlertTriangle } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

const registrationSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres",
  }),
  lastName: z.string().min(2, {
    message: "El apellido debe tener al menos 2 caracteres",
  }),
  email: z.string().email({
    message: "Debe introducir un email válido",
  }),
  password: z.string().min(6, {
    message: "La contraseña debe tener al menos 6 caracteres",
  }),
  documentType: z.string().min(1, {
    message: "Debe seleccionar un tipo de documento",
  }),
  documentNumber: z.string().min(1, {
    message: "Debe introducir un número de documento",
  }),
  address: z.string().optional(),
  countryCode: z.string().min(1, {
    message: "Debe introducir un código de país",
  }),
  countryName: z.string().min(1, {
    message: "Debe introducir un nombre de país",
  }),
  phone: z.string().min(1, {
    message: "Debe introducir un número de teléfono",
  }),
  cellPhone: z.string().optional(),
  emergencyName: z.string().optional(),
  emergencyPhone: z.string().optional(),
});

type RegistrationFormValues = z.infer<typeof registrationSchema>;

export default function RegistrationForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      name: "",
      lastName: "",
      email: "",
      password: "",
      documentType: "",
      documentNumber: "",
      address: "",
      countryCode: "",
      countryName: "",
      phone: "",
      cellPhone: "",
      emergencyName: "",
      emergencyPhone: "",
    },
  });

  async function onSubmit(data: RegistrationFormValues) {
    if (!isSupabaseConfigured()) {
      toast({
        title: "Error de configuración",
        description: "Supabase no está configurado correctamente. Por favor, configure las variables de entorno.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Check if email or document already exists
      const { data: existingUsers, error: checkError } = await supabase
        .from('users')
        .select('id')
        .or(`email.eq.${data.email},document_number.eq.${data.documentNumber}`);
      
      if (checkError) {
        throw new Error(checkError.message);
      }
      
      if (existingUsers && existingUsers.length > 0) {
        toast({
          title: "Error",
          description: "Ya existe un usuario con este email o número de documento",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      
      // First, create the country record
      const { data: countryData, error: countryError } = await supabase
        .from('countries')
        .insert({
          country_code: data.countryCode,
          country_name: data.countryName,
        })
        .select('id')
        .single();
      
      if (countryError) {
        throw new Error(countryError.message);
      }
      
      // Next, create the contact record
      const { data: contactData, error: contactError } = await supabase
        .from('contacts')
        .insert({
          address: data.address || '',
          country_id: countryData?.id,
          phone: data.phone,
          cell_phone: data.cellPhone || '',
          emergency_name: data.emergencyName || '',
          emergency_phone: data.emergencyPhone || '',
        })
        .select('id')
        .single();
      
      if (contactError) {
        throw new Error(contactError.message);
      }
      
      // Create document type
      const { data: documentData, error: documentError } = await supabase
        .from('document_types')
        .insert({
          name: data.documentType,
          document: data.documentNumber,
        })
        .select('id')
        .single();
      
      if (documentError) {
        throw new Error(documentError.message);
      }
      
      // Finally, create the user record
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert({
          name: data.name,
          lastname: data.lastName,
          email: data.email,
          password: data.password, // Note: In production, this should be hashed
          document_type_id: documentData?.id,
          contact_id: contactData?.id,
          document_number: data.documentNumber,
          document_type: data.documentType,
        });
      
      if (userError) {
        throw new Error(userError.message);
      }
      
      toast({
        title: "Registro exitoso",
        description: "El usuario ha sido registrado correctamente",
      });
      
      form.reset();
      
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al registrar el usuario",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-primary">
          Registro de Usuario
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!isSupabaseConfigured() && (
          <div className="bg-yellow-50 p-4 rounded-md text-yellow-800 my-4 mb-6 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 mt-0.5" />
            <div>
              <p className="font-medium">Configuración de Supabase incompleta</p>
              <p className="text-sm mt-1">
                Para registrar usuarios, necesitas proporcionar las variables de entorno VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.
                Puedes encontrarlas en tu proyecto de Supabase bajo Configuración &gt; API.
              </p>
            </div>
          </div>
        )}
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Información Personal</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input placeholder="Nombre" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Apellido</FormLabel>
                      <FormControl>
                        <Input placeholder="Apellido" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="email@ejemplo.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contraseña</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="******" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Documento de Identidad</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="documentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de documento</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: DNI, Pasaporte" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="documentNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número de documento</FormLabel>
                      <FormControl>
                        <Input placeholder="12345678" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Información de Contacto</h3>
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dirección</FormLabel>
                    <FormControl>
                      <Input placeholder="Calle, Ciudad, Código Postal" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="countryCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código de país</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: ES, US" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="countryName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>País</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: España, Estados Unidos" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono</FormLabel>
                      <FormControl>
                        <Input placeholder="+34 123456789" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cellPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Móvil (opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="+34 987654321" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Contacto de Emergencia (Opcional)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="emergencyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre de contacto</FormLabel>
                      <FormControl>
                        <Input placeholder="Nombre completo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="emergencyPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono de emergencia</FormLabel>
                      <FormControl>
                        <Input placeholder="+34 123456789" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting || !isSupabaseConfigured()}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enviando...
                </>
              ) : (
                "Registrar Usuario"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
