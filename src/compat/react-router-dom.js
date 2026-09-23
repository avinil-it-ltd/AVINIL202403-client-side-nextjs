'use client';

import React from 'react';
import NextLink from 'next/link';
import { useRouter, usePathname, useParams as useNextParams, useSearchParams } from 'next/navigation';

export const Link = React.forwardRef(function LinkShim({ to, href, children, ...props }, ref) {
  return (
    <NextLink ref={ref} href={to || href || '#'} {...props}>
      {children}
    </NextLink>
  );
});

export const useNavigate = () => {
  const router = useRouter();
  return (target) => {
    if (typeof target === 'number') {
      if (target === -1) {
        window.history.back();
      }
    } else if (target) {
      router.push(target);
    }
  };
};

export const useLocation = () => {
  const pathname = usePathname();
  return {
    pathname: pathname || '/',
    search: typeof window !== 'undefined' ? window.location.search : '',
  };
};

export const useParams = () => {
  const params = useNextParams();
  return params || {};
};

export const Navigate = ({ to }) => {
  const router = useRouter();
  React.useEffect(() => {
    if (to) router.push(to);
  }, [to, router]);
  return null;
};

export const Outlet = ({ children }) => {
  return <>{children}</>;
};

export default {
  Link,
  useNavigate,
  useLocation,
  useParams,
  Navigate,
  Outlet
};
