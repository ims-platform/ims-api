INSERT INTO public.plans (name, code, plan_type, price, currency, duration_days, display_order, is_active)
VALUES ('Trial Gratuito', 'FREE', 'TRIAL', 0.00, 'COP', 15, 0, true)
ON CONFLICT (code) DO NOTHING;