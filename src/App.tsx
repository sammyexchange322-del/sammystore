import { useState } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Dashboard from './pages/Dashboard';
import Accounts from './pages/Accounts';
import Numbers from './pages/Numbers';
import AllNumbers from './pages/AllNumbers';
import Pricing from './pages/Pricing';
import FundWallet from './pages/FundWallet';
import ReferEarn from './pages/ReferEarn';
import AccountHistory from './pages/AccountHistory';
import NumbersHistory from './pages/NumbersHistory';
import TransactionHistory from './pages/TransactionHistory';
import ApiTools from './pages/ApiTools';
import ContactUs from './pages/ContactUs';

type SectionType = 
  | 'dashboard'
  | 'accounts'
  | 'numbers'
  | 'allnumbers'
  | 'pricing'
  | 'fund'
  | 'refer'
  | 'accounthistory'
  | 'numbershistory'
  | 'txhistory'
  | 'api'
  | 'contact';

export default function App() {
  const [currentSection, setCurrentSection] = useState<SectionType>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderSection = () => {
    switch (currentSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'accounts':
        return <Accounts />;
      case 'numbers':
        return <Numbers />;
      case 'allnumbers':
        return <AllNumbers />;
      case 'pricing':
        return <Pricing />;
      case 'fund':
        return <FundWallet />;
      case 'refer':
        return <ReferEarn />;
      case 'accounthistory':
        return <AccountHistory />;
      case 'numbershistory':
        return <NumbersHistory />;
      case 'txhistory':
        return <TransactionHistory />;
      case 'api':
        return <ApiTools />;
      case 'contact':
        return <ContactUs />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-[#0a0a0f]">
      <Sidebar 
        currentSection={currentSection} 
        onSectionChange={(section) => {
          setCurrentSection(section);
          setSidebarOpen(false);
        }}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar 
          pageTitle={currentSection.charAt(0).toUpperCase() + currentSection.slice(1)}
        />
        
        <main className="flex-1 overflow-auto">
          <div className="p-4 lg:p-8">
            {renderSection()}
          </div>
        </main>
      </div>
    </div>
  );
}
          <Route path="/products/:slug" element={<ProductDetailPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy-policy" element={<PrivacyPage />} />
          <Route path="/foreign-numbers/:country" element={<ForeignNumbersCountryPage />} />
          <Route path="/my-numbers" element={<MyNumbersPage />} />
        </Routes>
      </main>
      <SiteFooter />
      <FloatingActions />
      <Toaster richColors position="top-right" />
    </>
  );
}
