import { colors, radius } from '../../design/tokens';

type Tab = 'home' | 'history' | 'receipts' | 'reports';

interface BottomTabBarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const icons: Record<Tab, string> = {
  home: 'M3 11l9-8 9 8v8h-4v-4h-10v4H3z',
  history: 'M4 7h16M4 12h16M4 17h11',
  receipts: 'M3 7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7zm9 0v6m0 0h3m-3 0H9',
  reports: 'M5 3h14a2 2 0 012 2v16a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2zm4 5h6m0 4h6m0 4h4',
};

const labels: Record<Tab, string> = {
  home: 'Home',
  history: 'History',
  receipts: 'Receipts',
  reports: 'Reports',
};

export function BottomTabBar({ activeTab, onTabChange }: BottomTabBarProps) {
  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: colors['surface/card'],
        borderTop: `1px solid ${colors['border/hairline']}`,
        paddingTop: '8px',
        paddingBottom: '30px',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
      }}
    >
      {(['home', 'history', 'receipts', 'reports'] as Tab[]).map(tab => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            padding: '6px 12px',
            backgroundColor: activeTab === tab ? colors['brand/tint'] : 'transparent',
            borderRadius: activeTab === tab ? '12px' : '0',
            color: activeTab === tab ? colors['brand/primary'] : colors['ink/disabled'],
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d={icons[tab]} />
          </svg>
          <span style={{ fontSize: '12px', fontWeight: activeTab === tab ? 800 : 700, lineHeight: 1 }}>
            {labels[tab]}
          </span>
        </button>
      ))}
    </nav>
  );
}
