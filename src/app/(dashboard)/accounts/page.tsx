'use client';

import { Suspense, useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Skeleton,
  CircularProgress,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import SyncIcon from '@mui/icons-material/Sync';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AddIcon from '@mui/icons-material/Add';
import LinkIcon from '@mui/icons-material/Link';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
  useAccounts,
  useCreateAccount,
  useUpdateAccount,
  useDeleteAccount,
  useConnectAmazon,
  useDisconnectAmazon,
} from '@/hooks/useAccounts';
import { useSyncStatus, useTriggerSync } from '@/hooks/useFinance';
import { useUserStore } from '@/store/userStore';
import { toast } from '@/store/toastStore';
import { formatDateTime } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';

const MARKETPLACES = [
  { id: 'ATVPDKIKX0DER', label: 'United States', region: 'NA' as const },
  { id: 'A2EUQ1WTGCTBG2', label: 'Canada', region: 'NA' as const },
  { id: 'A1AM78C64UM0Y8', label: 'Mexico', region: 'NA' as const },
  { id: 'A1PA6795UKMFR9', label: 'Germany', region: 'EU' as const },
  { id: 'A1RKKUPIHCS9HS', label: 'Spain', region: 'EU' as const },
  { id: 'A21TJRUUN4KGV', label: 'India', region: 'IN' as const },
];

const SYNC_TYPES = ['orders', 'inventory', 'finance', 'listings', 'reports'] as const;

function ConnectionBadge({
  isConnected,
  tokenExpiresAt,
}: {
  isConnected: boolean;
  tokenExpiresAt: string | null;
}) {
  const expired =
    isConnected && tokenExpiresAt && new Date(tokenExpiresAt) < new Date();

  if (!isConnected) {
    return <Chip label="Not connected" size="small" variant="outlined" />;
  }
  if (expired) {
    return <Chip label="Token expired" size="small" color="warning" />;
  }
  return <Chip label="Connected" size="small" color="info" />;
}

