import React, { lazy } from 'react';
import { Layout } from './Layout';
import { AdminLayout } from '../features/admin/components/AdminLayout';
import { AdminProtectedRoute } from '../features/admin/components/AdminProtectedRoute';

// Route-level code splitting & Lazy Loading
const HomePage = lazy(() => import('../features/catalog/pages/HomePage').then(m => ({ default: m.HomePage })));
const DiscoverPage = lazy(() => import('../features/catalog/pages/DiscoverPage').then(m => ({ default: m.DiscoverPage })));
const QuizPage = lazy(() => import('../features/quiz/pages/QuizPage').then(m => ({ default: m.QuizPage })));
const SeasonalPage = lazy(() => import('../features/catalog/pages/SeasonalPage').then(m => ({ default: m.SeasonalPage })));
const CatalogPage = lazy(() => import('../features/catalog/pages/CatalogPage').then(m => ({ default: m.CatalogPage })));
const ProductDetailPage = lazy(() => import('../features/catalog/pages/ProductDetailPage').then(m => ({ default: m.ProductDetailPage })));
const CustomPerfumePage = lazy(() => import('../features/custom-perfume/pages/CustomPerfumePage').then(m => ({ default: m.CustomPerfumePage })));
const CartPage = lazy(() => import('../features/cart/pages/CartPage').then(m => ({ default: m.CartPage })));
const CheckoutPage = lazy(() => import('../features/checkout/pages/CheckoutPage').then(m => ({ default: m.CheckoutPage })));
const AccountPage = lazy(() => import('../features/auth/pages/AccountPage').then(m => ({ default: m.AccountPage })));
const OrderDetailPage = lazy(() => import('../features/orders/pages/OrderDetailPage').then(m => ({ default: m.OrderDetailPage })));

// Admin Lazy Pages
const AdminDashboardPage = lazy(() => import('../features/admin/pages/AdminDashboardPage').then(m => ({ default: m.AdminDashboardPage })));
const AdminProductsPage = lazy(() => import('../features/admin/pages/AdminProductsPage').then(m => ({ default: m.AdminProductsPage })));
const AdminProductFormPage = lazy(() => import('../features/admin/pages/AdminProductFormPage').then(m => ({ default: m.AdminProductFormPage })));
const AdminOrdersPage = lazy(() => import('../features/admin/pages/AdminOrdersPage').then(m => ({ default: m.AdminOrdersPage })));
const AdminCustomersPage = lazy(() => import('../features/admin/pages/AdminCustomersPage').then(m => ({ default: m.AdminCustomersPage })));
const AdminQuizPage = lazy(() => import('../features/admin/pages/AdminQuizPage').then(m => ({ default: m.AdminQuizPage })));
const AdminSeasonalPage = lazy(() => import('../features/admin/pages/AdminSeasonalPage').then(m => ({ default: m.AdminSeasonalPage })));
const AdminMediaPage = lazy(() => import('../features/admin/pages/AdminMediaPage').then(m => ({ default: m.AdminMediaPage })));

export const routes = [
  // Public Routes
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'discover', element: <DiscoverPage /> },
      { path: 'quiz', element: <QuizPage /> },
      { path: 'collection/:season', element: <SeasonalPage /> },
      { path: 'products', element: <CatalogPage /> },
      { path: 'products/:slug', element: <ProductDetailPage /> },
      { path: 'custom-perfume', element: <CustomPerfumePage /> },
      { path: 'cart', element: <CartPage /> },
      { path: 'checkout', element: <CheckoutPage /> },
      { path: 'account', element: <AccountPage /> },
      { path: 'orders/:id', element: <OrderDetailPage /> },
    ],
  },
  // Protected Admin Routes
  {
    path: '/admin',
    element: <AdminProtectedRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminDashboardPage /> },
          { path: 'products', element: <AdminProductsPage /> },
          { path: 'products/new', element: <AdminProductFormPage /> },
          { path: 'products/:id/edit', element: <AdminProductFormPage /> },
          { path: 'orders', element: <AdminOrdersPage /> },
          { path: 'customers', element: <AdminCustomersPage /> },
          { path: 'quiz', element: <AdminQuizPage /> },
          { path: 'seasonal', element: <AdminSeasonalPage /> },
          { path: 'media', element: <AdminMediaPage /> },
        ],
      },
    ],
  },
];
