import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let _supabase: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!_supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      throw new Error('Supabase URL and anon key must be set in environment variables');
    }
    _supabase = createClient(url, key);
  }
  return _supabase;
}

// ========== Database Types ==========

export interface DbPlayer {
  id: string;
  name: string;
  created_at: string;
}

export interface DbCharacter {
  id: string;
  player_id: string;
  player_name: string;
  char_name: string;
  char_age: number | null;
  char_gender: string | null;
  race_id: string;
  class_id: string;
  subclass_id: string;
  armor_id: string;
  weapon_id: string;
  level: number;
  created_at: string;
  updated_at: string;
}

export interface DbLevelUp {
  id: string;
  character_id: string;
  level: number;
  bonus_type: string;
  created_at: string;
}

export interface DbCustomModifier {
  id: string;
  character_id: string;
  name: string;
  description: string | null;
  health_mod: number;
  armor_mod: number;
  move_mod: number;
  ap_mod: number;
  is_active: boolean;
  created_at: string;
}

// ========== Player Operations ==========

export async function getPlayers() {
  const { data, error } = await getSupabase()
    .from('players')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data as DbPlayer[];
}

export async function createPlayer(name: string) {
  const { data, error } = await getSupabase()
    .from('players')
    .insert({ name })
    .select()
    .single();
  if (error) throw error;
  return data as DbPlayer;
}

// ========== Character Operations ==========

export async function getCharactersByPlayer(playerId: string) {
  const { data, error } = await getSupabase()
    .from('characters')
    .select('*')
    .eq('player_id', playerId)
    .order('char_name', { ascending: true });
  if (error) throw error;
  return data as DbCharacter[];
}

export async function getCharacter(id: string) {
  const { data, error } = await getSupabase()
    .from('characters')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data as DbCharacter;
}

export async function createCharacter(character: Omit<DbCharacter, 'id' | 'created_at' | 'updated_at' | 'level'>) {
  const { data, error } = await getSupabase()
    .from('characters')
    .insert(character)
    .select()
    .single();
  if (error) throw error;
  return data as DbCharacter;
}

export async function deleteCharacter(id: string) {
  const { error } = await getSupabase()
    .from('characters')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

// ========== Level Up Operations ==========

export async function getLevelUps(characterId: string) {
  const { data, error } = await getSupabase()
    .from('level_ups')
    .select('*')
    .eq('character_id', characterId)
    .order('level', { ascending: true });
  if (error) throw error;
  return data as DbLevelUp[];
}

export async function addLevelUp(characterId: string, level: number, bonusType: string) {
  // Insert the level up record
  const { data, error } = await getSupabase()
    .from('level_ups')
    .insert({ character_id: characterId, level, bonus_type: bonusType })
    .select()
    .single();
  if (error) throw error;

  // Update character level
  const { error: updateError } = await getSupabase()
    .from('characters')
    .update({ level, updated_at: new Date().toISOString() })
    .eq('id', characterId);
  if (updateError) throw updateError;

  return data as DbLevelUp;
}

// ========== Custom Modifier Operations ==========

export async function getModifiers(characterId: string) {
  const { data, error } = await getSupabase()
    .from('custom_modifiers')
    .select('*')
    .eq('character_id', characterId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data as DbCustomModifier[];
}

export async function addModifier(modifier: Omit<DbCustomModifier, 'id' | 'created_at'>) {
  const { data, error } = await getSupabase()
    .from('custom_modifiers')
    .insert(modifier)
    .select()
    .single();
  if (error) throw error;
  return data as DbCustomModifier;
}

export async function toggleModifier(id: string, isActive: boolean) {
  const { error } = await getSupabase()
    .from('custom_modifiers')
    .update({ is_active: isActive })
    .eq('id', id);
  if (error) throw error;
}

export async function deleteModifier(id: string) {
  const { error } = await getSupabase()
    .from('custom_modifiers')
    .delete()
    .eq('id', id);
  if (error) throw error;
}
