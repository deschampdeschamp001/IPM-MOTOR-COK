import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

interface RouterContextType {
  pathname: string;
  search: string;
  navigate: (to: string, options?: { replace?: boolean }) => void;
  params: Record<string, string>;
  setParams: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

export function matchPath(pattern: string, pathname: string): { matches: boolean; params: Record<string, string> } {
  const patternSegments = pattern.split('/').filter(Boolean);
  const pathSegments = pathname.split('/').filter(Boolean);

  if (patternSegments.length !== pathSegments.length) {
    return { matches: false, params: {} };
  }

  const params: Record<string, string> = {};

  for (let i = 0; i < patternSegments.length; i++) {
    const patternPart = patternSegments[i];
    const pathPart = pathSegments[i];

    if (patternPart.startsWith(':')) {
      const paramName = patternPart.slice(1);
      params[paramName] = decodeURIComponent(pathPart);
    } else if (patternPart.toLowerCase() !== pathPart.toLowerCase()) {
      return { matches: false, params: {} };
    }
  }

  return { matches: true, params };
}

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pathname, setPathname] = useState<string>(() => window.location.pathname || '/');
  const [search, setSearch] = useState<string>(() => window.location.search || '');
  const [params, setParams] = useState<Record<string, string>>({});

  useEffect(() => {
    const handlePopState = () => {
      setPathname(window.location.pathname || '/');
      setSearch(window.location.search || '');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback((to: string, options?: { replace?: boolean }) => {
    // Check if external or tel/mailto/wa
    if (to.startsWith('http') || to.startsWith('tel:') || to.startsWith('mailto:') || to.startsWith('//')) {
      window.location.href = to;
      return;
    }

    const [newPath, newSearch] = to.split('?');
    const normalizedPath = newPath.startsWith('/') ? newPath : `/${newPath}`;
    const fullSearch = newSearch ? `?${newSearch}` : '';

    if (options?.replace) {
      window.history.replaceState(null, '', `${normalizedPath}${fullSearch}`);
    } else {
      window.history.pushState(null, '', `${normalizedPath}${fullSearch}`);
    }

    setPathname(normalizedPath);
    setSearch(fullSearch);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const value = useMemo(() => ({
    pathname,
    search,
    navigate,
    params,
    setParams
  }), [pathname, search, navigate, params]);

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
};

export function useRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return ctx;
}

export function useNavigate() {
  const { navigate } = useRouter();
  return navigate;
}

const KNOWN_PATTERNS = [
  '/vehicule/:id',
  '/marques/:slug',
  '/actualites/:slug'
];

export function useParams(): Record<string, string> {
  const { pathname } = useRouter();

  for (const pattern of KNOWN_PATTERNS) {
    const res = matchPath(pattern, pathname);
    if (res.matches) {
      return res.params;
    }
  }

  return {};
}

export function useSearchParams(): [URLSearchParams, (newParams: Record<string, string> | URLSearchParams) => void] {
  const { search, pathname, navigate } = useRouter();

  const searchParams = useMemo(() => new URLSearchParams(search), [search]);

  const setSearchParams = useCallback((newParams: Record<string, string> | URLSearchParams) => {
    let qString = '';
    if (newParams instanceof URLSearchParams) {
      qString = newParams.toString();
    } else {
      const sp = new URLSearchParams();
      Object.entries(newParams).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') {
          sp.set(k, v);
        }
      });
      qString = sp.toString();
    }
    navigate(`${pathname}${qString ? `?${qString}` : ''}`);
  }, [pathname, navigate]);

  return [searchParams, setSearchParams];
}

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  replace?: boolean;
}

export const Link: React.FC<LinkProps> = ({ to, replace, onClick, children, ...rest }) => {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) onClick(e);
    // Ignore default prevent if modifier key pressed
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || rest.target === '_blank') {
      return;
    }
    if (!to.startsWith('http') && !to.startsWith('tel:') && !to.startsWith('mailto:')) {
      e.preventDefault();
      navigate(to, { replace });
    }
  };

  return (
    <a href={to} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
};
