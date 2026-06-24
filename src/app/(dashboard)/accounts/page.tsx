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
  IconButton,
  Skeleton,
  CircularProgress,
  Divider,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SyncIcon from '@mui/icons-material/Sync';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AddIcon from '@mui/icons-material/Add';
import LinkIcon from '@mui/icons-material/Link';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import StorefrontIcon from '@mui/icons-material/Storefront';
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
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { PageHeader } from '@/components/shared/PageHeader';
import { SyncType } from '@/types';

const INDIA_MARKETPLACE = {
  id: 'A21TJRUUN4KGV',
  label: 'Amazon India',
  region: 'IN' as const,
};

const SYNC_TYPES = ['orders', 'inventory', 'finance', 'listings', 'products', 'reports'] as const;

function getMarketplaceLabel(marketplaceId: string) {
  return marketplaceId === INDIA_MARKETPLACE.id ? INDIA_MARKETPLACE.label : marketplaceId;
}

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
    return (
      <Chip
        label="Not connected"
        size="small"
        variant="outlined"
        icon={<LinkOffIcon sx={{ fontSize: '14px !important' }} />}
      />
    );
  }
  if (expired) {
    return (
      <Chip
        label="Token expired"
        size="small"
        color="warning"
        variant="outlined"
        icon={<AccessTimeIcon sx={{ fontSize: '14px !important' }} />}
      />
    );
  }
  return (
    <Chip
      label="Connected"
      size="small"
      color="success"
      variant="outlined"
      icon={<CheckCircleIcon sx={{ fontSize: '14px !important' }} />}
    />
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="caption" sx={{ fontWeight: 500, textAlign: 'right' }}>
        {value}
      </Typography>
    </Box>
  );
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
  const [form, setForm] = useState({ name: '', marketplace_id: INDIA_MARKETPLACE.id });
  const [syncType, setSyncType] = useState<SyncType>('orders');
  const [syncConfirm, setSyncConfirm] = useState<{ accountId: string; accountName: string } | null>(null);

  useEffect(() => {
    if (searchParams.get('connected') === '1') {
      toast('Amazon account connected successfully', 'success');
    }
    const error = searchParams.get('error');
    if (error) toast(decodeURIComponent(error), 'error');
  }, [searchParams]);

  const selectedMarketplace = INDIA_MARKETPLACE;

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
          setForm({ name: '', marketplace_id: INDIA_MARKETPLACE.id });
        },
      }
    );
  };

  const handleRename = (id: string) => {
    if (!editName.trim()) return;
    updateAccount.mutate({ id, name: editName }, { onSuccess: () => setEditingId(null) });
  };

  const handleConfirmSync = () => {
    if (!syncConfirm) return;
    triggerSync.mutate(
      { accountId: syncConfirm.accountId, syncType },
      {
        onSuccess: () => {
          toast('Sync triggered', 'success');
          setSyncConfirm(null);
        },
        onError: (err: Error) => {
          toast(err.message, 'error');
          setSyncConfirm(null);
        },
      }
    );
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      <PageHeader
        title="Seller Accounts"
        description={`Connect and manage up to 5 Amazon India seller accounts · ${accounts?.length || 0}/5 used`}
        variant="light"
        action={
          isAdmin && (accounts?.length || 0) < 5 ? (
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon sx={{ fontSize: 18 }} />}
              onClick={() => setShowModal(true)}
            >
              Add Account
            </Button>
          ) : undefined
        }
      />

      {isLoading ? (
        <Grid container spacing={2}>
          {[1, 2, 3].map((i) => (
            <Grid key={i} size={{ xs: 12, md: 6, xl: 4 }}>
              <Skeleton variant="rounded" height={260} />
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
            bgcolor: 'background.paper',
          }}
        >
          <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <StorefrontIcon />
            </Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              No seller accounts yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 320 }}>
              Add your first Amazon seller account to start syncing orders, inventory, and finance data.
            </Typography>
            {isAdmin && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                sx={{ mt: 0.5 }}
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
                <Card
                  variant="outlined"
                  sx={{
                    height: '100%',
                    bgcolor: 'background.paper',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                    '&:hover': { borderColor: 'primary.light', boxShadow: 2 },
                    borderLeft: 4,
                    borderLeftColor: account.is_connected ? 'success.main' : 'grey.300',
                  }}
                >
                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
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
                          <Box sx={{ display: 'flex', gap: 0.75 }}>
                            <TextField
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              size="small"
                              fullWidth
                              autoFocus
                            />
                            <Button
                              variant="contained"
                              color="primary"
                              size="small"
                              onClick={() => handleRename(account.id)}
                            >
                              Save
                            </Button>
                          </Box>
                        ) : (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
                            <Typography
                              variant="subtitle2"
                              sx={{
                                fontWeight: 600,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {account.name}
                            </Typography>
                            {isAdmin && (
                              <IconButton
                                size="small"
                                onClick={() => {
                                  setEditingId(account.id);
                                  setEditName(account.name);
                                }}
                                sx={{ color: 'text.secondary' }}
                              >
                                <EditIcon sx={{ fontSize: 14 }} />
                              </IconButton>
                            )}
                          </Box>
                        )}
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            mt: 0.25,
                            display: 'block',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
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
                          flexShrink: 0,
                        }}
                      >
                        <ConnectionBadge
                          isConnected={account.is_connected}
                          tokenExpiresAt={account.token_expires_at}
                        />
                        <Chip
                          size="small"
                          label={account.is_active ? 'Active' : 'Inactive'}
                          color={account.is_active ? 'success' : 'default'}
                          variant="outlined"
                          sx={{ height: 22 }}
                        />
                      </Box>
                    </Box>

                    <Divider sx={{ my: 1.5 }} />

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                      <InfoRow label="Region" value={account.region} />
                      <InfoRow
                        label="Marketplace"
                        value={getMarketplaceLabel(account.marketplace_id)}
                      />
                      <InfoRow
                        label="Marketplace ID"
                        value={account.marketplace_id}
                      />
                      <InfoRow
                        label="Last synced"
                        value={formatDateTime(account.last_synced_at)}
                      />
                      {lastSync && (
                        <InfoRow
                          label="Last job"
                          value={`${lastSync.sync_type} · ${lastSync.status}`}
                        />
                      )}
                    </Box>

                    {isAdmin && (
                      <>
                        <Divider sx={{ my: 1.5 }} />
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <Box sx={{ display: 'flex', gap: 0.75 }}>
                            {!account.is_connected ? (
                              <Button
                                variant="contained"
                                color="secondary"
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
                                color="inherit"
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
                              color="inherit"
                              size="small"
                              sx={{ minWidth: 96, flexShrink: 0 }}
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
                              sx={{ border: 1, borderColor: 'divider', borderRadius: 1, flexShrink: 0 }}
                            >
                              <DeleteIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Box>
                          <Box sx={{ display: 'flex', gap: 0.75 }}>
                            <FormControl size="small" fullWidth>
                              <Select
                                value={syncType}
                                onChange={(e) => setSyncType(e.target.value as SyncType)}
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
                              color="primary"
                              size="small"
                              disabled={triggerSync.isPending || !account.is_connected}
                              sx={{ minWidth: 88, flexShrink: 0 }}
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
                                setSyncConfirm({ accountId: account.id, accountName: account.name })
                              }
                            >
                              Sync
                            </Button>
                          </Box>
                        </Box>
                      </>
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
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 0.5 }}>
            <TextField
              label="Account name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="My India Store"
              fullWidth
              size="small"
            />
            <TextField
              label="Marketplace"
              value={`${INDIA_MARKETPLACE.label} (${INDIA_MARKETPLACE.region})`}
              fullWidth
              size="small"
              disabled
              helperText="This dashboard supports Amazon India (A21TJRUUN4KGV) only"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setShowModal(false)} color="inherit">
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            disabled={!form.name.trim() || createAccount.isPending}
            onClick={handleCreate}
          >
            {createAccount.isPending ? <CircularProgress size={20} color="inherit" /> : 'Create Account'}
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={!!syncConfirm}
        title="Start Sync"
        message={
          syncConfirm
            ? `Start a "${syncType}" sync for "${syncConfirm.accountName}"? This may take a few minutes.`
            : ''
        }
        confirmLabel="Start Sync"
        confirmColor="primary"
        loading={triggerSync.isPending}
        onCancel={() => setSyncConfirm(null)}
        onConfirm={handleConfirmSync}
      />
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
