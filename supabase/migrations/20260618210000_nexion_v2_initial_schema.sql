-- Nexion v2 — schema completo (recriado após wipe)
-- Migration: nexion_v2_initial_schema

CREATE TYPE public.project_role AS ENUM ('owner', 'admin', 'member');

-- Tabelas: profiles, projects, project_members, kanban_columns, tasks,
-- documents, task_documents, notifications, project_invitations
-- Triggers: on_auth_user_created, on_project_created
-- RLS + funções em schema private
