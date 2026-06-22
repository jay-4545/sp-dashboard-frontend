'use client';

import { useAccounts } from '@/hooks/useAccounts';
import { useAccountStore } from '@/store/accountStore';
import { FormControl, Select, MenuItem } from '@mui/material';

export function AccountSelector() {
  const { data: accounts, isLoading } = useAccounts();
  const { selectedAccountId, setSelectedAccountId } = useAccountStore();

  return (
    <FormControl size="small" sx={{ minWidth: 120 }}>
      <Select
        value={selectedAccountId || ''}
        onChange={(e) => setSelectedAccountId(e.target.value || null)}
        disabled={isLoading}
        displayEmpty
        sx={{ fontSize: '0.8125rem', bgcolor: 'background.paper' }}
      >
        <MenuItem value="">
          <em>All Accounts</em>
        </MenuItem>
        {accounts?.map((account) => (
          <MenuItem key={account.id} value={account.id}>
            {account.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
