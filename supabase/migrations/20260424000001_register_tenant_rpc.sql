-- Agregar columna code a plans para identificarlos por código
ALTER TABLE public.plans ADD COLUMN IF NOT EXISTS code TEXT UNIQUE;

-- Función RPC: Registro completo de institución y director en una transacción atómica
CREATE OR REPLACE FUNCTION public.register_tenant_complete(
  p_auth_user_id  UUID,
  p_institution_name TEXT,
  p_subdomain     TEXT,
  p_first_name    TEXT,
  p_last_name     TEXT,
  p_plan_code     TEXT
) RETURNS JSON AS $$
DECLARE
  v_institution_id UUID;
  v_plan_id        UUID;
  v_duration_days  INTEGER;
  v_ends_at        TIMESTAMPTZ;
BEGIN
  -- 1. Crear institución en TRIAL
  INSERT INTO public.institutions (name, subdomain, status)
  VALUES (p_institution_name, p_subdomain, 'TRIAL'::tenant_status)
  RETURNING id INTO v_institution_id;

  -- 2. Crear perfil en public.users
  INSERT INTO public.users (id, institution_id, role, first_name, last_name)
  VALUES (p_auth_user_id, v_institution_id, 'DIRECTOR'::user_role, p_first_name, p_last_name);

  -- 3. Crear registro en public.directors
  INSERT INTO public.directors (id)
  VALUES (p_auth_user_id);

  -- 4. Buscar plan por código
  SELECT id, duration_days INTO v_plan_id, v_duration_days
  FROM public.plans
  WHERE code = p_plan_code AND is_active = true;

  IF v_plan_id IS NULL THEN
    RAISE EXCEPTION 'Plan con código % no encontrado o inactivo', p_plan_code;
  END IF;

  -- 5. Crear suscripción trial
  v_ends_at := NOW() + (v_duration_days || ' days')::INTERVAL;
  INSERT INTO public.subscriptions (institution_id, plan_id, starts_at, ends_at, is_active)
  VALUES (v_institution_id, v_plan_id, NOW(), v_ends_at, true);

  RETURN json_build_object(
    'institution_id', v_institution_id,
    'subdomain', p_subdomain
  );

EXCEPTION WHEN OTHERS THEN
  RAISE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public;