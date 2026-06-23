'use client';

import { useAccounts } from '@/hooks/useAccounts';
import { useAccountStore } from '@/store/accountStore';
import { FormControl, Select, MenuItem } from '@mui/material';

export function AccountSelector() {
  const { data: accounts, isLoading } = useAccounts();
  const { selectedAccountId, setSelectedAccountId } = useAccountStore();

  return (
    <FormControl size="small" sx={{ minWidth: 100 }}>
      <Select
        value={selectedAccountId || ''}
        onChange={(e) => setSelectedAccountId(e.target.value || null)}
        disabled={isLoading}
        displayEmpty
        sx={{
          fontSize: '0.6875rem',
          bgcolor: 'background.paper',
          '& .MuiSelect-select': { py: 0.5, fontSize: '0.6875rem' },
        }}
      >
        <MenuItem value="" sx={{ fontSize: '0.6875rem' }}>
          <em>All Accounts</em>
        </MenuItem>
        {accounts?.map((account) => (
          <MenuItem key={account.id} value={account.id} sx={{ fontSize: '0.6875rem' }}>
            {account.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
