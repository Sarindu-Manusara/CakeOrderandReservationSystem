import { Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import AdminLayout from './components/layout/AdminLayout';
import HomePage from './pages/HomePage';
import CakesPage from './pages/CakesPage';
// import CakeDetailPage from './pages/CakeDetailPage';
import CustomCakePage from './pages/CustomCakePage';
import CartPage from './pages/CartPage';
import PaymentPage from './pages/PaymentPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import AdminLoginPage from './pages/AdminLoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/admin/AdminDashboard';
import OrderManagement from './pages/admin/OrderManagement';
import StockManagement from './pages/admin/StockManagement';
import PaymentManagement from './pages/admin/PaymentManagement';
import UserManagement from './pages/admin/UserManagement';
import CustomCakeManagement from './pages/admin/CustomCakeManagement';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ProductsPage from './pages/ProductsPage';
import ProductDetailsPage from './pages/ProductDetailsPage';

function App() {
  return (
    <Routes>
      {/* Admin Routes */}
      <Route path="/admin-login" element={<AdminLoginPage />} />
      <Route path="/admin/*" element={
        <ProtectedRoute adminOnly={true}>
          <AdminLayout>
            <Routes>
              <Route path="/" element={<AdminDashboard />} />
              <Route path="/orders" element={<OrderManagement />} />
              <Route path="/products" element={<StockManagement />} />
              <Route path="/payments" element={<PaymentManagement />} />
              <Route path="/users" element={<UserManagement />} />
              <Route path="/custom-cakes" element={<CustomCakeManagement />} />
            </Routes>
          </AdminLayout>
        </ProtectedRoute>
      } />

      {/* Regular User Routes */}
      <Route path="*" element={
  <>
    <Header />
    <main className="flex-grow">
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="cakes" element={<CakesPage />} />
        {/* <Route path="cakes/:id" element={<CakeDetailPage />} /> */}
        <Route path="/:productType/:id" element={<ProductDetailsPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="custom-cake" element={<CustomCakePage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        

        <Route path="payment/:id" element={
          <ProtectedRoute>
            <PaymentPage />
          </ProtectedRoute>
        } />
        <Route path="checkout" element={
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        } />
        <Route path="profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </main>
    <Footer />
  </>
} />

    </Routes>
  );
}

export default App;