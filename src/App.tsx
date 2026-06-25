import { useEffect, useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
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

function sectionToPath(s: SectionType) {
  switch (s) {
    case 'dashboard':
      return '/';
    case 'accounts':
      return '/accounts';
    case 'numbers':
      return '/numbers';
    case 'allnumbers':
      return '/allnumbers';
    case 'pricing':
      return '/pricing';
    case 'fund':
      return '/fund';
    case 'refer':
      return '/refer';
    case 'accounthistory':
      return '/accounthistory';
    case 'numbershistory':
      return '/numbershistory';
    case 'txhistory':
      return '/txhistory';
    case 'api':
      return '/api';
    case 'contact':
      return '/contact';
    default:
      return '/';
  }
}

function pathToSection(path: string): SectionType {
  if (path.startsWith('/accounts')) return 'accounts';
  if (path.startsWith('/numbers')) return 'numbers';
  if (path.startsWith('/allnumbers')) return 'allnumbers';
  if (path.startsWith('/pricing')) return 'pricing';
  if (path.startsWith('/fund')) return 'fund';
  if (path.startsWith('/refer')) return 'refer';
  if (path.startsWith('/accounthistory')) return 'accounthistory';
  if (path.startsWith('/numbershistory')) return 'numbershistory';
  if (path.startsWith('/txhistory')) return 'txhistory';
  if (path.startsWith('/api')) return 'api';
  if (path.startsWith('/contact')) return 'contact';
  return 'dashboard';
}

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const [currentSection, setCurrentSection] = useState<SectionType>(() => pathToSection(location.pathname));
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // keep currentSection in sync with URL (so deep links highlight correct section)
  useEffect(() => {
    const sec = pathToSection(location.pathname);
    setCurrentSection(sec);
  }, [location.pathname]);

  // passed to Sidebar so clicking an item navigates the router
  const handleSectionChange = (section: SectionType) => {
    setCurrentSection(section);
    setSidebarOpen(false);
    const to = sectionToPath(section);
    if (location.pathname !== to) navigate(to);
  };

  return (
    <div className="flex h-screen bg-[#0a0a0f]">
      <Sidebar
        currentSection={currentSection}
        onSectionChange={handleSectionChange}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar pageTitle={currentSection.charAt(0).toUpperCase() + currentSection.slice(1)} />

        <main className="flex-1 overflow-auto">
          <div className="p-4 lg:p-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/accounts" element={<Accounts />} />
              <Route path="/numbers" element={<Numbers />} />
              <Route path="/allnumbers" element={<AllNumbers />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/fund" element={<FundWallet />} />
              <Route path="/refer" element={<ReferEarn />} />
              <Route path="/accounthistory" element={<AccountHistory />} />
              <Route path="/numbershistory" element={<NumbersHistory />} />
              <Route path="/txhistory" element={<TransactionHistory />} />
              <Route path="/api" element={<ApiTools />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="*" element={<Dashboard />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}
