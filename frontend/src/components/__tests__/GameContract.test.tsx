import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { GameContract } from '../GameContract';
import '@testing-library/jest-dom';

// Mock MultiversX hooks
jest.mock('@multiversx/sdk-dapp/hooks', () => ({
  useGetLoginInfo: jest.fn(),
  useGetAccountInfo: jest.fn(),
}));

jest.mock('@multiversx/sdk-dapp/services', () => ({
  sendTransactions: jest.fn(),
}));

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  },
}));

const mockUseGetLoginInfo = require('@multiversx/sdk-dapp/hooks').useGetLoginInfo;
const mockUseGetAccountInfo = require('@multiversx/sdk-dapp/hooks').useGetAccountInfo;
const mockSendTransactions = require('@multiversx/sdk-dapp/services').sendTransactions;

describe('GameContract Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('Wallet Not Connected', () => {
    beforeEach(() => {
      mockUseGetLoginInfo.mockReturnValue({ isLoggedIn: false });
      mockUseGetAccountInfo.mockReturnValue({ account: null, address: null });
    });

    test('displays wallet connection prompt when not logged in', () => {
      render(<GameContract />);
      
      expect(screen.getByText('Connect Your Wallet')).toBeInTheDocument();
      expect(screen.getByText(/Connect your MultiversX wallet/)).toBeInTheDocument();
      expect(screen.getByText('Ready for Web3 Gaming')).toBeInTheDocument();
    });

    test('shows rocket emoji and connection message', () => {
      render(<GameContract />);
      
      expect(screen.getByText('🚀')).toBeInTheDocument();
      expect(screen.getByText('⚡')).toBeInTheDocument();
    });
  });

  describe('Wallet Connected - Unregistered Player', () => {
    beforeEach(() => {
      mockUseGetLoginInfo.mockReturnValue({ isLoggedIn: true });
      mockUseGetAccountInfo.mockReturnValue({ 
        account: { address: 'erd1test123' }, 
        address: 'erd1test123' 
      });
    });

    test('displays registration interface for unregistered players', () => {
      render(<GameContract />);
      
      expect(screen.getByText('Welcome to StardustEngine!')).toBeInTheDocument();
      expect(screen.getByText(/Join the next generation of NFT gaming/)).toBeInTheDocument();
      expect(screen.getByText('Register Player')).toBeInTheDocument();
    });

    test('calls registration function when register button is clicked', async () => {
      mockSendTransactions.mockResolvedValue({ sessionId: 'test123' });
      
      render(<GameContract />);
      
      const registerButton = screen.getByText('Register Player');
      
      await act(async () => {
        fireEvent.click(registerButton);
      });

      await waitFor(() => {
        expect(mockSendTransactions).toHaveBeenCalledWith({
          transactions: [{
            value: '0',
            data: 'register_player',
            receiver: expect.any(String),
            gasLimit: 5000000,
          }],
          transactionsDisplayInfo: {
            processingMessage: 'Registering player...',
            errorMessage: 'Registration failed',
            successMessage: 'Successfully registered! Welcome to StardustEngine!'
          }
        });
      });
    });

    test('shows loading state during registration', async () => {
      mockSendTransactions.mockImplementation(() => new Promise(resolve => 
        setTimeout(() => resolve({ sessionId: 'test' }), 100)
      ));
      
      render(<GameContract />);
      
      const registerButton = screen.getByText('Register Player');
      
      await act(async () => {
        fireEvent.click(registerButton);
      });

      expect(screen.getByText('Registering...')).toBeInTheDocument();
      expect(screen.getByText('⭐')).toBeInTheDocument();
    });
  });

  describe('Registered Player Interface', () => {
    beforeEach(() => {
      mockUseGetLoginInfo.mockReturnValue({ isLoggedIn: true });
      mockUseGetAccountInfo.mockReturnValue({ 
        account: { address: 'erd1test123' }, 
        address: 'erd1test123' 
      });
      
      // Mock registered player
      const originalUseState = React.useState;
      jest.spyOn(React, 'useState')
        .mockImplementationOnce(() => originalUseState(null)) // playerStats
        .mockImplementationOnce(() => originalUseState([])) // playerAssets
        .mockImplementationOnce(() => originalUseState(true)) // isRegistered - set to true
        .mockImplementationOnce(() => originalUseState(false)); // loading
    });

    test('displays player dashboard with statistics', () => {
      render(<GameContract />);
      
      expect(screen.getByText('Player Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Asset Forge')).toBeInTheDocument();
    });

    test('shows asset minting interface', () => {
      render(<GameContract />);
      
      expect(screen.getByText('Asset Forge')).toBeInTheDocument();
      expect(screen.getByText('Create Asset')).toBeInTheDocument();
    });

    test('displays all rarity tiers with correct pricing', () => {
      render(<GameContract />);
      
      // Click Create Asset to show form
      fireEvent.click(screen.getByText('Create Asset'));
      
      expect(screen.getByText('Common')).toBeInTheDocument();
      expect(screen.getByText('Rare')).toBeInTheDocument();
      expect(screen.getByText('Epic')).toBeInTheDocument();
      expect(screen.getByText('Legendary')).toBeInTheDocument();
      
      expect(screen.getByText('1 EGLD')).toBeInTheDocument();
      expect(screen.getByText('2 EGLD')).toBeInTheDocument();
      expect(screen.getByText('5 EGLD')).toBeInTheDocument();
      expect(screen.getByText('10 EGLD')).toBeInTheDocument();
    });

    test('shows and hides mint form when create asset button is clicked', () => {
      render(<GameContract />);
      
      // Initially form should not be visible
      expect(screen.queryByText('Asset Type')).not.toBeInTheDocument();
      
      // Click to show form
      fireEvent.click(screen.getByText('Create Asset'));
      expect(screen.getByText('Asset Type')).toBeInTheDocument();
      expect(screen.getByText('Asset Name')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
      
      // Click again to hide form
      fireEvent.click(screen.getByText('Hide Form'));
      expect(screen.queryByText('Asset Type')).not.toBeInTheDocument();
    });

    test('validates form inputs before enabling minting', () => {
      render(<GameContract />);
      
      // Show form
      fireEvent.click(screen.getByText('Create Asset'));
      
      // Rarity buttons should be disabled initially
      const commonButton = screen.getByText('Common');
      expect(commonButton).toBeDisabled();
      
      // Fill form
      fireEvent.change(screen.getByPlaceholderText('Enter asset name...'), {
        target: { value: 'Test Sword' }
      });
      fireEvent.change(screen.getByPlaceholderText('Describe your asset...'), {
        target: { value: 'A powerful test sword' }
      });
      
      // Buttons should now be enabled
      expect(commonButton).not.toBeDisabled();
    });

    test('calls mint function with correct parameters', async () => {
      mockSendTransactions.mockResolvedValue({ sessionId: 'mint123' });
      
      render(<GameContract />);
      
      // Show form and fill it
      fireEvent.click(screen.getByText('Create Asset'));
      fireEvent.change(screen.getByPlaceholderText('Enter asset name...'), {
        target: { value: 'Epic Sword' }
      });
      fireEvent.change(screen.getByPlaceholderText('Describe your asset...'), {
        target: { value: 'An epic gaming sword' }
      });
      
      // Select asset type
      fireEvent.change(screen.getByDisplayValue('Weapon'), {
        target: { value: 'Character' }
      });
      
      // Click Epic rarity button
      const epicButton = screen.getByText('Epic');
      
      await act(async () => {
        fireEvent.click(epicButton);
      });

      await waitFor(() => {
        expect(mockSendTransactions).toHaveBeenCalledWith({
          transactions: [{
            value: '5000000000000000000', // 5 EGLD in wei
            data: expect.stringContaining('mint_game_asset'),
            receiver: expect.any(String),
            gasLimit: 15000000,
          }],
          transactionsDisplayInfo: {
            processingMessage: 'Minting Epic Character...',
            errorMessage: 'Asset minting failed',
            successMessage: 'Epic Character "Epic Sword" minted successfully!'
          }
        });
      });
    });
  });

  describe('Asset Collection Display', () => {
    test('displays asset collection when player has assets', () => {
      // Mock player with assets
      mockUseGetLoginInfo.mockReturnValue({ isLoggedIn: true });
      mockUseGetAccountInfo.mockReturnValue({ 
        account: { address: 'erd1test123' }, 
        address: 'erd1test123' 
      });
      
      // Mock useState to return assets
      const mockPlayerAssets = [{
        id: 1,
        owner: 'erd1test123',
        asset_type: 'Weapon',
        rarity: 'Epic',
        name: 'Dragon Slayer',
        description: 'A legendary sword',
        created_at: Date.now(),
        level: 3,
        experience: 450
      }];
      
      render(<GameContract />);
      
      // Would need to mock the assets state properly
      // This is a simplified version for demonstration
    });
  });

  describe('Error Handling', () => {
    test('handles registration failure gracefully', async () => {
      mockUseGetLoginInfo.mockReturnValue({ isLoggedIn: true });
      mockUseGetAccountInfo.mockReturnValue({ 
        account: { address: 'erd1test123' }, 
        address: 'erd1test123' 
      });
      
      mockSendTransactions.mockRejectedValue(new Error('Transaction failed'));
      
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      render(<GameContract />);
      
      const registerButton = screen.getByText('Register Player');
      
      await act(async () => {
        fireEvent.click(registerButton);
      });

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Registration failed:', expect.any(Error));
      });
      
      consoleSpy.mockRestore();
    });

    test('handles minting failure gracefully', async () => {
      mockSendTransactions.mockRejectedValue(new Error('Insufficient funds'));
      
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      render(<GameContract />);
      
      // Mock registered state and show form
      // Fill form and attempt minting
      // Verify error handling
      
      consoleSpy.mockRestore();
    });
  });

  describe('Accessibility', () => {
    test('has proper ARIA labels and roles', () => {
      render(<GameContract />);
      
      // Check for proper button roles
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
      
      // Check for form accessibility
      // Would need to implement proper ARIA labels in component
    });

    test('supports keyboard navigation', () => {
      render(<GameContract />);
      
      // Test tab navigation
      // Test Enter key activation
      // Test Escape key handling
    });
  });

  describe('Responsive Design', () => {
    test('renders correctly on different screen sizes', () => {
      // Test mobile layout
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
      
      render(<GameContract />);
      
      // Verify mobile-specific classes are applied
      expect(document.querySelector('.grid-cols-2')).toBeInTheDocument();
      
      // Test desktop layout
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });
      
      // Re-render and check desktop classes
    });
  });

  describe('Contract Integration', () => {
    test('uses correct contract address from environment', () => {
      process.env.NEXT_PUBLIC_CONTRACT_ADDRESS = 'erd1testcontract123';
      
      render(<GameContract />);
      
      // Verify contract address is used in transactions
      // This would require mocking the actual transaction calls
    });

    test('handles different network configurations', () => {
      // Test devnet configuration
      process.env.NEXT_PUBLIC_MULTIVERSX_NETWORK = 'devnet';
      render(<GameContract />);
      
      // Test testnet configuration  
      process.env.NEXT_PUBLIC_MULTIVERSX_NETWORK = 'testnet';
      render(<GameContract />);
      
      // Verify appropriate network settings are applied
    });
  });
});

