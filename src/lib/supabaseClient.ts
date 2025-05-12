
import { createClient } from '@supabase/supabase-js';

// Importamos los valores del cliente Supabase integrado
import { supabase as integratedSupabase } from "@/integrations/supabase/client";

// Utilizamos el cliente Supabase que ya está configurado
export const supabase = integratedSupabase;

// Helper function para verificar si Supabase está correctamente configurado
export const isSupabaseConfigured = () => {
  return true; // Ahora siempre está configurado porque estamos usando el cliente integrado
};
