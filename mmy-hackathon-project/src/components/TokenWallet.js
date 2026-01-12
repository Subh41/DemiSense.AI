import React, { useState } from 'react';
import { Wallet, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const TokenWallet = () => {
  const [balance, setBalance] = useState(1000);
  const [transactions, setTransactions] = useState([
    { id: 1, type: 'credit', amount: 500, description: 'Appointment Payment', date: '2024-03-15' },
    { id: 2, type: 'debit', amount: 200, description: 'Consultation Fee', date: '2024-03-14' },
    { id: 3, type: 'credit', amount: 300, description: 'Treatment Reward', date: '2024-03-13' },
  ]);

  const [showAddFunds, setShowAddFunds] = useState(false);
  const [addAmount, setAddAmount] = useState('');

  const handleAddFunds = () => {
    if (addAmount && !isNaN(addAmount) && parseFloat(addAmount) > 0) {
      const newTransaction = {
        id: transactions.length + 1,
        type: 'credit',
        amount: parseFloat(addAmount),
        description: 'Funds Added',
        date: new Date().toISOString().split('T')[0]
      };
      
      setTransactions([newTransaction, ...transactions]);
      setBalance(balance + parseFloat(addAmount));
      setAddAmount('');
      setShowAddFunds(false);
    }
  };

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '2rem',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '2rem',
        gap: '1rem'
      }}>
        <Wallet size={32} style={{ color: '#4A90E2' }} />
        <h1 style={{ margin: 0, color: '#1a1a1a', fontSize: '2rem' }}>
          Token Wallet
        </h1>
      </div>

      {/* Balance Card */}
      <div style={{
        background: 'linear-gradient(135deg, #4A90E2, #357ABD)',
        color: 'white',
        padding: '2rem',
        borderRadius: '16px',
        marginBottom: '2rem',
        boxShadow: '0 8px 32px rgba(74, 144, 226, 0.3)'
      }}>
        <div style={{ marginBottom: '1rem' }}>
          <p style={{ margin: 0, opacity: 0.9, fontSize: '0.9rem' }}>
            Current Balance
          </p>
          <h2 style={{ margin: '0.5rem 0', fontSize: '3rem', fontWeight: 'bold' }}>
            {balance.toLocaleString()} Tokens
          </h2>
        </div>
        
        <button
          onClick={() => setShowAddFunds(true)}
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.3s ease'
          }}
        >
          <ArrowUpRight size={16} />
          Add Funds
        </button>
      </div>

      {/* Add Funds Modal */}
      {showAddFunds && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '16px',
            width: '400px',
            maxWidth: '90%'
          }}>
            <h3 style={{ marginTop: 0, color: '#1a1a1a' }}>Add Funds</h3>
            <input
              type="number"
              value={addAmount}
              onChange={(e) => setAddAmount(e.target.value)}
              placeholder="Enter amount"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '1rem',
                margin: '1rem 0'
              }}
            />
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={handleAddFunds}
                style={{
                  flex: 1,
                  background: '#4A90E2',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                Add
              </button>
              <button
                onClick={() => {
                  setShowAddFunds(false);
                  setAddAmount('');
                }}
                style={{
                  flex: 1,
                  background: '#f5f5f5',
                  color: '#333',
                  border: 'none',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transactions */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '2rem',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
      }}>
        <h3 style={{ marginTop: 0, marginBottom: '1.5rem', color: '#1a1a1a' }}>
          Recent Transactions
        </h3>
        
        {transactions.length === 0 ? (
          <p style={{ color: '#666', textAlign: 'center', padding: '2rem 0' }}>
            No transactions yet
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem',
                  border: '1px solid #eee',
                  borderRadius: '8px',
                  background: '#fafafa'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: transaction.type === 'credit' ? '#e8f5e8' : '#ffe8e8'
                  }}>
                    {transaction.type === 'credit' ? (
                      <TrendingUp size={20} style={{ color: '#4CAF50' }} />
                    ) : (
                      <TrendingDown size={20} style={{ color: '#f44336' }} />
                    )}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontWeight: 'bold', color: '#1a1a1a' }}>
                      {transaction.description}
                    </p>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
                      {transaction.date}
                    </p>
                  </div>
                </div>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  color: transaction.type === 'credit' ? '#4CAF50' : '#f44336'
                }}>
                  {transaction.type === 'credit' ? '+' : '-'}
                  {transaction.amount} Tokens
                  {transaction.type === 'credit' ? (
                    <ArrowUpRight size={16} />
                  ) : (
                    <ArrowDownRight size={16} />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TokenWallet;