/** Dashboard widgets must not obscure operational controls. Match route boundaries. */
export function isPanelRoute(pathname: string | null): boolean {
  return pathname === "/dashboard" || Boolean(pathname?.startsWith("/dashboard/"));
}
