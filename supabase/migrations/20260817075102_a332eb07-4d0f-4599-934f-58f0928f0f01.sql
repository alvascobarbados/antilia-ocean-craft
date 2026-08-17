-- Lock down role assignment: no client-side writes possible
REVOKE INSERT, UPDATE, DELETE ON public.user_roles FROM anon, authenticated;
REVOKE ALL ON public.user_roles FROM anon;
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

CREATE POLICY "user_roles admin manage"
ON public.user_roles FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Orders: keep client writes impossible; submissions go through the trusted server only
REVOKE ALL ON public.orders FROM anon;
REVOKE ALL ON public.order_lines FROM anon;
REVOKE INSERT ON public.orders FROM authenticated;
REVOKE INSERT ON public.order_lines FROM authenticated;
GRANT ALL ON public.orders TO service_role;
GRANT ALL ON public.order_lines TO service_role;