CREATE TYPE tenant_status AS ENUM ('TRIAL', 'ACTIVE', 'BLOCKED');
CREATE TYPE student_status AS ENUM ('PENDING', 'ACTIVE', 'INACTIVE', 'REJECTED');
CREATE TYPE payment_status AS ENUM ('SUCCESS', 'FAILED', 'PENDING');
CREATE TYPE user_role AS ENUM ('DIRECTOR', 'TEACHER', 'STUDENT');
CREATE TYPE plan_type AS ENUM ('TRIAL', 'MONTHLY', 'ANNUAL');
CREATE TYPE payment_currency AS ENUM ('COP', 'USD');

-- 1. Tabla de Instituciones (Tenants)
CREATE TABLE public.institutions (
    id             UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    name           TEXT          NOT NULL,
    subdomain      TEXT          UNIQUE NOT NULL,
    status         tenant_status NOT NULL DEFAULT 'TRIAL',
    created_at     TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- 2. Tabla de planes de suscripciones
CREATE TABLE public.plans (
    id             UUID             PRIMARY KEY DEFAULT gen_random_uuid(),
    name           TEXT             NOT NULL,
    plan_type      plan_type        NOT NULL,
    price          DECIMAL(10,2)    NOT NULL,
    currency       payment_currency NOT NULL DEFAULT 'COP',
    duration_days  INTEGER          NOT NULL,
    display_order  INT              NOT NULL DEFAULT 0,
    is_active      BOOLEAN          NOT NULL DEFAULT true,
    created_at     TIMESTAMPTZ      NOT NULL DEFAULT NOW()
);

-- 3. Tabla de usuarios (Director, Teacher, Student)
CREATE TABLE public.users (
    id             UUID         PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    institution_id UUID         NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    role           user_role    NOT NULL,
    first_name     TEXT         NOT NULL,
    last_name      TEXT         NOT NULL,
    is_active      BOOLEAN      NOT NULL DEFAULT true,
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- 4. Tabla de directores
CREATE TABLE public.directors (
    id             UUID        PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE
);

-- 5. Tabla de profesores
CREATE TABLE public.teachers (
    id             UUID        PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE
);

-- 6. Tabla de estudiantes
CREATE TABLE public.students (
    id             UUID           PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    status         student_status NOT NULL DEFAULT 'PENDING'
);

-- 7. Tabla de suscripciones
CREATE TABLE public.subscriptions (
    id                 UUID             PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id     UUID             NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    plan_id            UUID             NOT NULL REFERENCES public.plans(id),
    mp_subscription_id TEXT,
    starts_at          TIMESTAMPTZ      NOT NULL DEFAULT NOW(),
    ends_at            TIMESTAMPTZ,
    is_active          BOOLEAN          NOT NULL DEFAULT true,
    created_at         TIMESTAMPTZ      NOT NULL DEFAULT NOW(),
    updated_at         TIMESTAMPTZ      NOT NULL DEFAULT NOW()
);

-- 8. Tabla de Historial de Pagos
CREATE TABLE public.payment_history (
    id              UUID             PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id  UUID             NOT NULL REFERENCES public.institutions(id),
    subscription_id UUID             NOT NULL REFERENCES public.subscriptions(id),
    mp_payment_id   TEXT             UNIQUE NOT NULL,
    amount          DECIMAL(10, 2)   NOT NULL,
    currency        payment_currency NOT NULL DEFAULT 'COP',
    status          payment_status   NOT NULL,
    receipt_url     TEXT,
    paid_at         TIMESTAMPTZ      NOT NULL DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_institutions_subdomain        ON public.institutions(subdomain);
CREATE INDEX idx_institutions_status           ON public.institutions(status);
CREATE INDEX idx_users_institution_id          ON public.users(institution_id);
CREATE INDEX idx_users_role                    ON public.users(role);
CREATE INDEX idx_users_is_active               ON public.users(is_active);
CREATE INDEX idx_students_status               ON public.students(status);
CREATE INDEX idx_plans_display_order           ON public.plans(display_order);
CREATE INDEX idx_subscriptions_institution_id  ON public.subscriptions(institution_id);
CREATE INDEX idx_subscriptions_plan_id         ON public.subscriptions(plan_id);
CREATE INDEX idx_subscriptions_is_active       ON public.subscriptions(is_active);
CREATE INDEX idx_payment_history_institution   ON public.payment_history(institution_id);
CREATE INDEX idx_payment_history_subscription  ON public.payment_history(subscription_id);
CREATE INDEX idx_payment_history_status        ON public.payment_history(status);