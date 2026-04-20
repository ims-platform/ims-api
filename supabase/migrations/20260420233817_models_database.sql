CREATE TYPE tenant_status AS ENUM ('TRIAL', 'ACTIVE', 'BLOCKED');
CREATE TYPE student_status AS ENUM ('PENDING', 'ACTIVE', 'INACTIVE', 'REJECTED');
CREATE TYPE payment_status AS ENUM ('SUCCESS', 'FAILED', 'PENDING');


-- 1. Tabla de Instituciones (Tenants)
CREATE TABLE public.institutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    subdomain VARCHAR(100) UNIQUE NOT NULL,
    status tenant_status DEFAULT 'TRIAL'::tenant_status,
    trial_ends_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 2. TABLAS DE ROLES SEPARADAS
-- Cada una vinculada estrictamente a auth.users y a su institución
-- ==========================================

-- 2.A. Tabla de Directores
CREATE TABLE public.directors (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    first_name VARCHAR(150) NOT NULL,
    last_name VARCHAR(150) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.B. Tabla de Profesores
CREATE TABLE public.teachers (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    first_name VARCHAR(150) NOT NULL,
    last_name VARCHAR(150) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.C. Tabla de Estudiantes
CREATE TABLE public.students (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    first_name VARCHAR(150) NOT NULL,
    last_name VARCHAR(150) NOT NULL,
    status student_status DEFAULT 'PENDING'::student_status,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 3. SUSCRIPCIONES Y PAGOS
-- ==========================================

-- 3. Tabla de Suscripciones
CREATE TABLE public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    mercadopago_subscription_id VARCHAR(255),
    plan_name VARCHAR(100) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    next_billing_date TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tabla de Historial de Pagos
CREATE TABLE public.payment_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES public.institutions(id),
    mercadopago_payment_id VARCHAR(255) UNIQUE NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    status payment_status NOT NULL,
    receipt_url TEXT,
    paid_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- ÍNDICES DE RENDIMIENTO
-- ==========================================

CREATE INDEX idx_institutions_subdomain ON public.institutions(subdomain);
CREATE INDEX idx_directors_institution_id ON public.directors(institution_id);
CREATE INDEX idx_teachers_institution_id ON public.teachers(institution_id);
CREATE INDEX idx_students_institution_id ON public.students(institution_id);
CREATE INDEX idx_students_status ON public.students(status);