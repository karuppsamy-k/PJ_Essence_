import { isFirebaseConfigured } from './firebase/firebaseConfig';
import { createMockProductRepository } from './mock/productRepository';
import { createMockOrderRepository } from './mock/orderRepository';
import { createMockQuizRepository, createMockSeasonalRepository, createMockCustomerRepository } from './mock/quizRepository';
import { MockPaymentProvider } from '../patterns/adapters/paymentAdapter';
import { MockStorageProvider } from '../patterns/adapters/storageAdapter';
import { MockNotificationProvider } from '../patterns/adapters/notificationAdapter';
import { MockShippingProvider } from '../patterns/adapters/shippingAdapter';

// Singleton instances for repositories
const productRepo = createMockProductRepository();
const orderRepo = createMockOrderRepository();
const quizRepo = createMockQuizRepository();
const seasonalRepo = createMockSeasonalRepository();
const customerRepo = createMockCustomerRepository();

// Providers
const paymentProvider = new MockPaymentProvider();
const storageProvider = new MockStorageProvider();
const notificationProvider = new MockNotificationProvider();
const shippingProvider = new MockShippingProvider();

export const repositories = {
  products: productRepo,
  orders: orderRepo,
  quiz: quizRepo,
  seasonal: seasonalRepo,
  customers: customerRepo,
};

export const providers = {
  payment: paymentProvider,
  storage: storageProvider,
  notification: notificationProvider,
  shipping: shippingProvider,
};

export function getProductRepository() {
  return repositories.products;
}

export function getOrderRepository() {
  return repositories.orders;
}

export function getQuizRepository() {
  return repositories.quiz;
}

export function getSeasonalRepository() {
  return repositories.seasonal;
}

export function getCustomerRepository() {
  return repositories.customers;
}

export function getPaymentProvider() {
  return providers.payment;
}

export function getStorageProvider() {
  return providers.storage;
}

export function getNotificationProvider() {
  return providers.notification;
}

export function getShippingProvider() {
  return providers.shipping;
}