function AccountsContent() {
  const searchParams = useSearchParams();
  const isAdmin = useUserStore((s) => s.isAdmin());
  const { data: accounts, isLoading } = useAccounts();
  const { data: syncData } = useSyncStatus();
  const createAccount = useCreateAccount();
  const updateAccount = useUpdateAccount();
  const deleteAccount = useDeleteAccount();
  const connectAmazon = useConnectAmazon();
  const disconnectAmazon = useDisconnectAmazon();
  const triggerSync = useTriggerSync();

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [form, setForm] = useState({ name: '', marketplace_id: MARKETPLACES[0].id });
  const [syncType, setSyncType] = useState<string>('orders');

  useEffect(() => {
    if (searchParams.get('connected') === '1') {
      toast('Amazon account connected successfully', 'success');
    }
    const error = searchParams.get('error');
    if (error) toast(decodeURIComponent(error), 'error');
  }, [searchParams]);

  const selectedMarketplace = MARKETPLACES.find((m) => m.id === form.marketplace_id)!;

  const getLastSync = (accountId: string) =>
    syncData?.recentJobs?.find((j) => j.account_id === accountId);

  const handleCreate = () => {
    createAccount.mutate(
      {
        name: form.name,
        marketplace_id: form.marketplace_id,
        region: selectedMarketplace.region,
      },
      {
        onSuccess: () => {
          setShowModal(false);
          setForm({ name: '', marketplace_id: MARKETPLACES[0].id });
        },
      }
    );
  };

  const handleRename = (id: string) => {
    if (!editName.trim()) return;
    updateAccount.mutate({ id, name: editName }, { onSuccess: () => setEditingId(null) });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1.5,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Manage up to 5 Amazon seller accounts ({accounts?.length || 0}/5)
        </Typography>
        {isAdmin && (accounts?.length || 0) < 5 && (
          <Button
            variant="contained"
            color="inherit"
            size="small"
            startIcon={<AddIcon />}
            onClick={() => setShowModal(true)}
            sx={{ bgcolor: 'grey.800', '&:hover': { bgcolor: 'grey.700' } }}
          >
            Add Account
          </Button>
        )}
      </Box>

      {isLoading ? (
        <Grid container spacing={2}>
          {[1, 2, 3].map((i) => (
            <Grid key={i} size={{ xs: 12, md: 6, xl: 4 }}>
              <Skeleton variant="rounded" height={224} />
            </Grid>
          ))}
        </Grid>
      ) : accounts?.length === 0 ? (
        <Card
          variant="outlined"
          sx={{
            borderStyle: 'dashed',
            py: 6,
            textAlign: 'center',
          }}
        >
          <CardContent>
            <Typography color="text.secondary">No seller accounts yet.</Typography>
            {isAdmin && (
              <Button
                variant="contained"
                color="primary"
                size="small"
                sx={{ mt: 2 }}
                onClick={() => setShowModal(true)}
              >
                Add your first account
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={2}>
          {accounts?.map((account) => {
            const lastSync = getLastSync(account.id);
            return (
              <Grid key={account.id} size={{ xs: 12, md: 6, xl: 4 }}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        gap: 1,
                      }}
                    >
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        {editingId === account.id ? (
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <TextField
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              size="small"
                              fullWidth
                              autoFocus
                            />
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => handleRename(account.id)}
                            >
                              Save
                            </Button>
                          </Box>
                        ) : (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {account.name}
                            </Typography>
                            {isAdmin && (
                              <IconButton
                                size="small"
                                onClick={() => {
                                  setEditingId(account.id);
                                  setEditName(account.name);
                                }}
                              >
                                <EditIcon sx={{ fontSize: 14 }} />
                              </IconButton>
                            )}
                          </Box>
                        )}
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ mt: 0.5, fontFamily: 'monospace', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                        >
                          {account.seller_id}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-end',
                          gap: 0.5,
                        }}
                      >
                        <ConnectionBadge
                          isConnected={account.is_connected}
                          tokenExpiresAt={account.token_expires_at}
                        />
                        <Chip
                          size="small"
                          icon={
                            account.is_active ? (
                              <CheckCircleIcon sx={{ fontSize: 14 }} />
                            ) : (
                              <CancelIcon sx={{ fontSize: 14 }} />
                            )
                          }
                          label={account.is_active ? 'Active' : 'Inactive'}
                          color={account.is_active ? 'success' : 'default'}
                          variant="outlined"
                        />
                      </Box>
                    </Box>

                    <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">
                          Region
                        </Typography>
                        <Typography variant="body2"  sx={{ fontWeight: 500 }}>
                          {account.region}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">
                          Marketplace
                        </Typography>
                        <Typography variant="caption"   sx={{ fontWeight: 500, fontFamily: 'monospace' }}>
                          {account.marketplace_id}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <AccessTimeIcon sx={{ fontSize: 16 }} color="action" />
                          <Typography variant="body2" color="text.secondary">
                            Last Synced
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          {formatDateTime(account.last_synced_at)}
                        </Typography>
                      </Box>
                      {lastSync && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">
                            Last Job
                          </Typography>
                          <Typography
                            variant="caption"
                            
                            color={
                              lastSync.status === 'success'
                                ? 'success.main'
                                : lastSync.status === 'failed'
                                  ? 'error.main'
                                  : 'info.main'
                            }
                           sx={{ fontWeight: 500 }}>
                            {lastSync.sync_type} · {lastSync.status}
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    {isAdmin && (
                      <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {!account.is_connected ? (
                            <Button
                              variant="contained"
                              color="warning"
                              size="small"
                              fullWidth
                              startIcon={
                                connectAmazon.isPending ? (
                                  <CircularProgress size={14} color="inherit" />
                                ) : (
                                  <LinkIcon sx={{ fontSize: 14 }} />
                                )
                              }
                              disabled={connectAmazon.isPending}
                              onClick={() => connectAmazon.mutate(account.id)}
                            >
                              Connect Amazon
                            </Button>
                          ) : (
                            <Button
                              variant="outlined"
                              size="small"
                              fullWidth
                              startIcon={
                                disconnectAmazon.isPending ? (
                                  <CircularProgress size={14} />
                                ) : (
                                  <LinkOffIcon sx={{ fontSize: 14 }} />
                                )
                              }
                              disabled={disconnectAmazon.isPending}
                              onClick={() => disconnectAmazon.mutate(account.id)}
                            >
                              Disconnect
                            </Button>
                          )}
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() =>
                              updateAccount.mutate({ id: account.id, is_active: !account.is_active })
                            }
                          >
                            {account.is_active ? 'Deactivate' : 'Activate'}
                          </Button>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => {
                              if (confirm('Delete this account and all its data?')) {
                                deleteAccount.mutate(account.id);
                              }
                            }}
                          >
                            <DeleteIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <FormControl size="small" fullWidth>
                            <Select
                              value={syncType}
                              onChange={(e) => setSyncType(e.target.value)}
                            >
                              {SYNC_TYPES.map((t) => (
                                <MenuItem key={t} value={t}>
                                  {t}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          <Button
                            variant="contained"
                            size="small"
                            disabled={triggerSync.isPending || !account.is_connected}
                            startIcon={
                              <SyncIcon
                                sx={{
                                  fontSize: 14,
                                  animation: triggerSync.isPending ? 'spin 1s linear infinite' : 'none',
                                  '@keyframes spin': {
                                    '0%': { transform: 'rotate(0deg)' },
                                    '100%': { transform: 'rotate(360deg)' },
                                  },
                                }}
                              />
                            }
                            onClick={() =>
                              triggerSync.mutate(
                                { accountId: account.id, syncType },
                                {
                                  onSuccess: () => toast('Sync triggered', 'success'),
                                  onError: (err: Error) => toast(err.message, 'error'),
                                }
                              )
                            }
                          >
                            Sync
                          </Button>
                        </Box>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      <Dialog open={showModal} onClose={() => setShowModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Seller Account</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Account name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="My US Store"
              fullWidth
              size="small"
            />
            <FormControl fullWidth size="small">
              <InputLabel>Marketplace</InputLabel>
              <Select
                label="Marketplace"
                value={form.marketplace_id}
                onChange={(e) => setForm({ ...form, marketplace_id: e.target.value })}
              >
                {MARKETPLACES.map((m) => (
                  <MenuItem key={m.id} value={m.id}>
                    {m.label} ({m.region})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowModal(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="inherit"
            disabled={!form.name.trim() || createAccount.isPending}
            onClick={handleCreate}
            sx={{ bgcolor: 'grey.800', '&:hover': { bgcolor: 'grey.700' } }}
          >
            {createAccount.isPending ? <CircularProgress size={20} color="inherit" /> : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

function AccountsPageFallback() {
  return <Skeleton variant="rounded" height={192} />;
}

export default function AccountsPage() {
  return (
    <Suspense fallback={<AccountsPageFallback />}>
      <AccountsContent />
    </Suspense>
  );
}
