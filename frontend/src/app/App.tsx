import { type ReactNode, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"
import { LoaderCircle } from "lucide-react"
import { useQueryClient } from "@tanstack/react-query"
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useNavigationType,
} from "react-router-dom"

import { useAuth } from "@/app/providers/auth/useAuth"
import AuthPage from "@/pages/auth/ui/AuthPage"
import { Brand } from "@/shared/components/brand"
import { SiteHeader } from "@/shared/components/site-header"
import type { AuthUser } from "@/entities/auth/model"
import { isAdminUser } from "@/entities/auth/lib/roles"
import { useGetCartSummary } from "@/features/cart/useGetCartSummary"
import type { NavSection } from "@/shared/components/nav-main"
import {
  SupplierOnboardingDialog,
  type SupplierOnboardingDialogCloseReason,
} from "@/widgets/supplier/ui/SupplierOnboardingDialog"
import {
  ADMIN_NAV_SECTION,
  PROTECTED_ROUTES,
  ROUTE_PATHS,
  ROUTE_SECTIONS,
} from "./routes"

type ProtectedLayoutProps = {
  user: AuthUser
  isAdmin: boolean
  homePath: string
}

export type ProtectedOutletContext = {
  setHeaderSearch: (node: ReactNode) => void
}

function ProtectedLayout({ user, isAdmin, homePath }: ProtectedLayoutProps) {
  const { pathname, search, hash } = useLocation()
  const navigationType = useNavigationType()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const email = user.email ?? ""
  const rawName =
    "name" in user && typeof user.name === "string" ? user.name : undefined
  const name =
    rawName?.trim() ||
    (email ? email.split("@")[0] : undefined) ||
    "Пользователь"
  const headerUser = {
    name,
    email,
    avatar: typeof user.profile_pic_url === "string" ? user.profile_pic_url : "",
  }
  const userOrganization = user.organization ?? null
  const [headerSearch, setHeaderSearch] = useState<ReactNode>(null)
  const [lastAccessiblePath, setLastAccessiblePath] = useState<string>(
    homePath,
  )
  const [pendingSupplierPath, setPendingSupplierPath] = useState<string | null>(
    null,
  )
  const [isOnboardingDialogOpen, setIsOnboardingDialogOpen] = useState(false)
  const { data: cartSummary } = useGetCartSummary()
  const cartCount = cartSummary?.totalItems ?? 0
  const navItemCounters =
    cartCount > 0 ? { [ROUTE_PATHS.buyer.cart]: cartCount } : undefined
  const lastCheckoutSearch = useRef<string | null>(null)

  const handleSetHeaderSearch = useCallback((node: ReactNode) => {
    setHeaderSearch(node)
  }, [])

  useLayoutEffect(() => {
    if (navigationType !== "POP" && !hash) window.scrollTo(0, 0)
  }, [pathname, navigationType, hash])

  const hasSupplierAccess = Boolean(userOrganization?.id)

  const isSupplierPath = useCallback(
    (path: string) => path.startsWith("/supplier"),
    [],
  )

  useEffect(() => {
    if (!isSupplierPath(pathname) || hasSupplierAccess) {
      setLastAccessiblePath(pathname)
    }
  }, [hasSupplierAccess, isSupplierPath, pathname])

  useEffect(() => {
    if (!search || lastCheckoutSearch.current === search) {
      return
    }

    const params = new URLSearchParams(search)
    if (!params.has("session_id") && !params.has("redirect_status")) {
      return
    }

    lastCheckoutSearch.current = search

    const invalidateCartQueries = async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["cart", false] }),
        queryClient.invalidateQueries({ queryKey: ["cart", true] }),
        queryClient.invalidateQueries({ queryKey: ["cart-summary"] }),
      ])
    }

    void invalidateCartQueries()
  }, [search, queryClient])

  useEffect(() => {
    if (isSupplierPath(pathname) && !hasSupplierAccess) {
      setPendingSupplierPath(pathname)
      setIsOnboardingDialogOpen(true)
      const fallback =
        lastAccessiblePath === pathname
          ? ROUTE_PATHS.buyer.fyp
          : lastAccessiblePath

      if (fallback !== pathname) {
        navigate(fallback, { replace: true })
      }
    }
  }, [
    hasSupplierAccess,
    isSupplierPath,
    lastAccessiblePath,
    pathname,
    navigate,
  ])

  useEffect(() => {
    if (hasSupplierAccess && pendingSupplierPath) {
      navigate(pendingSupplierPath, { replace: true })
      setPendingSupplierPath(null)
      setIsOnboardingDialogOpen(false)
    }
  }, [hasSupplierAccess, navigate, pendingSupplierPath])

  const handleNavItemSelect = useCallback(
    ({
      section,
      item,
    }: {
      section: NavSection
      item: NavSection["items"][number]
    }) => {
      if (section.label !== "Supplier") {
        return true
      }

      if (hasSupplierAccess) {
        return true
      }

      setPendingSupplierPath(item.path)
      setIsOnboardingDialogOpen(true)
      return false
    },
    [hasSupplierAccess],
  )

  const handleOnboardingDialogClose = useCallback(
    (reason: SupplierOnboardingDialogCloseReason) => {
      setIsOnboardingDialogOpen(false)

      if (reason !== "completed") {
        setPendingSupplierPath(null)
      }
    },
    [],
  )

  const navSections = isAdmin
    ? [...ROUTE_SECTIONS, ADMIN_NAV_SECTION]
    : ROUTE_SECTIONS

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader
        sections={navSections}
        user={headerUser}
        homePath={homePath}
        searchSlot={headerSearch}
        navItemCounters={navItemCounters}
        onNavItemSelect={handleNavItemSelect}
      />
      <main id="main-content" tabIndex={-1} className="site-main flex flex-1 flex-col">
        <Outlet context={{ setHeaderSearch: handleSetHeaderSearch }} />
      </main>
      <SupplierOnboardingDialog
        open={isOnboardingDialogOpen}
        organization={userOrganization}
        onClose={handleOnboardingDialogClose}
      />
    </div>
  )
}

function App() {
  const authData = useAuth()

  if (!authData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-100">
        <div className="p-8 bg-white rounded-lg shadow-md text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Ошибка конфигурации</h1>
          <p className="text-slate-700">
            Контекст аутентификации не найден. Убедитесь, что ваше приложение обернуто в <code>&lt;AuthProvider&gt;</code>.
          </p>
        </div>
      </div>
    )
  }

  const { user, isUserLoading, isRestoringSession } = authData

  if (isRestoringSession || isUserLoading) {
    return (
      <div className="session-loading" role="status">
        <Brand compact />
        <p><LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> Загружаем аккаунт…</p>
      </div>
    )
  }

  if (!user) {
    return <AuthPage />
  }

  const isAdmin = isAdminUser(user)
  const defaultHomePath = isAdmin
    ? ROUTE_PATHS.admin.dashboard
    : ROUTE_PATHS.buyer.fyp

  return (
    <BrowserRouter>
      <Routes>
        <Route
          element={
            <ProtectedLayout
              user={user}
              isAdmin={isAdmin}
              homePath={defaultHomePath}
            />
          }
        >
          <Route
            index
            element={
              <Navigate to={defaultHomePath} replace />
            }
          />
          {PROTECTED_ROUTES.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={route.element}
            />
          ))}
          <Route
            path="*"
            element={
              <Navigate to={defaultHomePath} replace />
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
export default function WrappedApp() {
  return (
    <>
      <App />
    </>
  )
}
