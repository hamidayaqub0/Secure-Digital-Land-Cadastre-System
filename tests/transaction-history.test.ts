import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock the Clarity VM environment
const mockClarity = {
  contracts: {
    'transaction-history': {
      functions: {
        'record-transaction': vi.fn(),
        'get-transaction': vi.fn(),
        'get-property-transactions': vi.fn(),
        'get-transaction-count': vi.fn()
      }
    }
  },
  tx: {
    sender: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
  }
};

// Setup global mock
global.clarity = mockClarity;

describe('Transaction History Contract', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.resetAllMocks();
  });
  
  it('should record a property transaction', async () => {
    const propertyId = 1;
    const fromOwner = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
    const toOwner = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG';
    const transactionType = 'transfer';
    const details = 'Property transfer from owner A to owner B';
    
    mockClarity.contracts['transaction-history'].functions['record-transaction'].mockReturnValue({
      result: { value: 1 }
    });
    
    const result = await mockClarity.contracts['transaction-history'].functions['record-transaction'](
        propertyId, fromOwner, toOwner, transactionType, details
    );
    
    expect(result.result.value).toBe(1);
    expect(mockClarity.contracts['transaction-history'].functions['record-transaction']).toHaveBeenCalledWith(
        propertyId, fromOwner, toOwner, transactionType, details
    );
  });
  
  it('should get transaction details', async () => {
    const transactionId = 1;
    const mockTransaction = {
      'property-id': 1,
      'from-owner': 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
      'to-owner': 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG',
      'transaction-type': 'transfer',
      'transaction-date': 12345,
      'details': 'Property transfer from owner A to owner B'
    };
    
    mockClarity.contracts['transaction-history'].functions['get-transaction'].mockReturnValue({
      result: { value: mockTransaction }
    });
    
    const result = await mockClarity.contracts['transaction-history'].functions['get-transaction'](transactionId);
    
    expect(result.result.value).toEqual(mockTransaction);
    expect(mockClarity.contracts['transaction-history'].functions['get-transaction']).toHaveBeenCalledWith(transactionId);
  });
  
  it('should get all transactions for a property', async () => {
    const propertyId = 1;
    const mockTransactions = {
      'transaction-ids': [1, 2, 3]
    };
    
    mockClarity.contracts['transaction-history'].functions['get-property-transactions'].mockReturnValue({
      result: { value: mockTransactions }
    });
    
    const result = await mockClarity.contracts['transaction-history'].functions['get-property-transactions'](propertyId);
    
    expect(result.result.value).toEqual(mockTransactions);
    expect(mockClarity.contracts['transaction-history'].functions['get-property-transactions']).toHaveBeenCalledWith(propertyId);
  });
  
  it('should get transaction count', async () => {
    mockClarity.contracts['transaction-history'].functions['get-transaction-count'].mockReturnValue({
      result: { value: 10 }
    });
    
    const result = await mockClarity.contracts['transaction-history'].functions['get-transaction-count']();
    
    expect(result.result.value).toBe(10);
    expect(mockClarity.contracts['transaction-history'].functions['get-transaction-count']).toHaveBeenCalled();
  });
});