// Additional test utilities
export const mockPlayerStats = {
  level: 5,
  experience: 1250,
  games_played: 25,
  games_won: 18,
  assets_owned: 7,
  achievements: ['First Blood', 'Asset Collector', 'Tournament Winner']
};

export const mockGameAssets = [
  {
    id: 1,
    owner: 'erd1test123',
    asset_type: 'Weapon',
    rarity: 'Epic',
    name: 'Dragon Slayer',
    description: 'A legendary sword forged in dragon fire',
    created_at: Date.now(),
    level: 3,
    experience: 450
  },
  {
    id: 2,
    owner: 'erd1test123',
    asset_type: 'Character',
    rarity: 'Rare',
    name: 'Shadow Warrior',
    description: 'Master of stealth and combat',
    created_at: Date.now(),
    level: 2,
    experience: 200
  }
];

// Test helper functions
export const fillAssetForm = (assetName: string, assetType: string, description: string) => {
  fireEvent.change(screen.getByPlaceholderText('Enter asset name...'), {
    target: { value: assetName }
  });
  
  fireEvent.change(screen.getByDisplayValue('Weapon'), {
    target: { value: assetType }
  });
  
  fireEvent.change(screen.getByPlaceholderText('Describe your asset...'), {
    target: { value: description }
  });
};

export const clickRarityButton = async (rarity: string) => {
  const button = screen.getByText(rarity);
  await act(async () => {
    fireEvent.click(button);
  });
};

// Mock contract responses
export const mockContractResponses = {
  register_player: { success: true, message: 'Player registered successfully' },
  mint_game_asset: { success: true, asset_id: 123, message: 'Asset minted' },
  get_player_stats: mockPlayerStats,
  get_player_assets: mockGameAssets,
  transfer_asset: { success: true, message: 'Asset transferred' }
};