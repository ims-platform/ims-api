CREATE TYPE tenant_status AS ENUM ('TRIAL', 'ACTIVE', 'BLOCKED');
CREATE TYPE student_status AS ENUM ('PENDING', 'ACTIVE', 'INACTIVE', 'REJECTED');
CREATE TYPE payment_status AS ENUM ('SUCCESS', 'FAILED', 'PENDING');
CREATE TYPE user_role AS ENUM ('DIRECTOR', 'TEACHER', 'STUDENT');
CREATE TYPE plan_type AS ENUM ('TRIAL', 'MONTHLY', 'ANNUAL');
CREATE TYPE payment_currency AS ENUM ('COP', 'USD');

-- 1. Tabla de Instituciones (Tenants)
CREATE TABLE public.institutions (
    id             UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    name           VARCHAR(255) NOT NULL,
    subdomain      VARCHAR(100) UNIQUE NOT NULL,
    status         tenant_status NOT NULL DEFAULT 'TRIAL',
    trial_ends_at  TIMESTAMPTZ  NOT NULL,
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- 2. Tabla de planes de suscripciones
CREATE TABLE public.plans (
    id             UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    name           VARCHAR(100) NOT NULL,
    plan_type      plan_type    NOT NULL,
    price          DECIMAL(10,2) NOT NULL,
    currency       payment_currency NOT NULL DEFAULT 'COP',
    duration_days  INTEGER      NOT NULL,
    is_active      BOOLEAN      NOT NULL DEFAULT true,
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- 3. Tabla de perfiles de usuarios
CREATE TABLE public.profiles (
    id             UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id   UUID         NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    institution_id UUID         NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    role           user_role     NOT NULL,
    first_name     VARCHAR(150) NOT NULL,
    last_name      VARCHAR(150) NOT NULL,
    is_active      BOOLEAN      NOT NULL DEFAULT true,
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- 4. Tabla de Estudiantes
CREATE TABLE public.student_profiles (
    id             UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id     UUID           NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    status         student_status NOT NULL DEFAULT 'PENDING',
    created_at     TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

-- 5. Tabla de Suscripciones
CREATE TABLE public.subscriptions (
    id                    UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id        UUID    NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    plan_id               UUID    NOT NULL REFERENCES public.plans(id),
    mp_subscription_id    VARCHAR(255),
    starts_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ends_at               TIMESTAMPTZ,
    next_billing_date     TIMESTAMPTZ,
    is_active             BOOLEAN NOT NULL DEFAULT true,
    created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Tabla de Historial de Pagos
CREATE TABLE public.payment_history (
    id                 UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id     UUID           NOT NULL REFERENCES public.institutions(id),
    subscription_id    UUID           NOT NULL REFERENCES public.subscriptions(id),
    mp_payment_id      VARCHAR(255)   UNIQUE NOT NULL,
    amount             DECIMAL(10, 2) NOT NULL,
    currency           payment_currency NOT NULL DEFAULT 'COP',
    status             payment_status NOT NULL,
    receipt_url        TEXT,
    paid_at            TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

-- ÍNDICES DE RENDIMIENTO
CREATE INDEX idx_institutions_subdomain       ON public.institutions(subdomain);
CREATE INDEX idx_institutions_status          ON public.institutions(status);
CREATE INDEX idx_profiles_auth_user_id        ON public.profiles(auth_user_id);
CREATE INDEX idx_profiles_institution_id      ON public.profiles(institution_id);
CREATE INDEX idx_profiles_role                ON public.profiles(role);

CREATE INDEX idx_student_profiles_profile_id  ON public.student_profiles(profile_id);
CREATE INDEX idx_student_profiles_status      ON public.student_profiles(status);

CREATE INDEX idx_subscriptions_institution_id ON public.subscriptions(institution_id);
CREATE INDEX idx_subscriptions_plan_id        ON public.subscriptions(plan_id);
CREATE INDEX idx_subscriptions_is_active      ON public.subscriptions(is_active);

CREATE INDEX idx_payment_history_institution  ON public.payment_history(institution_id);
CREATE INDEX idx_payment_history_subscription ON public.payment_history(subscription_id);
CREATE INDEX idx_payment_history_status       ON public.payment_history(status);